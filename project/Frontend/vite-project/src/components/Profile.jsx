import { useState, useEffect } from 'react';
import axios from 'axios';
import FollowersFollowing from './FollowersFollowing';

const Profile = ({ user, onUserUpdate, onFollowUpdate }) => {
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    document.title = 'Profile';
  }, []);

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
        const updatedUser = {
          ...user,
          profileImg: response.data.profilePicture
        };
        onUserUpdate(updatedUser);
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

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-white text-base font-normal">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="justify-left max-w-full">
      <div className="relative mb-4">
        <div className="relative ml-0 mb-4">
          <img 
            src={user?.profileImg || 'https://via.placeholder.com/120'} 
            alt="Profile" 
            className="w-30 h-30 rounded-full border-4 border-x-black object-cover"
          />
          <div className="absolute bottom-0 right-0 bg-x-blue rounded-full w-9 h-9 flex items-center justify-center cursor-pointer transition-colors duration-200 border-3 border-x-black hover:bg-x-blue-hover">
            <input
              type="file"
              id="profile-image-upload"
              accept="image/*"
              onChange={handleProfileImageUpload}
              className="hidden"
            />
            <label htmlFor="profile-image-upload" className="flex items-center justify-center cursor-pointer w-full h-full">
              <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-white">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </label>
          </div>
        </div>
        <div className="pb-4">
          <h2 className="text-xl font-bold m-0 mb-1 text-white">{user?.fullName}</h2>
          <p className="text-sm text-x-text-gray m-0 mb-1">@{user?.username}</p>
          <p className="text-sm text-x-text-gray m-0">{user?.email}</p>
        </div>
      </div>
      
      {/* Profile Image Upload Section */}
      {imagePreview && (
        <div className="my-4">
          <div className="card">
            <h3 className="text-lg font-bold m-0 mb-4 text-white">Update Profile Picture</h3>
            <div className="flex justify-start mb-4">
              <img src={imagePreview} alt="Preview" className="w-30 h-30 rounded-full object-cover border-3 border-x-border" />
            </div>
            <div className="flex gap-3 justify-start">
              <button 
                className="bg-x-blue text-white border-none rounded-full py-3 px-6 text-sm font-bold cursor-pointer transition-colors duration-200 hover:bg-x-blue-hover disabled:bg-x-text-gray disabled:cursor-not-allowed" 
                onClick={handleUpdateProfileImage}
                disabled={uploading}
              >
                {uploading ? 'Updating...' : 'Update Profile Picture'}
              </button>
              <button className="bg-transparent text-x-text-gray border border-x-border rounded-full py-3 px-6 text-sm font-bold cursor-pointer transition-all duration-200 hover:bg-x-light-gray hover:border-x-text-gray" onClick={removeProfileImage}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Followers and Following Component */}
      <FollowersFollowing user={user} onFollowUpdate={onFollowUpdate} />
    </div>
  );
};

export default Profile;
