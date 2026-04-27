const Activity = require("../models/activityModel");

async function getRecentActivity(req, res) {
    try {
        const activities = await Activity.find({})
            .sort({ timestamp: -1 })
            .limit(10)
            .populate("user", "username")
            .populate("target"); // Polymorphic populate might need more specific handling if targetModel is strictly used, but Mongoose usually handles simple ref fetch if ids match.
        // actually populate(target) works if target is a valid ObjectId in a collection, but here it's dynamic.
        // Mongoose valid populate with refPath:
        // .populate('target');

        res.json(activities);
    } catch (err) {
        console.error("Error fetching activities:", err);
        res.status(500).json({ message: "Server error" });
    }
}

// Helper for internal use
async function createActivity(userId, type, targetId, targetModel, description) {
    try {
        const newActivity = new Activity({
            user: userId,
            type,
            target: targetId,
            targetModel,
            description,
        });
        await newActivity.save();
    } catch (err) {
        console.error("Error creating activity:", err);
        // Don't block main flow if activity creation fails
    }
}

module.exports = {
    getRecentActivity,
    createActivity,
};
