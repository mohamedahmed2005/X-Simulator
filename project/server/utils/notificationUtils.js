import Notification from "../models/notification.model.js";

/**
 * Create a notification
 * @param {string} from - User ID who triggered the notification
 * @param {string} to - User ID who should receive the notification
 * @param {string} type - Type of notification (follow, like, comment, reshare)
 * @param {string} postId - Optional post ID for post-related notifications
 * @returns {Promise<Object>} Created notification
 */
export const createNotification = async (from, to, type, postId = null) => {
    try {
        // Don't create notification if user is notifying themselves
        if (from === to) {
            return null;
        }

        // Check if notification already exists for this action
        const existingNotification = await Notification.findOne({
            from,
            to,
            type,
            post: postId
        });

        if (existingNotification) {
            return existingNotification;
        }

        const notification = new Notification({
            from,
            to,
            type,
            post: postId
        });

        await notification.save();
        return notification;
    } catch (error) {
        console.error("Error creating notification:", error);
        return null;
    }
};

/**
 * Remove a notification
 * @param {string} from - User ID who triggered the notification
 * @param {string} to - User ID who received the notification
 * @param {string} type - Type of notification
 * @param {string} postId - Optional post ID
 * @returns {Promise<boolean>} Success status
 */
export const removeNotification = async (from, to, type, postId = null) => {
    try {
        await Notification.findOneAndDelete({
            from,
            to,
            type,
            post: postId
        });
        return true;
    } catch (error) {
        console.error("Error removing notification:", error);
        return false;
    }
};

/**
 * Get notification message based on type
 * @param {string} type - Notification type
 * @param {string} username - Username of the person who triggered the notification
 * @returns {string} Formatted message
 */
export const getNotificationMessage = (type, username) => {
    switch (type) {
        case 'follow':
            return `${username} started following you`;
        case 'like':
            return `${username} liked your post`;
        case 'comment':
            return `${username} commented on your post`;
        case 'reshare':
            return `${username} reshared your post`;
        default:
            return `${username} interacted with your content`;
    }
};
