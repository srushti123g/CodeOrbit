const PullRequest = require("../models/pullRequestModel");
const Repository = require("../models/repoModel");

async function createPullRequest(req, res) {
    const { repoId } = req.params;
    const { title, description, sourceBranch, targetBranch } = req.body;

    try {
        const repo = await Repository.findById(repoId);
        if (!repo) return res.status(404).json({ message: "Repository not found" });

        const newPR = new PullRequest({
            title,
            description,
            repository: repoId,
            author: req.user.id,
            sourceBranch,
            targetBranch: targetBranch || "main",
        });

        await newPR.save();
        res.status(201).json(newPR);
    } catch (err) {
        console.error("Error creating PR:", err);
        res.status(500).json({ message: "Server error" });
    }
}

async function getAllPullRequests(req, res) {
    const { repoId } = req.params;
    const { status } = req.query;

    try {
        const query = { repository: repoId };
        if (status) query.status = status;

        const prs = await PullRequest.find(query)
            .populate("author", "username profileImage")
            .sort({ updatedAt: -1 });

        res.status(200).json(prs);
    } catch (err) {
        console.error("Error fetching PRs:", err);
        res.status(500).json({ message: "Server error" });
    }
}

async function getPullRequestById(req, res) {
    const { id } = req.params;

    try {
        const pr = await PullRequest.findById(id)
            .populate("author", "username profileImage")
            .populate("repository", "name");

        if (!pr) return res.status(404).json({ message: "Pull Request not found" });

        res.status(200).json(pr);
    } catch (err) {
        console.error("Error fetching PR:", err);
        res.status(500).json({ message: "Server error" });
    }
}

async function updatePullRequest(req, res) {
    const { id } = req.params;
    const { title, description, status } = req.body;

    try {
        const pr = await PullRequest.findById(id);
        if (!pr) return res.status(404).json({ message: "Pull Request not found" });

        // Basic permission check: Owner of PR or Repo Owner (can be enhanced)
        if (pr.author.toString() !== req.user.id) {
            // Check if repo owner
            const repo = await Repository.findById(pr.repository);
            if (repo.owner.toString() !== req.user.id) {
                return res.status(403).json({ message: "Not authorized to update this PR" });
            }
        }

        if (title) pr.title = title;
        if (description) pr.description = description;
        if (status) pr.status = status;
        pr.updatedAt = Date.now();

        await pr.save();
        res.status(200).json(pr);
    } catch (err) {
        console.error("Error updating PR:", err);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = {
    createPullRequest,
    getAllPullRequests,
    getPullRequestById,
    updatePullRequest
};
