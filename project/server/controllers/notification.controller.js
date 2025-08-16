import Notification from "../models/notification.model.js";

export const getNotifications = async (req, res) => {
    try {
        const userId = req.user._id;

        const notifications = await Notification.find({ to: userId })
            .populate({
                path: "from",
                select: "username profileImg fullName"
            })
            .populate({
                path: "post",
                select: "text img"
            })
            .sort({ createdAt: -1 });

        if (!notifications || notifications.length === 0) {
            return res.status(200).json({ 
                success: true, 
                message: "No notifications found", 
                notifications: [] 
            });
        }

        // Mark notifications as read
        await Notification.updateMany(
            { to: userId, read: false }, 
            { $set: { read: true } }
        );

        return res.status(200).json({ 
            success: true, 
            notifications,
            unreadCount: 0
        });

    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: "Server Error", 
            error: error.message 
        });
    }
}

export const getUnreadNotifications = async (req, res) => {
    try {
        const userId = req.user._id;

        const unreadCount = await Notification.countDocuments({ 
            to: userId, 
            read: false 
        });

        return res.status(200).json({ 
            success: true, 
            unreadCount 
        });

    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: "Server Error", 
            error: error.message 
        });
    }
}

export const markAllNotificationsAsRead = async (req, res) => {
    try {
        const userId = req.user._id;

        const result = await Notification.updateMany(
            { to: userId, read: false },
            { $set: { read: true } }
        );

        return res.status(200).json({ 
            success: true, 
            message: "All notifications marked as read",
            updatedCount: result.modifiedCount
        });

    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: "Server Error", 
            error: error.message 
        });
    }
}

export const clearNotifications = async (req, res) => {
    try {
        const userId = req.user._id;

        await Notification.deleteMany({ to: userId });

        return res.status(200).json({ 
            success: true, 
            message: "All notifications cleared successfully" 
        });

    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: "Server Error", 
            error: error.message 
        });
    }
}

export const deleteNotification = async (req, res) => {
    try {
        const userId = req.user._id;
        const notificationId = req.params.id;

        const notification = await Notification.findOne({ 
            _id: notificationId, 
            to: userId 
        });

        if (!notification) {
            return res.status(404).json({ 
                success: false, 
                message: "Notification not found" 
            });
        }

        await Notification.findByIdAndDelete(notificationId);

        return res.status(200).json({ 
            success: true, 
            message: "Notification deleted successfully" 
        });

    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: "Server Error", 
            error: error.message 
        });
    }
}

export const markNotificationAsRead = async (req, res) => {
    try {
        const userId = req.user._id;
        const notificationId = req.params.id;

        const notification = await Notification.findOneAndUpdate(
            { _id: notificationId, to: userId },
            { read: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ 
                success: false, 
                message: "Notification not found" 
            });
        }

        return res.status(200).json({ 
            success: true, 
            message: "Notification marked as read",
            notification 
        });

    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: "Server Error", 
            error: error.message 
        });
    }
}
