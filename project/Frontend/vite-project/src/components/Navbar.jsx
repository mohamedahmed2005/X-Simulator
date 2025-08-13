import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Navbar = ({ user, onLogout, activeTab, setActiveTab, unreadNotifications = 0 }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout', {}, {
        withCredentials: true
      });
      onLogout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Public navbar (no user)
  if (!user) {
    return (
      <div className="fixed top-0 left-0 w-full h-15 bg-black/95 backdrop-blur-md border-b border-x-border z-[9999] block">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-5">
          <div className="flex items-center">
            <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </div>
          <nav className="flex items-center gap-5">
            <Link className="flex items-center gap-2 px-4 py-2 border-none bg-none rounded-full cursor-pointer transition-colors duration-200 text-x-text-gray font-medium hover:bg-x-light-gray" to="/login">
              <span>Login</span>
            </Link>
            <Link className="flex items-center gap-2 px-4 py-2 border-none bg-none rounded-full cursor-pointer transition-colors duration-200 text-x-text-gray font-medium hover:bg-x-light-gray" to="/signup">
              <span>Sign up</span>
            </Link>
          </nav>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-0 left-0 w-full h-15 bg-black/95 backdrop-blur-md border-b border-x-border z-[9999] block">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-5">
        {/* X Logo */}
        <div className="flex items-center">
          <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center gap-5">
          <button 
            className={`flex items-center gap-2 px-4 py-2 border-none bg-none rounded-full cursor-pointer transition-colors duration-200 ${
              activeTab === 'home' ? 'text-white font-bold' : 'text-x-text-gray font-medium'
            } hover:bg-x-light-gray`}
            onClick={() => setActiveTab('home')}
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
              <path d="M12 1.696L.622 8.807l1.06 1.696L3 9.679V19.5C3 20.881 4.119 22 5.5 22h13c1.381 0 2.5-1.119 2.5-2.5V9.679l1.318.824 1.06-1.696L12 1.696zM12 16.5c-1.933 0-3.5-1.567-3.5-3.5s1.567-3.5 3.5-3.5 3.5 1.567 3.5 3.5-1.567 3.5-3.5 3.5z"/>
            </svg>
            <span>Home</span>
          </button>
          
          <button 
            className={`flex items-center gap-2 px-4 py-2 border-none bg-none rounded-full cursor-pointer transition-colors duration-200 ${
              activeTab === 'notifications' ? 'text-white font-bold' : 'text-x-text-gray font-medium'
            } hover:bg-x-light-gray`}
            onClick={() => setActiveTab('notifications')}
          >
            <div className="relative mr-5">
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                <path d="M19.993 9.042C19.48 5.017 16.054 2 11.996 2C8.027 2 4.692 4.836 4.132 8.667L2.086 17.5H21.916L19.993 9.042zM12 20.5c-1.1 0-2-.9-2-2h4c0 1.1-.9 2-2 2z"/>
              </svg>
              {unreadNotifications > 0 && (
                <span className="absolute -top-2 -right-2 bg-x-pink text-white rounded-full w-[18px] h-[18px] flex items-center justify-center text-xs font-bold border-2 border-x-black">{unreadNotifications}</span>
              )}
            </div>
            <span>Notifications</span>
          </button>
          
          <button 
            className={`flex items-center gap-2 px-4 py-2 border-none bg-none rounded-full cursor-pointer transition-colors duration-200 ${
              activeTab === 'profile' ? 'text-white font-bold' : 'text-x-text-gray font-medium'
            } hover:bg-x-light-gray`}
            onClick={() => setActiveTab('profile')}
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
              <path d="M5.651 19h12.698c-.337-1.021-1.22-1.779-2.317-1.779H7.968c-1.097 0-1.98.758-2.317 1.779zm7.968-3.779c1.097 0 1.98-.758 2.317-1.779H7.968c-1.097 0-1.98.758-2.317 1.779h7.968zM12 2c-2.209 0-4 1.791-4 4s1.791 4 4 4 4-1.791 4-4-1.791-4-4-4z"/>
            </svg>
            <span>Profile</span>
          </button>
        </nav>

        {/* User Menu */}
        <div className="flex items-center gap-3 px-3 py-2 rounded-full cursor-pointer transition-colors duration-200 hover:bg-x-light-gray">
          <div 
            className="w-10 h-10 rounded-full overflow-hidden"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <img 
              src={user?.profileImg || 'https://via.placeholder.com/40'} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
          <div
              className="flex flex-col items-start"
              onClick={() => setActiveTab('profile')}
              style={{ cursor: "pointer" }}
            >
              <div className="font-bold text-white text-sm">{user?.fullName}</div>
              <div className="text-x-text-gray text-xs">@{user?.username}</div>
          </div>
          <button className="bg-none border-none cursor-pointer p-1 rounded-full transition-colors duration-200 hover:bg-x-light-gray" onClick={handleLogout}>
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 fill-x-text-gray"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              width="24"
              height="24"
            >
              <path d="M16 3h-4a1 1 0 0 0-1 1v4h2V5h3v14h-3v-3h-2v4a1 1 0 0 0 1 1h4a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z" />
              <path d="M3 12l5-5v3h7v4H8v3l-5-5z" />
            </svg>
          </button>

        </div>
      </div>
    </div>
  );
};

export default Navbar; 