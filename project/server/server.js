import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import cors from "cors";
import { connectDb } from './lib/connectDb.js';
import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/user.routes.js'
import postsRoutes from './routes/posts.routes.js'
import notificationsRoutes from './routes/notifications.routes.js'

dotenv.config()

const app = express();

console.log('Environment PORT:', process.env.PORT);

// CORS configuration for Vercel deployment
const allowedOrigins = [
  'http://localhost:3000', 
  'http://localhost:3001', 
  'http://127.0.0.1:3000', 
  'http://127.0.0.1:3001',
  'https://your-frontend-domain.vercel.app', // Replace with your actual frontend domain
  'https://your-frontend-domain.netlify.app'  // If using Netlify
];

app.use(cors({ 
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true 
}))

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(cookieParser())

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' })
})

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)
app.use("/api/posts", postsRoutes)
app.use("/api/notifications", notificationsRoutes)

// Connect to database
connectDb()

// For local development
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 9000;
  app.listen(port, () => {
    console.log('Server Running on ' + port)
  })
}

// Export for Vercel
export default app;