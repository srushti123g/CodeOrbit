const mongoose = require("mongoose");
const { Schema } = mongoose;

const CommitSchema = new Schema({
    message: {
        type: String,
        required: true,
    },
    repoId: {
        type: Schema.Types.ObjectId,
        ref: "Repository",
        required: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    s3Path: {
        type: String,
        // This will mock the S3 path for now, or store the actual path if S3 is integrated later
    },
    files: [String],
});

module.exports = mongoose.model("Commit", CommitSchema);
