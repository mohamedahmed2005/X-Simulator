import { useState } from 'react';
import axios from 'axios';

export const usePostCreation = (onPostCreated, fetchPosts) => {
  const [newPost, setNewPost] = useState('');
  const [postImage, setPostImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setPostImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setPostImage(null);
    setImagePreview(null);
    const fileInput = document.getElementById('post-image-upload');
    if (fileInput) fileInput.value = '';
  };

  const createPost = async () => {
    if (!newPost.trim() && !postImage) {
      return { success: false, message: 'Please enter some text or upload an image' };
    }

    setIsCreating(true);
    try {
      let base64Image = null;
      if (postImage) {
        base64Image = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(postImage);
        });
      }

      const response = await axios.post(
        '/api/posts/create',
        { text: newPost.trim(), img: base64Image },
        { withCredentials: true }
      );

      if (response.data.success) {
        setNewPost('');
        setPostImage(null);
        setImagePreview(null);
        fetchPosts();
        if (onPostCreated) onPostCreated();
        return { success: true, message: 'Post created successfully!' };
      }
    } catch (error) {
      console.error('Error creating post:', error.response?.data || error.message);
      return { 
        success: false, 
        message: 'Error creating post. Please try again.' 
      };
    } finally {
      setIsCreating(false);
    }
  };

  const resetForm = () => {
    setNewPost('');
    setPostImage(null);
    setImagePreview(null);
  };

  return {
    newPost,
    setNewPost,
    postImage,
    imagePreview,
    isCreating,
    handleImageUpload,
    removeImage,
    createPost,
    resetForm
  };
};
