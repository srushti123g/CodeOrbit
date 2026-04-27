const mongoose = require("mongoose");
const { Schema } = mongoose;

const ActivitySchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    type: {
        type: String,
        enum: ["REPO_CREATED", "ISSUE_CREATED", "STARRED", "PUSHED"],
        required: true,
    },
    target: {
        type: Schema.Types.ObjectId,
        refPath: "targetModel", // Dynamic reference
        required: true,
    },
    targetModel: {
        type: String,
        enum: ["Repository", "Issue"],
        required: true,
    },
    description: {
        type: String, // "User X created repository Y"
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Activity", ActivitySchema);
