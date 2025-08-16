import { useState, useEffect } from 'react';
import axios from 'axios';

const FollowersFollowing = ({ 
  user, 
  onFollowUpdate, 
  showFollowers = null, 
  showFollowing = null,
  compact = false 
}) => {
  const [followersUsers, setFollowersUsers] = useState([]);
  const [followingUsers, setFollowingUsers] = useState([]);
  const [showFollowersList, setShowFollowersList] = useState(showFollowers ?? false);
  const [showFollowingList, setShowFollowingList] = useState(showFollowing ?? false);
  const [loadingFollowers, setLoadingFollowers] = useState(false);
  const [loadingFollowing, setLoadingFollowing] = useState(false);

  useEffect(() => {
    if (user?.followers) {
      fetchFollowersUsers();
    }
  }, [user?.followers]);

  useEffect(() => {
    if (user?.following) {
      fetchFollowingUsers();
    }
  }, [user?.following]);

  // Update local state when props change
  useEffect(() => {
    if (showFollowers !== null) {
      setShowFollowersList(showFollowers);
    }
  }, [showFollowers]);

  useEffect(() => {
    if (showFollowing !== null) {
      setShowFollowingList(showFollowing);
    }
  }, [showFollowing]);

  const fetchFollowersUsers = async () => {
    if (!user?.followers || user.followers.length === 0) {
      setFollowersUsers([]);
      return;
    }

    setLoadingFollowers(true);
    try {
      const response = await axios.get('/api/user/users', {
        withCredentials: true
      });
      
      if (response.data.success) {
        const followersUserDetails = response.data.users.filter(userDetail => 
          user.followers.includes(userDetail._id)
        );
        setFollowersUsers(followersUserDetails);
      }
    } catch (error) {
      console.error('Error fetching followers users:', error);
    } finally {
      setLoadingFollowers(false);
    }
  };

  const fetchFollowingUsers = async () => {
    if (!user?.following || user.following.length === 0) {
      setFollowingUsers([]);
      return;
    }

    setLoadingFollowing(true);
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
    } finally {
      setLoadingFollowing(false);
    }
  };

  const handleFollowClick = async (userId) => {
    if (onFollowUpdate) {
      await onFollowUpdate(userId);
      // Refresh the lists after follow/unfollow
      fetchFollowersUsers();
      fetchFollowingUsers();
    }
  };

  // If compact mode and no specific list is forced to show, don't render anything
  if (compact && showFollowers === null && showFollowing === null) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Followers and Following Counts - Only show if not in compact mode */}
      {!compact && (
        <div className="flex gap-6 py-4 border-t border-x-border justify-start">
          <button 
            onClick={() => setShowFollowersList(!showFollowersList)}
            className="flex flex-col items-start gap-1 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <span className="text-xl font-bold text-white">{user?.followers?.length || 0}</span>
            <span className="text-xs text-x-text-gray">Followers</span>
          </button>
          <button 
            onClick={() => setShowFollowingList(!showFollowingList)}
            className="flex flex-col items-start gap-1 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <span className="text-xl font-bold text-white">{user?.following?.length || 0}</span>
            <span className="text-xs text-x-text-gray">Following</span>
          </button>
        </div>
      )}
      
      {/* Followers List */}
      {showFollowersList && (
        <div className="mt-6 p-0">
          {!compact && (
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold m-0 text-white">Followers</h3>
              <button 
                onClick={() => setShowFollowersList(false)}
                className="text-x-text-gray hover:text-white transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>
          )}
          {loadingFollowers ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-x-blue"></div>
            </div>
          ) : followersUsers.length > 0 ? (
            <div className="flex flex-col gap-3">
              {followersUsers.map((follower) => (
                <div key={follower._id} className="flex items-center gap-3 p-3 bg-x-dark-gray border border-x-border rounded-xl">
                  <img 
                    src={follower.profileImg || 'https://via.placeholder.com/40'} 
                    alt="Profile" 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <span className="text-sm font-semibold text-white block">{follower.fullName}</span>
                    <span className="text-xs text-x-text-gray block">@{follower.username}</span>
                  </div>
                  {follower._id !== user?._id && (
                    <button
                      onClick={() => handleFollowClick(follower._id)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                        user?.following?.includes(follower._id)
                          ? 'bg-x-text-gray text-x-black hover:bg-x-hover-gray' 
                          : 'bg-x-blue text-white hover:bg-x-blue-hover'
                      }`}
                    >
                      {user?.following?.includes(follower._id) ? 'Following' : 'Follow'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-x-text-gray">
              <p>No followers yet</p>
            </div>
          )}
        </div>
      )}
      
      {/* Following List */}
      {showFollowingList && (
        <div className="mt-6 p-0">
          {!compact && (
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold m-0 text-white">Following</h3>
              <button 
                onClick={() => setShowFollowingList(false)}
                className="text-x-text-gray hover:text-white transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>
          )}
          {loadingFollowing ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-x-blue"></div>
            </div>
          ) : followingUsers.length > 0 ? (
            <div className="flex flex-col gap-3">
              {followingUsers.map((followedUser) => (
                <div key={followedUser._id} className="flex items-center gap-3 p-3 bg-x-dark-gray border border-x-border rounded-xl">
                  <img 
                    src={followedUser.profileImg || 'https://via.placeholder.com/40'} 
                    alt="Profile" 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <span className="text-sm font-semibold text-white block">{followedUser.fullName}</span>
                    <span className="text-xs text-x-text-gray block">@{followedUser.username}</span>
                  </div>
                  <button
                    onClick={() => handleFollowClick(followedUser._id)}
                    className="px-3 py-1 rounded-full text-xs font-semibold bg-x-text-gray text-x-black hover:bg-x-hover-gray transition-colors"
                  >
                    Following
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-x-text-gray">
              <p>Not following anyone yet</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FollowersFollowing;
