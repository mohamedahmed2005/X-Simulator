import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import Post from './Post';
import Notifications from './Notifications';
import './Dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [followingUsers, setFollowingUsers] = useState([]);

  useEffect(() => {
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

    fetchUserProfile();
    fetchUnreadNotifications();
  }, []);

  useEffect(() => {
    if (user?.following) {
      fetchFollowingUsers();
    }
  }, [user?.following]);

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout', {}, {
        withCredentials: true
      });
      window.location.href = '/login';
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handlePostCreated = () => {
    // Refresh posts or update UI as needed
    console.log('Post created successfully');
  };

  const handlePostDeleted = () => {
    // Update UI as needed
    console.log('Post deleted successfully');
  };

  const handleFollowUpdate = async (userId, isFollowing) => {
    if (!user) return;
    
    try {
      const response = await axios.post(`/api/user/follow/${userId}`, {}, {
        withCredentials: true
      });
      
      if (response.data.success) {
        // Update local user state
        setUser(prevUser => {
          if (!prevUser) return prevUser;
          
          if (isFollowing) {
            // Add to following
            return {
              ...prevUser,
              following: [...(prevUser.following || []), userId]
            };
          } else {
            // Remove from following
            return {
              ...prevUser,
              following: (prevUser.following || []).filter(id => id !== userId)
            };
          }
        });

        // Update followingUsers state
        if (isFollowing) {
          // Add user to followingUsers
          setFollowingUsers(prev => {
            const userExists = prev.find(u => u._id === userId);
            if (!userExists) {
              // We need to fetch the user details
              fetchFollowingUsers();
            }
            return prev;
          });
        } else {
          // Remove user from followingUsers
          setFollowingUsers(prev => prev.filter(u => u._id !== userId));
        }
      }
    } catch (error) {
      console.error('Error following/unfollowing user:', error);
      alert('Failed to update follow status. Please try again.');
    }
  };

  const fetchFollowingUsers = async () => {
    if (!user?.following || user.following.length === 0) {
      setFollowingUsers([]);
      return;
    }

    try {
      const response = await axios.get('/api/user/users', {
        withCredentials: true
      });
      
      if (response.data.success) {
        const followingUserDetails = response.data.users.filter(userDetail => 
          user.following.includes(userDetail._id)
        );
        setFollowingUsers(followingUserDetails);
      }
    } catch (error) {
      console.error('Error fetching following users:', error);
    }
  };

  const handleProfileImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfileImage = async () => {
    if (!profileImage) {
      alert('Please select an image first');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('profilePicture', profileImage);

      const response = await axios.put('/api/user/profile-picture', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        // Update local user state with new profile picture
        setUser(prev => ({
          ...prev,
          profileImg: response.data.profilePicture
        }));
        setProfileImage(null);
        setImagePreview(null);
        const fileInput = document.getElementById('profile-image-upload');
        if (fileInput) fileInput.value = '';
        alert('Profile picture updated successfully!');
      }
    } catch (error) {
      console.error('Error updating profile picture:', error);
      alert('Error updating profile picture. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const removeProfileImage = () => {
    setProfileImage(null);
    setImagePreview(null);
    const fileInput = document.getElementById('profile-image-upload');
    if (fileInput) fileInput.value = '';
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Navbar */}
      <Navbar 
        user={user} 
        onLogout={handleLogout} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        unreadNotifications={unreadNotifications}
      />
      
      {/* Main Content */}
      <div className="main-content">
        <div className="content-header">
          <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
        </div>
        
        <div className="content-body">
          {activeTab === 'home' && (
            <div className="home-content">
              <Post 
                user={user}
                onPostCreated={handlePostCreated}
                onPostDeleted={handlePostDeleted}
                onFollowUpdate={handleFollowUpdate}
              />
            </div>
          )}
          
          {activeTab === 'profile' && (
            <div className="profile-content">
              <div className="profile-header">
                <div className="profile-banner"></div>
                <div className="profile-avatar">
                  <img 
                    src={user?.profileImg || 'https://via.placeholder.com/120'} 
                    alt="Profile" 
                  />
                  <div className="avatar-upload-overlay">
                    <input
                      type="file"
                      id="profile-image-upload"
                      accept="image/*"
                      onChange={handleProfileImageUpload}
                      className="file-input"
                    />
                    <label htmlFor="profile-image-upload" className="avatar-upload-btn">
                      <svg viewBox="0 0 24 24" className="camera-icon">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                    </label>
                  </div>
                </div>
                <div className="profile-info">
                  <h2>{user?.fullName}</h2>
                  <p className="username">@{user?.username}</p>
                  <p className="email">{user?.email}</p>
                </div>
              </div>
              
              {/* Profile Image Upload Section */}
              {imagePreview && (
                <div className="profile-upload-section">
                  <div className="upload-preview-card">
                    <h3>Update Profile Picture</h3>
                    <div className="preview-container">
                      <img src={imagePreview} alt="Preview" className="preview-image" />
                    </div>
                    <div className="upload-actions">
                      <button 
                        className="update-profile-btn" 
                        onClick={handleUpdateProfileImage}
                        disabled={uploading}
                      >
                        {uploading ? 'Updating...' : 'Update Profile Picture'}
                      </button>
                      <button className="cancel-btn" onClick={removeProfileImage}>
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="profile-stats">
                <div className="stat-item">
                  <span className="stat-number">{user?.following?.length || 0}</span>
                  <span className="stat-label">Following</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{user?.followers?.length || 0}</span>
                  <span className="stat-label">Followers</span>
                </div>
              </div>
              
              {/* Following List */}
              {followingUsers.length > 0 && (
                <div className="following-section">
                  <h3>Following</h3>
                  <div className="following-list">
                    {followingUsers.map((followedUser) => (
                      <div key={followedUser._id} className="following-item">
                        <img 
                          src={followedUser.profileImg || 'https://via.placeholder.com/40'} 
                          alt="Profile" 
                          className="following-avatar"
                        />
                        <div className="following-info">
                          <span className="following-name">{followedUser.fullName}</span>
                          <span className="following-username">@{followedUser.username}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'notifications' && (
            <div className="notifications-content">
              <Notifications />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 