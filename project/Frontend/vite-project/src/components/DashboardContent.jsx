import Post from './Post';
import Profile from './Profile';
import Notifications from './Notifications';

const DashboardContent = ({ 
  activeTab, 
  user, 
  onPostCreated, 
  onPostDeleted, 
  onFollowUpdate, 
  onUserUpdate 
}) => {
  return (
    <div className="flex-1 border-r border-x-border min-h-[calc(100vh-60px)] max-w-full m-0 w-full">
      <div className="sticky top-15 bg-black/65 backdrop-blur-xl border-b border-x-border p-4 z-50">
        <h1 className="text-xl font-bold m-0 text-white">
          {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
        </h1>
      </div>
      
      <div className="p-4">
        {activeTab === 'home' && (
          <div className="max-w-full">
            <Post 
              user={user}
              onPostCreated={onPostCreated}
              onPostDeleted={onPostDeleted}
              onFollowUpdate={onFollowUpdate}
            />
          </div>
        )}
        
        {activeTab === 'profile' && (
          <Profile user={user} onUserUpdate={onUserUpdate} />
        )}
        
        {activeTab === 'notifications' && (
          <div className="max-w-full">
            <Notifications />
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardContent;
