# Notification System Documentation

## Overview
The notification system allows users to receive real-time updates about interactions with their content and profile. It supports multiple notification types and provides comprehensive API endpoints for managing notifications.

## Notification Types

### 1. Follow Notifications
- **Trigger**: When a user follows another user
- **Recipient**: The user being followed
- **Type**: `"follow"`

### 2. Like Notifications
- **Trigger**: When a user likes a post
- **Recipient**: The post author
- **Type**: `"like"`
- **Additional Data**: Post ID

### 3. Comment Notifications
- **Trigger**: When a user comments on a post
- **Recipient**: The post author
- **Type**: `"comment"`
- **Additional Data**: Post ID

### 4. Reshare Notifications
- **Trigger**: When a user reshares a post
- **Recipient**: The original post author
- **Type**: `"reshare"`
- **Additional Data**: Post ID

## API Endpoints

### Get All Notifications
```
GET /api/notifications
```
**Headers**: `Authorization: Bearer <token>`

**Response**:
```json
{
  "success": true,
  "notifications": [
    {
      "_id": "notification_id",
      "from": {
        "_id": "user_id",
        "username": "username",
        "profileImg": "image_url",
        "fullName": "Full Name"
      },
      "to": "recipient_user_id",
      "type": "like",
      "post": {
        "_id": "post_id",
        "text": "Post content",
        "img": "image_url"
      },
      "read": false,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "unreadCount": 0
}
```

### Get Unread Notification Count
```
GET /api/notifications/unread
```
**Headers**: `Authorization: Bearer <token>`

**Response**:
```json
{
  "success": true,
  "unreadCount": 5
}
```

### Mark Notification as Read
```
PATCH /api/notifications/:id/read
```
**Headers**: `Authorization: Bearer <token>`

**Response**:
```json
{
  "success": true,
  "message": "Notification marked as read",
  "notification": {
    "_id": "notification_id",
    "read": true
  }
}
```

### Delete Specific Notification
```
DELETE /api/notifications/:id
```
**Headers**: `Authorization: Bearer <token>`

**Response**:
```json
{
  "success": true,
  "message": "Notification deleted successfully"
}
```

### Clear All Notifications
```
DELETE /api/notifications/clear
```
**Headers**: `Authorization: Bearer <token>`

**Response**:
```json
{
  "success": true,
  "message": "All notifications cleared successfully"
}
```

## Database Schema

### Notification Model
```javascript
{
  from: ObjectId,        // User who triggered the notification
  to: ObjectId,          // User who receives the notification
  type: String,          // "follow" | "like" | "comment" | "reshare"
  post: ObjectId,        // Optional: Related post for post-based notifications
  read: Boolean,         // Default: false
  createdAt: Date,       // Auto-generated timestamp
  updatedAt: Date        // Auto-generated timestamp
}
```

## Utility Functions

### createNotification(from, to, type, postId)
Creates a new notification with duplicate prevention and self-notification prevention.

**Parameters**:
- `from` (String): User ID who triggered the notification
- `to` (String): User ID who should receive the notification
- `type` (String): Type of notification
- `postId` (String, optional): Post ID for post-related notifications

**Returns**: Promise<Notification | null>

### removeNotification(from, to, type, postId)
Removes a specific notification.

**Parameters**:
- `from` (String): User ID who triggered the notification
- `to` (String): User ID who received the notification
- `type` (String): Type of notification
- `postId` (String, optional): Post ID for post-related notifications

**Returns**: Promise<Boolean>

### getNotificationMessage(type, username)
Generates a human-readable message for notification types.

**Parameters**:
- `type` (String): Notification type
- `username` (String): Username of the person who triggered the notification

**Returns**: String

## Features

### 1. Duplicate Prevention
The system prevents creating duplicate notifications for the same action by checking if a notification already exists with the same parameters.

### 2. Self-Notification Prevention
Users cannot receive notifications for their own actions (e.g., liking their own posts).

### 3. Automatic Read Status
When fetching notifications, all unread notifications are automatically marked as read.

### 4. Comprehensive Data Population
Notifications include populated user and post data for easy frontend consumption.

### 5. Sorting
Notifications are sorted by creation date (newest first).

## Testing

Run the test script to verify the notification system:
```bash
node test-notifications.js
```

This will test all notification types, utility functions, and edge cases.

## Integration Points

### Post Controller
- `toggleLikes`: Creates/removes like notifications
- `commentOnPost`: Creates comment notifications
- `resharePost`: Creates reshare notifications

### User Controller
- `toggleFollow`: Creates follow notifications

## Error Handling

All notification endpoints include comprehensive error handling:
- Invalid notification IDs
- Unauthorized access
- Database connection issues
- Validation errors

## Security

- All endpoints require authentication via JWT token
- Users can only access their own notifications
- Input validation prevents malicious data
- Proper error messages without exposing sensitive information

