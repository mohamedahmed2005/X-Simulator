import { useState } from 'react';
import axios from 'axios';

export const usePostActions = (user, updatePostLikes, removePost, onPostDeleted) => {
  const [deletingPosts, setDeletingPosts] = useState(new Set());
  const [editLoading, setEditLoading] = useState(false);

  const handleLike = async (postId) => {
    try {
      const response = await axios.post(`/api/posts/like/${postId}`, {}, {
        withCredentials: true
      });
      
      if (response.data.success) {
        const isLiked = user && user.likes && user.likes.includes(postId);
        updatePostLikes(postId, user._id, isLiked);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleReshare = async (postId) => {
    try {
      const response = await axios.post(`/api/posts/reshare/${postId}`, {}, {
        withCredentials: true
      });

      if (response.data.success) {
        return { 
          success: true, 
          message: 'Post reshared successfully!',
          repost: response.data.resharePost 
        };
      }
    } catch (error) {
      console.error('Error resharing post:', error);
      return { success: false, message: 'Error resharing post. Please try again.' };
    }
  };

  const handleDelete = async (postId) => {
    // Add post to deleting set for transition
    setDeletingPosts(prev => new Set(prev).add(postId));

    try {
      const response = await axios.delete(`/api/posts/delete/${postId}`, {
        withCredentials: true
      });
      
      if (response.data.success) {
        // Wait for transition to complete before removing from state
        setTimeout(() => {
          removePost(postId);
          setDeletingPosts(prev => {
            const newSet = new Set(prev);
            newSet.delete(postId);
            return newSet;
          });
          if (onPostDeleted) onPostDeleted();
        }, 300); // Match the transition duration
        return { success: true };
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      // Remove from deleting set if there was an error
      setDeletingPosts(prev => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
      return { success: false, message: 'Error deleting post. Please try again.' };
    }
  };

  const handleEditPost = async (postId, text, image) => {
    if (!text.trim() && !image) {
      return { success: false, message: 'Please add some text or an image to your post' };
    }

    setEditLoading(true);
    try {
      let imageData = null;
      
      // If there's a new image, convert it to base64
      if (image && image instanceof File) {
        const reader = new FileReader();
        imageData = await new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(image);
        });
      }

      const requestData = {
        text: text.trim(),
        img: imageData || image
      };

      const response = await axios.post(`/api/posts/edit/${postId}`, requestData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.success) {
        return { success: true, message: 'Post updated successfully!' };
      } else {
        throw new Error(response.data.message || 'Failed to update post');
      }
    } catch (error) {
      console.error('Error updating post:', error);
      
      let errorMessage = 'Error updating post. Please try again.';
      
      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = 'Post not found. It may have been deleted.';
        } else if (error.response.status === 403) {
          errorMessage = 'You are not authorized to edit this post.';
        } else if (error.response.status === 400) {
          errorMessage = error.response.data.message || 'Invalid request data.';
        } else if (error.response.status >= 500) {
          errorMessage = 'Server error. Please try again later.';
        } else {
          errorMessage = error.response.data.message || `Error: ${error.response.status}`;
        }
      } else if (error.request) {
        errorMessage = 'Network error. Please check your connection.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return { success: false, message: errorMessage };
    } finally {
      setEditLoading(false);
    }
  };

  return {
    deletingPosts,
    editLoading,
    handleLike,
    handleReshare,
    handleDelete,
    handleEditPost
  };
};
