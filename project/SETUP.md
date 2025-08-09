# X-Twitter API Setup Guide

This guide will help you set up and run the X-Twitter API project with both frontend and backend integrated.

## Prerequisites

1. **Node.js** (v16 or higher)
2. **MongoDB** (v4.4 or higher)
3. **Redis** (optional, for session management)

## Installation Steps

### 1. Install MongoDB

#### Windows:
1. Download MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Install MongoDB as a service
3. Start MongoDB service

#### macOS:
```bash
brew install mongodb-community
brew services start mongodb-community
```

#### Linux (Ubuntu):
```bash
sudo apt update
sudo apt install mongodb
sudo systemctl start mongodb
```

### 2. Install Redis (Optional)

#### Windows:
1. Download Redis for Windows from [github.com/microsoftarchive/redis/releases](https://github.com/microsoftarchive/redis/releases)
2. Install and start Redis service

#### macOS:
```bash
brew install redis
brew services start redis
```

#### Linux:
```bash
sudo apt install redis-server
sudo systemctl start redis
```

### 3. Environment Configuration

Create a `.env` file in the root directory with the following content:

```env
# MongoDB Connection
MONGO_URL=mongodb://localhost:27017/x-twitter-api

# JWT Secrets (Generate your own secure secrets)
ACCESS_TOKEN_SECRET=your_super_secret_access_token_key_here
REFRESH_TOKEN_SECRET=your_super_secret_refresh_token_key_here

# Redis Configuration
REDIS_URL=redis://localhost:6379

# Server Configuration
PORT=5001
NODE_ENV=development

# Client URL (Frontend)
CLIENT_URL=http://localhost:5000
```

### 4. Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd Frontend/vite-project
npm install
cd ../..
```

## Running the Application

### Option 1: Run Both Frontend and Backend Together
```bash
npm run dev:full
```

This will start:
- Backend server on port 5001
- Frontend development server on port 5000

### Option 2: Run Separately

#### Backend Only:
```bash
npm run backend
```

#### Frontend Only:
```bash
npm run frontend
```

## Accessing the Application

- **Frontend**: http://localhost:5000
- **Backend API**: http://localhost:5001
- **Health Check**: http://localhost:5001/api/health

## Project Structure

```
X-Twitter-Api/
├── Frontend/
│   └── vite-project/          # React frontend
├── server/                    # Express.js backend
│   ├── controllers/           # Route controllers
│   ├── middleware/            # Custom middleware
│   ├── models/               # MongoDB models
│   ├── routes/               # API routes
│   ├── utils/                # Utility functions
│   └── lib/                  # Database connections
├── package.json              # Root package.json
└── .env                      # Environment variables
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get user profile

### Health Check
- `GET /api/health` - Server health status

## Troubleshooting

### Port Already in Use
If you get `EADDRINUSE` error:

1. Find the process using the port:
   ```bash
   netstat -ano | findstr :5000
   netstat -ano | findstr :5001
   ```

2. Kill the process:
   ```bash
   taskkill /PID <PID> /F
   ```

### MongoDB Connection Issues
1. Ensure MongoDB is running:
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   sudo systemctl status mongodb
   ```

2. Check MongoDB connection string in `.env` file

### Frontend Not Loading
1. Check if Vite dev server is running on port 5000
2. Verify proxy configuration in `vite.config.js`
3. Check browser console for errors

### API Calls Failing
1. Ensure backend server is running on port 5001
2. Check CORS configuration
3. Verify API endpoints are correct
4. Check browser network tab for request details

## Development Workflow

1. Start both servers: `npm run dev:full`
2. Open http://localhost:5000 in your browser
3. Test signup/login functionality
4. Check dashboard after successful authentication

## Features

- ✅ User registration and login
- ✅ JWT-based authentication
- ✅ Cookie-based session management
- ✅ MongoDB integration
- ✅ Redis integration (optional)
- ✅ Modern React frontend
- ✅ Responsive design
- ✅ Form validation
- ✅ Error handling
- ✅ Loading states

## Next Steps

1. Add more API endpoints (posts, notifications, etc.)
2. Implement user profile management
3. Add image upload functionality
4. Implement real-time features
5. Add unit and integration tests 