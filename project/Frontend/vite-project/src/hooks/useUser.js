import { useState, useEffect } from 'react';
import axios from 'axios';

export const useUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('/api/auth/me', {
        withCredentials: true
      });
      
      if (response.data.success) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = (updatedUser) => {
    console.log('Updating user state:', updatedUser);
    
    // Validate the user object
    if (!updatedUser || typeof updatedUser !== 'object') {
      console.error('Invalid user object provided to updateUser:', updatedUser);
      return;
    }
    
    // Ensure following is an array
    if (updatedUser.following && !Array.isArray(updatedUser.following)) {
      console.warn('User following is not an array, converting:', updatedUser.following);
      updatedUser.following = [];
    }
    
    setUser(updatedUser);
    console.log('User state updated successfully');
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return {
    user,
    loading,
    updateUser,
    refetchUser: fetchUserProfile
  };
};
