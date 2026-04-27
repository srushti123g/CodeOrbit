
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Commit = require("./models/commitModel.js");

dotenv.config();

const REPO_ID = "699034ff60e86e68f02efe64";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connected!");

        console.log(`Checking commits for Repo ID: ${REPO_ID}`);
        const commits = await Commit.find({ repoId: REPO_ID }).sort({ date: -1 });

        console.log(`Found ${commits.length} commits.`);

        commits.forEach((commit, index) => {
            console.log(`\nCommit #${index + 1}:`);
            console.log(`  ID: ${commit._id}`);
            console.log(`  Message: ${commit.message}`);
            console.log(`  Files Count: ${commit.files ? commit.files.length : 'undefined'}`);
            if (commit.files && commit.files.length > 0) {
                console.log(`  First 3 files: ${commit.files.slice(0, 3).join(', ')}`);
            }
        });

        process.exit(0);

    } catch (err) {
        console.error("Error:", err);
        process.exit(1);
    }
};

connectDB();
