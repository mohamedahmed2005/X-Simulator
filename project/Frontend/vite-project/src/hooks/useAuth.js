import axios from 'axios';

export const useAuth = () => {
  const logout = async () => {
    try {
      await axios.post('/api/auth/logout', {}, {
        withCredentials: true
      });
      window.location.href = '/';
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return {
    logout
  };
};
