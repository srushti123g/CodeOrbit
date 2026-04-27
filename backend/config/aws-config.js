const { S3Client } = require('@aws-sdk/client-s3');

const s3 = new S3Client({ region: 'eu-north-1' });
const S3_BUCKET = "srushti-project-assets-2026";

module.exports = { s3, S3_BUCKET };