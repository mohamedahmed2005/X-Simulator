import cloudinary from "../lib/cloudinary.js"
import Notification from "../models/notification.model.js"
import Post from "../models/post.model.js"
import User from "../models/user.model.js"
import { createNotification, removeNotification } from "../utils/notificationUtils.js"

export const getAllPosts = async (req, res) => {
    try {
        // get all posts + comments with user
        const posts = await Post.find({}).sort({ createdAt: -1 }).populate({
            path: "user",
            select: "-password"
        }).populate({
            path: "comments",
            populate: {
                path: "user",
                select: "-password"
            }
        })

        if (posts.length === 0) {
            return res.status(200).json({ success: false, message: "No posts found", posts: [] });
        }

        return res.status(200).json({ success: true, posts });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
}

export const getFollowingPosts = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const following = user.following;

        const posts = await Post.find({ user: { $in: following } }).sort({ createdAt: -1 }).populate({
            path: "user",
            select: "-password"
        }).populate({
            path: "comments",
            populate: {
                path: "user",
                select: "-password"
            }
        })

        return res.status(200).json({ success: true, followingPosts: posts });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
}

export const getLikedPosts = async (req, res) => {
    try {

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const likedPosts = await Post.find({ likes: user._id }).sort({ createdAt: -1 }).populate({
            path: "user",
            select: "-password"
        }).populate({
            path: "comments",
            populate: {
                path: "user",
                select: "-password"
            }
        })

        return res.status(200).json({ success: true, likedPosts });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
}

export const getUserPosts = async (req, res) => {
    try {
        const user = await User.findOne(req.params);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const posts = await Post.find({ user: user._id }).sort({ createdAt: -1 }).populate({
            path: "user",
            select: "-password"
        }).populate({
            path: "comments",
            populate: {
                path: "user",
                select: "-password"
            }
        })

        return res.status(200).json({ success: true, userPosts: posts });

    } catch (error) {

    }
}

export const createPost = async (req, res) => {
    try {
        const { text } = req.body;
        let { img } = req.body;
        const userId = req.user._id.toString();

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (!text && !img) {
            return res.status(400).json({ success: false, message: "Post cannot be empty" });
        }

        if (img) {
            const uploadedResponse = await cloudinary.uploader.upload(img);
            img = uploadedResponse.secure_url;
        }

        const post = new Post({
            user: userId,
            text,
            img,
        });

        await post.save();

        return res.status(200).json({ success: true, post });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
}

export const toggleLikes = async (req, res) => {
    try {
        const userId = req.user._id;
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        const isLiked = post.likes.includes(userId);

        if (isLiked) {
            // unlike the post
            await post.updateOne({ $pull: { likes: userId } });
            await User.updateOne({ _id: userId }, { $pull: { likes: req.params.id } });
            
            // Remove notification
            await removeNotification(userId, post.user, 'like', post._id);
            
            res.status(200).json({ success: true, message: "Post unliked" });
        } else {
            // like the post
            post.likes.push(userId);
            await User.updateOne({ _id: userId }, { $push: { likes: req.params.id } });
            await post.save()

            // Create notification
            await createNotification(userId, post.user, 'like', post._id);

            res.status(200).json({ success: true, message: "Post liked" });
        }

    } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
}

export const commentOnPost = async (req, res) => {
    try {
        const { text } = req.body;
        const userId = req.user._id;
        const post = await Post.findById(req.params.id);

        if (!text) {
            return res.status(400).json({ success: false, message: "Comment cannot be empty" });
        }

        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        const comment = {
            user: userId,
            text
        }

        post.comments.push(comment);

        await post.save();

        // Create notification for comment
        await createNotification(userId, post.user, 'comment', post._id);

        return res.status(200).json({ success: true, post });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
}

export const editComment = async (req, res) => {
    try {

        const { text, postId } = req.body;
        const userId = req.user._id;
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        const comment = post.comments.id(req.params.id)

        if (!comment) {
            return res.status(404).json({ success: false, message: "Comment not found" });
        }

        // Only the comment owner can edit their comment
        if (comment.user.toString() !== userId.toString()) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        comment.text = text;

        await post.save()

        return res.status(200).json({ success: true, message: "Comment updated successfully", comment });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
}

export const deleteComment = async (req, res) => {
    try {

        const { postId } = req.body;
        const userId = req.user._id;
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        const comment = post.comments.id(req.params.id)

        if (!comment) {
            return res.status(404).json({ success: false, message: "Comment not found" });
        }

        // Allow deletion if the requester is the comment owner or the post owner
        const isCommentOwner = comment.user.toString() === userId.toString();
        const isPostOwner = post.user.toString() === userId.toString();

        if (!isCommentOwner && !isPostOwner) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        post.comments.pull(req.params.id);

        await post.save()

        return res.status(200).json({ success: true, message: "Comment deleted successfully" });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
}

export const editPost = async (req, res) => {
    try {

        const { text } = req.body;
        let { img } = req.body;
        const userId = req.user._id;
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        if (post.user.toString() !== userId.toString()) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        if (img) {
            const uploadedResponse = await cloudinary.uploader.upload(img);
            img = uploadedResponse.secure_url;
        }

        await Post.findByIdAndUpdate(req.params.id, { text, img }, { new: true });

        return res.status(200).json({ success: true, message: "Post updated successfully" });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
}

export const deletePost = async (req, res) => {
    try {

        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        if (post.img) {
            const imgId = post.img.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(imgId);
        }

        await Post.findByIdAndDelete(req.params.id);

        return res.status(200).json({ success: true, message: "Post deleted successfully" });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
}

export const resharePost = async (req, res) => {
    try {
        const originalPost = await Post.findById(req.params.id).populate('user', '-password');
        
        if (!originalPost) {
            return res.status(404).json({ success: false, message: "Original post not found" });
        }

        const reshareText = `Reposted by @${req.user.username}: ${originalPost.text}`;
        
        const resharePost = new Post({
            user: req.user._id,
            text: reshareText,
            img: originalPost.img,
            isReshare: true,
            originalPost: originalPost._id
        });

        await resharePost.save();

        // Create notification for original post author
        await createNotification(req.user._id, originalPost.user._id, 'reshare', originalPost._id);

        return res.status(200).json({ 
            success: true, 
            message: "Post reshared successfully",
            resharePost 
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
}