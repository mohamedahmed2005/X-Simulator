import express from 'express'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import { protectedRoute } from '../middleware/auth.middleware.js'
import { getSuggestedUsers, getUserProfile, searchUsers, toggleFollow, updateProfile, updateProfilePicture, getAllUsers } from '../controllers/user.controller.js'

const router = express.Router()

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadsDir = path.join(__dirname, '..', 'uploads');
        console.log('Saving file to directory:', uploadsDir);
        cb(null, uploadsDir)
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const filename = file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop();
        console.log('Generated filename:', filename);
        cb(null, filename)
    }
})

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: function (req, file, cb) {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true)
        } else {
            cb(new Error('Only image files are allowed!'), false)
        }
    }
}).single('profilePicture')

// Error handling middleware for multer
const handleUpload = (req, res, next) => {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading
            console.error('Multer error:', err);
            return res.status(400).json({ 
                success: false, 
                message: err.message 
            });
        } else if (err) {
            // An unknown error occurred
            console.error('Upload error:', err);
            return res.status(400).json({ 
                success: false, 
                message: err.message 
            });
        }
        // Everything went fine
        next();
    });
}

router.get("/profile/:username", protectedRoute, getUserProfile)

router.get("/suggested", protectedRoute, getSuggestedUsers)

router.get("/search", protectedRoute, searchUsers)

router.get("/users", protectedRoute, getAllUsers)

router.post("/follow/:id", protectedRoute, toggleFollow)

router.post("/update", protectedRoute, updateProfile)

router.put("/profile-picture", protectedRoute, handleUpload, updateProfilePicture)

export default router