# Dashboard Component Structure

This directory contains the separated components that follow the Single Responsibility Principle (SRP).

## Components

### Dashboard.jsx
- **Responsibility**: Main orchestrator component
- **Purpose**: Coordinates all other components and hooks
- **Dependencies**: All custom hooks and child components

### DashboardContent.jsx
- **Responsibility**: Renders the main content area based on active tab
- **Purpose**: Handles conditional rendering of different sections (Home, Profile, Notifications)
- **Dependencies**: Post, Profile, Notifications components

### LoadingSpinner.jsx
- **Responsibility**: Displays loading state
- **Purpose**: Shows loading indicator while data is being fetched
- **Dependencies**: None

## Hooks (../hooks/)

### useUser.js
- **Responsibility**: User data management
- **Purpose**: Fetches and manages user profile data
- **Returns**: user, loading, updateUser, refetchUser

### useAuth.js
- **Responsibility**: Authentication operations
- **Purpose**: Handles logout functionality
- **Returns**: logout function

### useNotifications.js
- **Responsibility**: Notification data management
- **Purpose**: Fetches and manages unread notification count
- **Returns**: unreadNotifications, fetchUnreadNotifications, updateUnreadCount

### useFollow.js
- **Responsibility**: Follow/unfollow operations
- **Purpose**: Handles following and unfollowing users
- **Returns**: handleFollowUpdate function

### usePostManagement.js
- **Responsibility**: Post-related operations
- **Purpose**: Handles post creation and deletion callbacks
- **Returns**: handlePostCreated, handlePostDeleted functions

### useTabNavigation.js
- **Responsibility**: Tab navigation state
- **Purpose**: Manages active tab state
- **Returns**: activeTab, setActiveTab

## Benefits of This Structure

1. **Single Responsibility**: Each file has one clear purpose
2. **Reusability**: Hooks can be reused across different components
3. **Testability**: Each piece can be tested independently
4. **Maintainability**: Changes to one concern don't affect others
5. **Readability**: Code is easier to understand and navigate









