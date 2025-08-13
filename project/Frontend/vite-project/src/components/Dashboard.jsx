import { useEffect } from 'react';
import Navbar from './Navbar';
import DashboardContent from './DashboardContent';
import LoadingSpinner from './LoadingSpinner';
import { 
  useUser, 
  useAuth, 
  useNotifications, 
  useFollow, 
  usePostManagement, 
  useTabNavigation 
} from '../hooks';

const Dashboard = () => {
  const { user, loading, updateUser } = useUser();
  const { logout } = useAuth();
  const { unreadNotifications } = useNotifications();
  const { handleFollowUpdate } = useFollow(user, updateUser);
  const { handlePostCreated, handlePostDeleted } = usePostManagement();
  const { activeTab, setActiveTab } = useTabNavigation();

  useEffect(() => {
    document.title = 'Dashboard';
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-x-black text-white font-x-system pt-15">
      {/* Navbar */}
      <Navbar 
        user={user} 
        onLogout={logout} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        unreadNotifications={unreadNotifications}
      />
      
      {/* Main Content */}
      <DashboardContent 
        activeTab={activeTab}
        user={user}
        onPostCreated={handlePostCreated}
        onPostDeleted={handlePostDeleted}
        onFollowUpdate={handleFollowUpdate}
        onUserUpdate={updateUser}
      />
    </div>
  );
};

export default Dashboard; 