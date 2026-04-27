const mongoose = require("mongoose");
const { Schema } = mongoose;

const PullRequestSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    status: {
        type: String,
        enum: ["open", "closed", "merged"],
        default: "open",
    },
    repository: {
        type: Schema.Types.ObjectId,
        ref: "Repository",
        required: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    sourceBranch: {
        type: String,
        required: true,
    },
    targetBranch: {
        type: String,
        required: true,
        default: "main",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const PullRequest = mongoose.model("PullRequest", PullRequestSchema);
module.exports = PullRequest;
