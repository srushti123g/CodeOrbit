const fs = require('fs').promises;
const path = require('path');

async function addRepo(filePath) {
    const repoPath = path.resolve(process.cwd(), '.apnaGit');
    const stagingPath = path.join(repoPath, 'staging');

    try {
        await fs.mkdir(stagingPath, { recursive: true });
        const fileName = path.basename(filePath);

        const stats = await fs.stat(filePath);
        if (stats.isDirectory()) {
            if (fileName === '.apnaGit' || fileName === 'node_modules') return;

            const files = await fs.readdir(filePath);
            for (const file of files) {
                await addRepo(path.join(filePath, file));
            }
        } else {
            await fs.copyFile(filePath, path.join(stagingPath, fileName));
            console.log(`File ${fileName} added to staging area successfully!`);
        }
    }
    catch (err) {
        console.error("Error adding file:", err);
    }
}
module.exports = { addRepo };