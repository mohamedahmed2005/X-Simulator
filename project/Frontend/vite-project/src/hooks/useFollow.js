import axios from 'axios';

export const useFollow = (user, updateUser) => {
  const handleFollowUpdate = async (userId) => {
    if (!user || !userId) {
      console.error('User or userId is missing');
      return;
    }
    
    // Prevent following yourself
    if (String(user._id) === String(userId)) {
      console.error('Cannot follow yourself');
      return;
    }
    
    try {
      console.log('Following/unfollowing user:', userId);
      
      // Make API call first
      const response = await axios.post(`/api/user/follow/${userId}`, {}, {
        withCredentials: true
      });
      
      console.log('Follow response:', response.data);
      
      if (response.data.success) {
        // Only update state if API call succeeds
        const followingArray = Array.isArray(user.following) ? user.following : [];
        const isCurrentlyFollowing = followingArray.some(id => String(id) === String(userId));
        
        const updatedUser = {
          ...user,
          following: isCurrentlyFollowing 
            ? followingArray.filter(id => String(id) !== String(userId))
            : [...followingArray, userId]
        };
        
        console.log('Updating user state with:', updatedUser);
        updateUser(updatedUser);
      } else {
        alert('Failed to update follow status. Please try again.');
      }
    } catch (error) {
      console.error('Error following/unfollowing user:', error);
      alert('Failed to update follow status. Please try again.');
    }
  };

  return {
    handleFollowUpdate
  };
};
