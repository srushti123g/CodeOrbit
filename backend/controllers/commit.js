const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

async function commitRepo(message) {
  const repoPath = path.resolve(process.cwd(), '.apnaGit');
  const stagedPath = path.join(repoPath, 'staging');
  const commitPath = path.join(repoPath, 'commits');
  try {
    const commitID = uuidv4();
    const commitDir = path.join(commitPath, commitID);
    await fs.mkdir(commitDir, { recursive: true });

    // Recursive copy from staging to commitDir
    async function copyRecursive(src, dest) {
      const stats = await fs.stat(src);
      if (stats.isDirectory()) {
        await fs.mkdir(dest, { recursive: true });
        const entries = await fs.readdir(src);
        for (const entry of entries) {
          await copyRecursive(path.join(src, entry), path.join(dest, entry));
        }
      } else {
        await fs.copyFile(src, dest);
      }
    }

    await copyRecursive(stagedPath, commitDir);
    await fs.writeFile(
      path.join(commitDir, 'commit.json'),
      JSON.stringify({ message, date: new Date().toISOString() })
    );
    console.log(`Committed with ID: ${commitID} and message: "${message}"`);
  } catch (err) {
    console.error("Error committing files:", err);
  }

}

module.exports = { commitRepo };