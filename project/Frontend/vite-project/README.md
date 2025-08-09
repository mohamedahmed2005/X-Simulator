# X-Twitter Frontend

A modern X/Twitter clone built with React and Vite.

## Features

### Navigation
- **Responsive Navbar**: Mobile-first navigation bar that appears on smaller screens
- **Sidebar Navigation**: Desktop sidebar with navigation links
- **User Profile**: Display user information and logout functionality

### Post Management
- **Create Posts**: Write and publish new posts with text and images
- **Image Upload**: Support for image attachments with preview
- **Post Feed**: View all posts in a chronological feed
- **Like Posts**: Like and unlike posts with real-time updates
- **Reshare Posts**: Reshare posts with proper attribution
- **Delete Posts**: Delete your own posts with confirmation

### User Interface
- **Modern Design**: X/Twitter-like interface with dark theme
- **Responsive Layout**: Works on desktop and mobile devices
- **Real-time Updates**: Posts update immediately after actions
- **Loading States**: Proper loading indicators for better UX

## Components

### Navbar Component
- Mobile-responsive navigation bar
- Navigation links (Home, Explore, Notifications, Messages, Profile)
- User profile section with logout functionality
- Post button for quick access

### Post Component
- Post creation interface with text and image support
- Post feed with like, reshare, and delete functionality
- Image preview and removal
- Real-time post updates

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5000`

## API Integration

The frontend integrates with the backend API for:
- User authentication
- Post creation and management
- Like/unlike functionality
- Reshare functionality
- Post deletion

## Technologies Used

- React 18
- Vite
- Axios for API calls
- CSS3 for styling
- SVG icons for UI elements

## File Structure

```
src/
├── components/
│   ├── Navbar.jsx          # Navigation component
│   ├── Navbar.css          # Navbar styles
│   ├── Post.jsx            # Post management component
│   ├── Post.css            # Post styles
│   ├── Dashboard.jsx       # Main dashboard
│   ├── Dashboard.css       # Dashboard styles
│   ├── Login.jsx           # Login component
│   ├── Signup.jsx          # Signup component
│   └── ...
├── App.jsx                 # Main app component
└── main.jsx               # App entry point
```
