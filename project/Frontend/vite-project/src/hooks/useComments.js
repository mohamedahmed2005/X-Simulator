import { useState } from 'react';
import axios from 'axios';

export const useComments = (addComment, updateComment, removeComment) => {
  const [commentInputs, setCommentInputs] = useState({});
  const [editingComment, setEditingComment] = useState({ id: null, text: '', postId: null });
  const [deletingComments, setDeletingComments] = useState(new Set());

  const handleCommentInputChange = (postId, value) => {
    setCommentInputs(prev => ({ ...prev, [postId]: value }));
  };

  const submitComment = async (postId) => {
    const text = (commentInputs[postId] || '').trim();
    if (!text) return;
    
    // Create optimistic comment
    const optimisticComment = {
      _id: `temp-${Date.now()}`,
      text,
      user: { 
        _id: 'current-user',
        fullName: 'You',
        username: 'you',
        profileImg: null
      },
      createdAt: new Date().toISOString()
    };
    
    // Add optimistic comment immediately
    addComment(postId, optimisticComment);
    
    // Clear input immediately
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    
    try {
      console.log('Submitting comment:', { postId, text });
      const response = await axios.post(`/api/posts/comment/${postId}`, { text }, { 
        withCredentials: true 
      });
      
      console.log('Comment response:', response.data);
      
      if (response.data.success) {
        // Replace optimistic comment with real comment
        updateComment(postId, optimisticComment._id, response.data.comment);
        return { success: true };
      } else {
        // Remove optimistic comment on failure
        removeComment(postId, optimisticComment._id);
        // Restore input
        setCommentInputs(prev => ({ ...prev, [postId]: text }));
        return { success: false, message: response.data.message || 'Failed to add comment' };
      }
    } catch (error) {
      console.error('Error commenting:', error);
      // Remove optimistic comment on error
      removeComment(postId, optimisticComment._id);
      // Restore input
      setCommentInputs(prev => ({ ...prev, [postId]: text }));
      return { success: false, message: error.response?.data?.message || 'Failed to add comment' };
    }
  };

  const startEditComment = (postId, comment) => {
    setEditingComment({ id: comment._id, text: comment.text, postId });
  };

  const cancelEditComment = () => {
    setEditingComment({ id: null, text: '', postId: null });
  };

  const updateEditingCommentText = (text) => {
    setEditingComment(prev => ({ ...prev, text }));
  };

  const saveEditComment = async () => {
    const { id, text, postId } = editingComment;
    if (!id || !text.trim()) return;
    
    try {
      const response = await axios.post(
        `/api/posts/edit-comment/${id}`, 
        { text: text.trim(), postId }, 
        { withCredentials: true }
      );
      
      if (response.data.success) {
        updateComment(postId, id, { text: text.trim() });
        cancelEditComment();
        return { success: true };
      }
    } catch (error) {
      console.error('Error editing comment:', error);
      return { success: false, message: 'Failed to edit comment' };
    }
  };

  const deleteComment = async (postId, commentId) => {
    // Add comment to deleting set for animation
    setDeletingComments(prev => new Set(prev).add(commentId));

    try {
      const response = await axios.delete(`/api/posts/delete-comment/${commentId}`, {
        data: { postId },
        withCredentials: true
      });

      if (response.data.success) {
        removeComment(postId, commentId);
        return { success: true };
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      // Remove from deleting set if there was an error
      setDeletingComments(prev => {
        const newSet = new Set(prev);
        newSet.delete(commentId);
        return newSet;
      });
      return { success: false, message: 'Failed to delete comment' };
    }
  };

  return {
    commentInputs,
    editingComment,
    deletingComments,
    handleCommentInputChange,
    submitComment,
    startEditComment,
    cancelEditComment,
    updateEditingCommentText,
    saveEditComment,
    deleteComment
  };
};
