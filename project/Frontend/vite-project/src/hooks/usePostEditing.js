import { useState } from 'react';

export const usePostEditing = () => {
  const [editingPost, setEditingPost] = useState({ id: null, text: '', image: null, imagePreview: null });
  const [isEditing, setIsEditing] = useState(false);

  const startEditing = (postId, post) => {
    setEditingPost({
      id: postId,
      text: post.text || '',
      image: null,
      imagePreview: post.img || null
    });
    setIsEditing(true);
  };

  const handleEditImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setEditingPost(prev => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file)
      }));
    }
  };

  const removeEditImage = () => {
    setEditingPost(prev => ({
      ...prev,
      image: null,
      imagePreview: null
    }));
  };

  const updateEditText = (text) => {
    setEditingPost(prev => ({ ...prev, text }));
  };

  const cancelEditing = () => {
    setEditingPost({ id: null, text: '', image: null, imagePreview: null });
    setIsEditing(false);
  };

  const finishEditing = () => {
    setEditingPost({ id: null, text: '', image: null, imagePreview: null });
    setIsEditing(false);
  };

  return {
    editingPost,
    isEditing,
    startEditing,
    handleEditImageUpload,
    removeEditImage,
    updateEditText,
    cancelEditing,
    finishEditing
  };
};
