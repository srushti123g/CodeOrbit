const fs = require('fs').promises;
const path = require('path');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const { s3, S3_BUCKET } = require('../config/aws-config');

async function pushRepo() {
    const repoPath = path.resolve(process.cwd(), '.apnaGit');
    const commitsPath = path.join(repoPath, 'commits');

    try {
        // ... existing config reading ...
        const configPath = path.join(repoPath, 'config.json');
        const configData = await fs.readFile(configPath, 'utf-8');
        const config = JSON.parse(configData);
        const { repoId, userId } = config;

        if (!repoId || !userId) {
            console.error("Error: Missing repoId or userId in .apnaGit/config.json");
            return;
        }

        const commitDirs = await fs.readdir(commitsPath);
        for (const commitDir of commitDirs) {
            const commitPath = path.join(commitsPath, commitDir);

            // Helper to get all files recursively
            async function getFiles(dir) {
                const dirents = await fs.readdir(dir, { withFileTypes: true });
                const files = await Promise.all(dirents.map((dirent) => {
                    const res = path.resolve(dir, dirent.name);
                    return dirent.isDirectory() ? getFiles(res) : res;
                }));
                return files.flat();
            }

            const allFilePaths = await getFiles(commitPath);

            // Filter out commit.json from upload list (we read it manually)
            const filesToUpload = allFilePaths.filter(f => path.basename(f) !== 'commit.json');

            // Upload in parallel
            const uploadPromises = filesToUpload.map(async (filePath) => {
                const relativePath = path.relative(commitPath, filePath);
                const fileContent = await fs.readFile(filePath);
                const command = new PutObjectCommand({
                    Bucket: S3_BUCKET,
                    Key: `commits/${commitDir}/${relativePath.replace(/\\/g, '/')}`, // Ensure forward slashes for S3
                    Body: fileContent,
                });
                return s3.send(command);
            });

            await Promise.all(uploadPromises);

            // Read commit metadata
            const commitJsonPath = path.join(commitPath, 'commit.json');
            const commitData = await fs.readFile(commitJsonPath, 'utf-8');
            const { message } = JSON.parse(commitData);

            // Notify Backend
            console.log(`Registering commit ${commitDir} with backend...`);

            // Create list of relative formatted paths for the DB
            const fileList = filesToUpload.map(filePath => path.relative(commitPath, filePath).replace(/\\/g, '/'));

            const response = await fetch("http://localhost:3000/commit/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    repoId,
                    authorId: userId,
                    message,
                    s3Path: `commits/${commitDir}`,
                    files: fileList // Sending the list of files
                })
            });

            if (response.ok) {
                console.log(`Commit ${commitDir} pushed and registered successfully!`);
            } else {
                console.error(`Failed to register commit ${commitDir}:`, await response.text());
            }
        }
        console.log('All files pushed to AWS S3 and registered!');
        console.log('All files pushed to AWS S3 and registered!');

    } catch (err) {
        console.error('Error pushing to AWS S3:', err);
    }
}
module.exports = { pushRepo };