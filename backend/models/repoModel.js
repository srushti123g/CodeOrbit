const mongoose = require('mongoose');
const { Schema } = mongoose;

const RepositorySchema = new Schema({
    name: {
        type: String,
        required: true,

    },
    description: {
        type: String,
    },
    content: [
        {
            type: String,
        },
    ],
    visibility: {
        type: Boolean,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    issues: [{
        type: Schema.Types.ObjectId,
        ref: 'Issue',
    }],
    collaborators: [{
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        role: { type: String, enum: ['owner', 'maintainer', 'contributor'], default: 'contributor' }
    }]
});

const Repository = mongoose.model("Repository", RepositorySchema);
module.exports = Repository;