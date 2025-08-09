import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { connectDb } from './lib/connectDb.js';
import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/user.routes.js'
import postsRoutes from './routes/posts.routes.js'
import notificationsRoutes from './routes/notifications.routes.js'

dotenv.config()

const app = express();
const port = process.env.PORT || 9000;

console.log('Environment PORT:', process.env.PORT);
console.log('Using port:', port);

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Created uploads directory');
} else {
    console.log('Uploads directory already exists');
}

app.use(cors({ 
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000', 'http://127.0.0.1:3001'], 
  credentials: true 
}))

app.use(express.json({ limit: '10mb' }))

app.use(express.urlencoded({ extended: true, limit: '10mb' }))

app.use(cookieParser())

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' })
})

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)
app.use("/api/posts", postsRoutes)
app.use("/api/notifications", notificationsRoutes)

app.listen(port, () => {
    console.log('Server Running on ' + port)
    connectDb()
})