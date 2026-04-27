const mongoose = require("mongoose");
const { Schema } = mongoose;

const WikiPageSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    repository: {
        type: Schema.Types.ObjectId,
        ref: "Repository",
        required: true,
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
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

// Ensure unique slug per repository
WikiPageSchema.index({ repository: 1, slug: 1 }, { unique: true });

const WikiPage = mongoose.model("WikiPage", WikiPageSchema);
module.exports = WikiPage;
