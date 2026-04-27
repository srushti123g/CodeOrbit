const fs = require('fs').promises;
const path = require('path');
async function initRepo(repoId, userId) {
    const repoPath = path.resolve(process.cwd(), '.apnaGit');
    const commitsPath = path.join(repoPath, 'commits');
    try {
        await fs.rm(repoPath, { recursive: true, force: true }); // Clear existing repo
        await fs.mkdir(repoPath, { recursive: true });
        await fs.mkdir(commitsPath, { recursive: true });
        await fs.mkdir(path.join(repoPath, 'staging'), { recursive: true }); // Create empty staging
        await fs.writeFile(
            path.join(repoPath, "config.json"),
            JSON.stringify({ bucket: process.env.S3_BUCKET, repoId: repoId, userId: userId })
        );
        console.log("Repository initialized successfully (clean slate)");

    }
    catch (err) {
        console.error("Error initializing repository:", err);

    }
}
module.exports = { initRepo };