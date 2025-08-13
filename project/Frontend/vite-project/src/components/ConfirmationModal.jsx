const ConfirmationModal = ({ 
  showConfirmModal, 
  confirmAction, 
  onConfirm, 
  onCancel 
}) => {
  if (!showConfirmModal) return null;

  const renderModalContent = () => {
    switch (confirmAction.type) {
      case 'delete':
        return (
          <>
            <h3 className="text-xl font-semibold mb-4 text-red-400">Delete Post</h3>
            <p className="text-white text-base mb-4">
              Are you sure you want to delete this post? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={onConfirm} 
                className="px-6 py-2 bg-red-500 text-white rounded-full font-semibold hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
              <button 
                onClick={onCancel} 
                className="px-6 py-2 bg-x-text-gray text-white rounded-full font-semibold hover:bg-x-hover-gray transition-colors"
              >
                Cancel
              </button>
            </div>
          </>
        );

      case 'delete-comment':
        return (
          <>
            <h3 className="text-xl font-semibold mb-4 text-red-400">Delete Comment</h3>
            <p className="text-white text-base mb-4">
              Are you sure you want to delete this comment? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={onConfirm} 
                className="px-6 py-2 bg-red-500 text-white rounded-full font-semibold hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
              <button 
                onClick={onCancel} 
                className="px-6 py-2 bg-x-text-gray text-white rounded-full font-semibold hover:bg-x-hover-gray transition-colors"
              >
                Cancel
              </button>
            </div>
          </>
        );

      case 'delete-notification':
        return (
          <>
            <h3 className="text-xl font-semibold mb-4 text-red-400">Delete Notification</h3>
            <p className="text-white text-base mb-4">
              Are you sure you want to delete this notification? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={onConfirm} 
                className="px-6 py-2 bg-red-500 text-white rounded-full font-semibold hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
              <button 
                onClick={onCancel} 
                className="px-6 py-2 bg-x-text-gray text-white rounded-full font-semibold hover:bg-x-hover-gray transition-colors"
              >
                Cancel
              </button>
            </div>
          </>
        );

      case 'clear-all-notifications':
        return (
          <>
            <h3 className="text-xl font-semibold mb-4 text-red-400">Clear All Notifications</h3>
            <p className="text-white text-base mb-4">
              Are you sure you want to delete all notifications? This action cannot be undone and will remove all your notifications permanently.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={onConfirm} 
                className="px-6 py-2 bg-red-500 text-white rounded-full font-semibold hover:bg-red-600 transition-colors"
              >
                Clear All
              </button>
              <button 
                onClick={onCancel} 
                className="px-6 py-2 bg-x-text-gray text-white rounded-full font-semibold hover:bg-x-hover-gray transition-colors"
              >
                Cancel
              </button>
            </div>
          </>
        );

      case 'edit':
        return (
          <>
            <h3 className="text-xl font-semibold mb-4 text-x-blue">Edit Post</h3>
            <p className="text-white text-base mb-4">
              Are you sure you want to edit this post? You can modify the text and image.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={onConfirm} 
                className="px-6 py-2 bg-x-blue text-white rounded-full font-semibold hover:bg-x-blue-hover transition-colors"
              >
                Edit
              </button>
              <button 
                onClick={onCancel} 
                className="px-6 py-2 bg-x-text-gray text-white rounded-full font-semibold hover:bg-x-hover-gray transition-colors"
              >
                Cancel
              </button>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-x-dark-gray p-6 rounded-lg shadow-xl text-white max-w-md w-full mx-4">
        {renderModalContent()}
      </div>
    </div>
  );
};

export default ConfirmationModal;
