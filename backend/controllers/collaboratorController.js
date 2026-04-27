const Repository = require("../models/repoModel");
const User = require("../models/userModel");

async function addCollaborator(req, res) {
    const { id } = req.params;
    const { username, role } = req.body;

    try {
        const repo = await Repository.findById(id);
        if (!repo) return res.status(404).json({ message: "Repository not found" });

        // Check if requester is owner (simple check for now, can be expanded to middleware)
        if (repo.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: "Only the owner can add collaborators" });
        }

        const userToAdd = await User.findOne({ username });
        if (!userToAdd) return res.status(404).json({ message: "User not found" });

        if (repo.owner.toString() === userToAdd._id.toString()) {
            return res.status(400).json({ message: "Owner cannot be a collaborator" });
        }

        const isAlreadyCollaborator = repo.collaborators.some(c => c.user.toString() === userToAdd._id.toString());
        if (isAlreadyCollaborator) {
            return res.status(400).json({ message: "User is already a collaborator" });
        }

        repo.collaborators.push({ user: userToAdd._id, role: role || 'contributor' });
        await repo.save();

        res.status(200).json({ message: "Collaborator added successfully", collaborators: repo.collaborators });
    } catch (err) {
        console.error("Error adding collaborator:", err);
        res.status(500).json({ message: "Server error" });
    }
}

async function removeCollaborator(req, res) {
    const { id, userId } = req.params;

    try {
        const repo = await Repository.findById(id);
        if (!repo) return res.status(404).json({ message: "Repository not found" });

        if (repo.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: "Only the owner can remove collaborators" });
        }

        repo.collaborators = repo.collaborators.filter(c => c.user.toString() !== userId);
        await repo.save();

        res.status(200).json({ message: "Collaborator removed successfully", collaborators: repo.collaborators });
    } catch (err) {
        console.error("Error removing collaborator:", err);
        res.status(500).json({ message: "Server error" });
    }
}

async function getCollaborators(req, res) {
    const { id } = req.params;

    try {
        const repo = await Repository.findById(id).populate('collaborators.user', 'username email profileImage');
        if (!repo) return res.status(404).json({ message: "Repository not found" });

        // Security check: only allow viewing if public or user is associated
        // For now allowing all to see collaborators if they can see the repo?
        // Let's restrict to owner/collaborators for privacy if private
        if (!repo.visibility) {
            const isOwner = repo.owner.toString() === req.user.id;
            const isCollab = repo.collaborators.some(c => c.user._id.toString() === req.user.id);
            if (!isOwner && !isCollab) {
                return res.status(403).json({ message: "Access denied" });
            }
        }

        res.status(200).json(repo.collaborators);
    } catch (err) {
        console.error("Error fetching collaborators:", err);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = {
    addCollaborator,
    removeCollaborator,
    getCollaborators
};
