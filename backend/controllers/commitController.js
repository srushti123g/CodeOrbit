const Commit = require("../models/commitModel");
const Repository = require("../models/repoModel");

async function addCommit(req, res) {
    const { message, repoId, s3Path, authorId } = req.body;
    const userId = req.user ? req.user.id : authorId; // Support both Auth and manual ID

    try {
        const repo = await Repository.findById(repoId);
        if (!repo) {
            return res.status(404).json({ message: "Repository not found!" });
        }

        const newCommit = new Commit({
            message,
            repoId,
            author: userId,
            s3Path: s3Path || "", // Optional for now
            files: req.body.files || [], // Save the file list
        });
        console.log("Saving commit with files:", newCommit.files);

        const result = await newCommit.save();

        // Notification
        if (repo.owner.toString() !== userId) {
            const Notification = require("../models/notificationModel");
            await Notification.create({
                recipient: repo.owner,
                message: `New commit in ${repo.name}: ${message}`,
                type: 'commit',
                link: `/repo/${repoId}`
            });
        }

        res.status(201).json({
            message: "Commit added successfully!",
            commitId: result._id,
        });
    } catch (err) {
        console.error("Error during adding commit : ", err.message);
        res.status(500).json({ message: "Server error" });
    }
}

async function getCommitsByRepo(req, res) {
    const { repoId } = req.params;

    try {
        const commits = await Commit.find({ repoId })
            .populate("author", "username") // Populate author username
            .sort({ date: -1 }); // Newest first

        console.log("getCommitsByRepo: Found commits:", commits.length);
        if (commits.length > 0) {
            console.log("Latest commit files:", commits[0].files);
        }

        res.json(commits);
    } catch (err) {
        console.error("Error during fetching commits : ", err.message);
        res.status(500).json({ message: "Server error" });
    }
}


const { s3, S3_BUCKET } = require("../config/aws-config");

async function getFileContent(req, res) {
    const { commitId } = req.params;
    const { path: filePath } = req.query;

    try {
        const commit = await Commit.findById(commitId);
        if (!commit) {
            return res.status(404).json({ message: "Commit not found" });
        }

        const s3Key = `${commit.s3Path}/${filePath}`;

        const params = {
            Bucket: S3_BUCKET,
            Key: s3Key,
        };

        const data = await s3.getObject(params).promise();
        res.send(data.Body.toString('utf-8'));

    } catch (err) {
        console.error("Error fetching file content:", err);
        res.status(500).json({ message: "Error fetching file content" });
    }
}



async function deleteFile(req, res) {
    const { repoId, userId, fileName } = req.body;

    try {
        // Find the latest commit to get the current state
        const latestCommit = await Commit.findOne({ repoId }).sort({ date: -1 });

        if (!latestCommit) {
            return res.status(404).json({ message: "No commits found to delete from." });
        }

        // Filter out the file to be deleted
        const newFiles = latestCommit.files.filter(f => f !== fileName);

        if (newFiles.length === latestCommit.files.length) {
            return res.status(400).json({ message: "File not found in the latest commit." });
        }

        const newCommit = new Commit({
            message: `Deleted ${fileName}`,
            repoId,
            author: userId,
            s3Path: latestCommit.s3Path, // Reuse the existing S3 path (files still exist there)
            files: newFiles,
        });

        await newCommit.save();

        res.status(201).json({ message: "File deleted successfully!", commit: newCommit });

    } catch (err) {
        console.error("Error deleting file:", err);
        res.status(500).json({ message: "Server error during deletion." });
    }
}

async function getCommitActivity(req, res) {
    const { repoId } = req.params;

    try {
        const commits = await Commit.find({ repoId });

        // Aggregate by date for Heatmap
        const dateMap = {};
        commits.forEach(commit => {
            const date = new Date(commit.date).toISOString().split('T')[0]; // YYYY-MM-DD
            if (dateMap[date]) {
                dateMap[date].count += 1;
            } else {
                dateMap[date] = { date: date, count: 1, level: 1 };
            }
        });

        const heatmapData = Object.values(dateMap).map(item => ({
            ...item,
            level: item.count > 4 ? 4 : item.count // Simple level logic 0-4
        }));

        // Total Commits
        const totalCommits = commits.length;

        // Top Contributors
        const authorMap = {};
        // Fetch author details manually since populate might be heavy for large datasets? 
        // Actually populate is fine here for moderate size.
        // Let's re-fetch with populate to be safe or just use the IDs if valid.
        // For now, let's rely on client-side or a separate easier aggregation.
        // Or simpler:
        const commitsWithAuthors = await Commit.find({ repoId }).populate("author", "username");
        commitsWithAuthors.forEach(commit => {
            const authorName = commit.author ? commit.author.username : "Unknown";
            if (authorMap[authorName]) {
                authorMap[authorName] += 1;
            } else {
                authorMap[authorName] = 1;
            }
        });

        const topContributors = Object.entries(authorMap)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5); // Top 5

        res.json({
            heatmap: heatmapData,
            totalCommits,
            topContributors
        });

    } catch (err) {
        console.error("Error fetching commit activity:", err);
        res.status(500).json({ message: "Server error fetching analytics" });
    }
}

module.exports = {
    addCommit,
    getCommitsByRepo,
    getFileContent,
    deleteFile,
    getCommitActivity
};
