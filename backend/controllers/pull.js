const fs = require('fs').promises;
const path = require('path');

const { ListObjectsV2Command, GetObjectCommand } = require('@aws-sdk/client-s3');
const { s3, S3_BUCKET } = require('../config/aws-config');

async function pullRepo() {
    const repoPath = path.resolve(process.cwd(), '.apnaGit');
    const commitsPath = path.join(repoPath, 'commits');
    try {
        const command = new ListObjectsV2Command({
            Bucket: S3_BUCKET,
            Prefix: 'commits/'
        });
        const data = await s3.send(command);
        const objects = data.Contents || [];

        for (const object of objects) {
            const key = object.Key;
            const commitIdPart = path.dirname(key).split('/').pop();
            const commitDir = path.join(commitsPath, commitIdPart);

            await fs.mkdir(commitDir, { recursive: true });

            const getCommand = new GetObjectCommand({
                Bucket: S3_BUCKET,
                Key: key,
            });
            const response = await s3.send(getCommand);

            // In SDK v3, Body is a stream. We need to convert it to a Buffer or string.
            const streamToBuffer = async (stream) => {
                return new Promise((resolve, reject) => {
                    const chunks = [];
                    stream.on('data', (chunk) => chunks.push(chunk));
                    stream.on('error', reject);
                    stream.on('end', () => resolve(Buffer.concat(chunks)));
                });
            };

            const fileContent = await streamToBuffer(response.Body);

            await fs.writeFile(
                path.join(repoPath, key),
                fileContent
            );
        }
        console.log("All commits pulled from AWS S3 successfully!");


    } catch (err) {
        console.error('Error pulling from AWS S3:', err);
    }

}
module.exports = { pullRepo };