import { useState, useEffect } from 'react';
import axios from 'axios';

export const useNotifications = () => {
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  const fetchUnreadNotifications = async () => {
    try {
      const response = await axios.get('/api/notifications/unread', {
        withCredentials: true
      });
      
      if (response.data.success) {
        setUnreadNotifications(response.data.unreadCount || 0);
      }
    } catch (error) {
      console.error('Error fetching unread notifications:', error);
    }
  };

  const updateUnreadCount = (count) => {
    setUnreadNotifications(count);
  };

  useEffect(() => {
    fetchUnreadNotifications();
  }, []);

  return {
    unreadNotifications,
    fetchUnreadNotifications,
    updateUnreadCount
  };
};
