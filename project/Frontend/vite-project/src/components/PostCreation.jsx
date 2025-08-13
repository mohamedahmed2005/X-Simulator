import { usePostCreation } from '../hooks/usePostCreation';

const PostCreation = ({ user, onPostCreated, fetchPosts, showMessage }) => {
  const {
    newPost,
    setNewPost,
    postImage,
    imagePreview,
    isCreating,
    handleImageUpload,
    removeImage,
    createPost
  } = usePostCreation(onPostCreated, fetchPosts);

  const handleCreatePost = async () => {
    const result = await createPost();
    if (result.success) {
      showMessage(result.message, 'success');
    } else {
      showMessage(result.message, 'error');
    }
  };

  return (
    <div className="mb-6">
      <div className="card">
        <div className="flex gap-3">
          <img 
            src={user?.profileImg || 'https://via.placeholder.com/40'} 
            alt="Profile" 
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1">
            <textarea
              placeholder="What's happening?"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              className="w-full p-3 bg-transparent border-none resize-none text-white placeholder-x-text-gray focus:outline-none text-base"
              rows="3"
            />
            
            {imagePreview && (
              <div className="relative mb-3">
                <img src={imagePreview} alt="Preview" className="w-full max-h-96 object-cover rounded-lg" />
                <button 
                  className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors" 
                  onClick={removeImage}
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                  </svg>
                </button>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  id="post-image-upload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <label 
                  htmlFor="post-image-upload" 
                  className="p-2 text-x-blue hover:bg-x-blue/10 rounded-full cursor-pointer transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-blue-500">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
                    <path d="M14 14h2v-4h-2v4zm-2-6h6v2h-6V8zm-2 4h2V8h-2v4z"/>
                  </svg>
                </label>
              </div>
              <button 
                className="bg-x-blue text-white px-6 py-2 rounded-full font-semibold hover:bg-x-blue-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleCreatePost}
                disabled={isCreating || (!newPost.trim() && !postImage)}
              >
                {isCreating ? 'Posting...' : 'Post'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCreation;
