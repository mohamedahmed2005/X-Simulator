import { useState, useEffect } from 'react';
import axios from 'axios';
import './Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('/api/notifications', {
        withCredentials: true
      });
      
      if (response.data.success) {
        setNotifications(response.data.notifications || []);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await axios.get('/api/notifications/unread', {
        withCredentials: true
      });
      
      if (response.data.success) {
        setUnreadCount(response.data.unreadCount || 0);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      const response = await axios.delete(`/api/notifications/${notificationId}`, {
        withCredentials: true
      });
      
      if (response.data.success) {
        setNotifications(prev => prev.filter(n => n._id !== notificationId));
        if (unreadCount > 0) {
          setUnreadCount(prev => prev - 1);
        }
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const handleClearAll = async () => {
    try {
      const response = await axios.delete('/api/notifications/clear', {
        withCredentials: true
      });
      
      if (response.data.success) {
        setNotifications([]);
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'follow':
        return (
          <svg viewBox="0 0 24 24" className="notification-icon follow">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        );
      case 'like':
        return (
          <svg viewBox="0 0 24 24" className="notification-icon like">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        );
      case 'reshare':
        return (
          <svg viewBox="0 0 24 24" className="notification-icon reshare">
            <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
          </svg>
        );
      case 'comment':
        return (
          <svg viewBox="0 0 24 24" className="notification-icon comment">
            <path d="M21.99 4c0-1.1-.89-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 24 24" className="notification-icon default">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        );
    }
  };

  const getNotificationText = (notification) => {
    const { from, type, post } = notification;
    const username = from?.username || 'Someone';
    
    switch (type) {
      case 'follow':
        return `${username} started following you`;
      case 'like':
        return `${username} liked your post`;
      case 'reshare':
        return `${username} reshared your post`;
      case 'comment':
        return `${username} commented on your post`;
      default:
        return `${username} interacted with your content`;
    }
  };

  if (loading) {
    return (
      <div className="notifications-container">
        <div className="loading">Loading notifications...</div>
      </div>
    );
  }

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <h2>Notifications</h2>
        {notifications.length > 0 && (
          <button className="clear-all-btn" onClick={handleClearAll}>
            Clear all
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="no-notifications">
          <div className="no-notifications-icon">
            <svg viewBox="0 0 24 24">
              <path d="M19.993 9.042C19.48 5.017 16.054 2 11.996 2C8.027 2 4.692 4.836 4.132 8.667L2.086 17.5H21.916L19.993 9.042zM12 20.5c-1.1 0-2-.9-2-2h4c0 1.1-.9 2-2 2z"/>
            </svg>
          </div>
          <h3>You're all caught up!</h3>
          <p>You don't have any notifications yet.</p>
        </div>
      ) : (
        <div className="notifications-list">
          {notifications.map((notification) => (
            <div 
              key={notification._id} 
              className={`notification-item ${!notification.read ? 'unread' : ''}`}
            >
              <div className="notification-avatar">
                <img 
                  src={notification.from?.profileImg || 'https://via.placeholder.com/40'} 
                  alt={notification.from?.fullName || 'User'} 
                />
              </div>
              
              <div className="notification-content">
                <div className="notification-icon-wrapper">
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="notification-text">
                  <p>{getNotificationText(notification)}</p>
                  <span className="notification-time">
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <button 
                className="delete-notification-btn"
                onClick={() => handleDeleteNotification(notification._id)}
                title="Delete notification"
              >
                <svg viewBox="0 0 24 24">
                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
