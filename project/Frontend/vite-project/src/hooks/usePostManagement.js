export const usePostManagement = () => {
  const handlePostCreated = () => {
    // Refresh posts or update UI as needed
    console.log('Post created successfully');
  };

  const handlePostDeleted = () => {
    // Update UI as needed
    console.log('Post deleted successfully');
  };

  return {
    handlePostCreated,
    handlePostDeleted
  };
};
