import { useState } from 'react';

export const useConfirmationModal = () => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState({ type: '', postId: null, post: null, commentId: null });

  const showDeletePostModal = (postId, post) => {
    setConfirmAction({ type: 'delete', postId, post });
    setShowConfirmModal(true);
  };

  const showDeleteCommentModal = (postId, commentId) => {
    setConfirmAction({ type: 'delete-comment', postId, commentId });
    setShowConfirmModal(true);
  };

  const showEditPostModal = (postId, post) => {
    setConfirmAction({ type: 'edit', postId, post });
    setShowConfirmModal(true);
  };

  const hideModal = () => {
    setShowConfirmModal(false);
    setConfirmAction({ type: '', postId: null, post: null, commentId: null });
  };

  return {
    showConfirmModal,
    confirmAction,
    showDeletePostModal,
    showDeleteCommentModal,
    showEditPostModal,
    hideModal
  };
};
