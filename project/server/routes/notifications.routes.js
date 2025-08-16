import express from "express";
import { 
    clearNotifications, 
    deleteNotification, 
    getNotifications, 
    getUnreadNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead
} from "../controllers/notification.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Get all notifications for the authenticated user
router.get("/", protectedRoute, getNotifications);

// Get unread notification count
router.get("/unread", protectedRoute, getUnreadNotifications);

// Mark a specific notification as read
router.patch("/:id/read", protectedRoute, markNotificationAsRead);

// Mark all notifications as read
router.post("/mark-all-read", protectedRoute, markAllNotificationsAsRead);

// Clear all notifications
router.delete("/clear", protectedRoute, clearNotifications);

// Delete a specific notification
router.delete("/:id", protectedRoute, deleteNotification);

export default router;