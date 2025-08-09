import cloudinary from "../lib/cloudinary.js";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import fs from 'fs';
import path from 'path';
import { createNotification } from "../utils/notificationUtils.js";

export const getUserProfile = async (req, res) => {
    const { username } = req.params;

    try {
        const user = await User.findOne({ username }).select("-password");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({ success: true, user });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }

}

export const getSuggestedUsers = async (req, res) => {

    try {
        const userId = req.user._id;

        // get users followed by me
        const usersFollowedByMe = await User.findById(userId).select("following");

        // get 10 random users expect me
        const users = await User.aggregate([
            {
                $match: {
                    _id: { $ne: userId }
                }
            },
            {
                $sample: {
                    size: 10
                }
            }
        ])

        // filter users not followed by me
        const filteredUsers = users.filter(user => {
            return !usersFollowedByMe.following.includes(user._id.toString());
        })

        // get 4 suggested users
        const suggestedUsers = filteredUsers.slice(0, 4)

        // empty their password for security purpose
        suggestedUsers.forEach((user) => { user.password = null })

        return res.status(200).json({ success: true, suggestedUsers })

    } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }

}

export const searchUsers = async (req, res) => {

    const { query } = req.query; // Extract the 'query' parameter from the request

    if (!query) {
        return res.status(400).json({ success: false, message: "Query parameter is required" });
    }

    try {
        const users = await User.find({
            $or: [
                { username: { $regex: query, $options: 'i' } }, // Case-insensitive search
                { email: { $regex: query, $options: 'i' } },
                { fullName: { $regex: query, $options: 'i' } }
            ]
        });

        return res.status(200).json({ success: true, users });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const currentUserId = req.user._id;
        
        // Get all users except the current user
        const users = await User.find({ _id: { $ne: currentUserId } })
            .select("-password")
            .sort({ fullName: 1 });

        return res.status(200).json({ success: true, users });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
}

export const toggleFollow = async (req, res) => {

    try {
        const { id } = req.params;

        const currentUser = await User.findById(req.user._id);
        const userToToggle = await User.findById(id);

        if (!userToToggle || !currentUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (id === req.user._id.toString()) {
            return res.status(400).json({ success: false, message: "Cannot follow yourself" });
        }

        const isFollowing = currentUser.following.includes(id);

        if (isFollowing) {

            // decrease followers for target user
            await User.findByIdAndUpdate(id, {
                $pull: { followers: req.user._id }
            })

            // decrease following for current user
            await User.findByIdAndUpdate(req.user._id, {
                $pull: { following: id }
            })

            res.status(200).json({ success: true, message: "User Unfollowed successfully" });

        } else {
            // increase followers for target user
            await User.findByIdAndUpdate(id, {
                $push: { followers: req.user._id }
            })

            // increase following for current user
            await User.findByIdAndUpdate(req.user._id, {
                $push: { following: id }
            })

            // send notification to target user
            await createNotification(req.user._id, id, "follow");

            res.status(200).json({ success: true, message: "User followed successfully" });
        }

    } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
}

export const updateProfilePicture = async (req, res) => {
    try {
        const userId = req.user._id;
        
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No image file provided" });
        }

        console.log('File received:', req.file);

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Check if Cloudinary is configured
        if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
            console.error('Cloudinary environment variables are missing');
            return res.status(500).json({ 
                success: false, 
                message: "Image upload service is not configured properly" 
            });
        }

        // Delete old profile image from Cloudinary if it exists
        if (user.profileImg) {
            const publicId = user.profileImg.split("/").pop().split(".")[0];
            try {
                await cloudinary.uploader.destroy(publicId);
                console.log('Old profile image deleted from Cloudinary');
            } catch (error) {
                console.log("Error deleting old image:", error);
            }
        }

        // Upload new image to Cloudinary
        console.log('Uploading to Cloudinary...');
        const uploadedResponse = await cloudinary.uploader.upload(req.file.path, {
            folder: "profile-pictures",
            transformation: [
                { width: 400, height: 400, crop: "fill" },
                { quality: "auto" }
            ]
        });

        console.log('Upload successful:', uploadedResponse.secure_url);

        // Update user profile with new image URL
        user.profileImg = uploadedResponse.secure_url;
        await user.save();

        // Clean up the temporary file
        try {
            fs.unlinkSync(req.file.path);
            console.log('Temporary file cleaned up');
        } catch (error) {
            console.log("Error deleting temporary file:", error);
        }

        // Remove password from response
        user.password = undefined;

        return res.status(200).json({ 
            success: true, 
            message: "Profile picture updated successfully", 
            profilePicture: uploadedResponse.secure_url,
            user 
        });

    } catch (error) {
        console.error("Error updating profile picture:", error);
        
        // Clean up the temporary file in case of error
        if (req.file && req.file.path) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (cleanupError) {
                console.log("Error deleting temporary file:", cleanupError);
            }
        }
        
        return res.status(500).json({ 
            success: false, 
            message: "Error updating profile picture", 
            error: error.message 
        });
    }
}

export const updateProfile = async (req, res) => {

    const userId = req.user._id;
    const { fullName, username, email, currentPassword, newPassword, bio, link } = req.body;
    let { profileImg, coverImg } = req.body;

    try {

        let user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if ((!newPassword && currentPassword) || (!currentPassword && newPassword)) {
            return res.status(400).json({ error: "Please provide both current password and new password" });
        }

        if (currentPassword && newPassword) {
            const isMatch = await user.comparePassword(currentPassword);

            if (!isMatch) {
                return res.status(400).json({ error: "Current password is incorrect" });
            }

            if (newPassword.length < 6) {
                return res.status(400).json({ error: "Password must be at least 6 characters long" });
            }

            user.password = newPassword;
        }

        if (profileImg) {
            if (user.profileImg) {
                await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0]);
            }

            const uploadedResponse = await cloudinary.uploader.upload(profileImg);
            profileImg = uploadedResponse.secure_url;
        }

        if (coverImg) {
            if (user.coverImg) {
                await cloudinary.uploader.destroy(user.coverImg.split("/").pop().split(".")[0]);
            }

            const uploadedResponse = await cloudinary.uploader.upload(coverImg);
            coverImg = uploadedResponse.secure_url;
        }

        user.fullName = fullName || user.fullName;
        user.email = email || user.email;
        user.username = username || user.username;
        user.bio = bio || user.bio;
        user.link = link || user.link;
        user.profileImg = profileImg || user.profileImg;
        user.coverImg = coverImg || user.coverImg;

        user = await user.save();

        user.password = null;

        return res.status(200).json({ success: true, message: "Profile updated successfully", user });

    } catch (error) {
        console.log(error);

        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
}