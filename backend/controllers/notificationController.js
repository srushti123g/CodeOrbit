const Notification = require('../models/notificationModel');

// Get notifications for the authenticated user
const getNotifications = async (req, res) => {
    try {
        const userId = req.user.id; // From JWT middleware
        const notifications = await Notification.find({ recipient: userId })
            .sort({ createdAt: -1 })
            .limit(20); // Limit to last 20

        res.json(notifications);
    } catch (err) {
        console.error("Error fetching notifications:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// Mark a notification as read
const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await Notification.findByIdAndUpdate(
            id,
            { read: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        res.json(notification);
    } catch (err) {
        console.error("Error marking notification as read:", err);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    getNotifications,
    markAsRead
};
