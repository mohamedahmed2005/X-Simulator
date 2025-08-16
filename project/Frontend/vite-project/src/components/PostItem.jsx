import { usePostActions } from '../hooks/usePostActions';
import { usePostEditing } from '../hooks/usePostEditing';
import { useComments } from '../hooks/useComments';
import { useState } from 'react';

const PostItem = ({ 
  post, 
  user, 
  onFollowUpdate, 
  onPostDeleted, 
  updatePostLikes, 
  removePost, 
  addComment, 
  updateComment, 
  removeComment,
  addRepost,
  showDeletePostModal,
  showDeleteCommentModal,
  showMessage,
  formatDate
}) => {
  const [followLoading, setFollowLoading] = useState(false);
  
  const { handleLike, handleReshare, handleDelete, handleEditPost, deletingPosts, editLoading } = usePostActions(
    user, 
    updatePostLikes, 
    removePost, 
    onPostDeleted
  );
  
  const { 
    editingPost, 
    isEditing, 
    startEditing, 
    handleEditImageUpload, 
    removeEditImage, 
    updateEditText, 
    cancelEditing, 
    finishEditing 
  } = usePostEditing();

  const {
    commentInputs,
    editingComment,
    deletingComments,
    handleCommentInputChange,
    submitComment,
    startEditComment,
    cancelEditComment,
    updateEditingCommentText,
    saveEditComment,
    deleteComment
  } = useComments(addComment, updateComment, removeComment);

  const handleFollowClick = async (userId) => {
    if (followLoading) return;
    setFollowLoading(true);
    try {
      await onFollowUpdate(userId);
    } finally {
      setFollowLoading(false);
    }
  };

  const handleEditPostClick = () => {
    startEditing(post._id, post);
  };

  const handleSaveEdit = async () => {
    const result = await handleEditPost(
      editingPost.id, 
      editingPost.text, 
      editingPost.image || editingPost.imagePreview
    );
    
    if (result.success) {
      showMessage(result.message, 'success');
      finishEditing();
    } else {
      showMessage(result.message, 'error');
    }
  };

  const handleReshareClick = async () => {
    const result = await handleReshare(post._id);
    if (result.success) {
      showMessage(result.message, 'success');
      // Immediately add the repost to the posts list
      if (result.repost && addRepost) {
        addRepost(result.repost);
      }
    } else {
      showMessage(result.message, 'error');
    }
  };

  const handleDeleteClick = () => {
    showDeletePostModal(post._id, post);
  };

  const handleCommentSubmit = async (postId) => {
    console.log('Submitting comment for post:', postId);
    const result = await submitComment(postId);
    if (!result.success) {
      showMessage(result.message, 'error');
    } else {
      console.log('Comment submitted successfully');
    }
  };

  const handleCommentDelete = async (postId, commentId) => {
    const result = await deleteComment(postId, commentId);
    if (!result.success) {
      showMessage(result.message, 'error');
    }
  };

  const handleCommentSave = async () => {
    const result = await saveEditComment();
    if (!result.success) {
      showMessage(result.message, 'error');
    }
  };

  return (
    <div 
      className={`card transition-all duration-300 ease-in-out ${
        deletingPosts.has(post._id) 
          ? 'opacity-0 scale-95 -translate-y-2' 
          : 'opacity-100 scale-100 translate-y-0'
      }`}
    >
      <div className="flex items-start gap-3 mb-3">
        <img 
          src={post.user?.profileImg || 'https://via.placeholder.com/40'} 
          alt="Profile" 
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-white">{post.user?.fullName}</span>
            <span className="text-x-text-gray">@{post.user?.username}</span>
            <span className="text-x-text-gray text-sm">{formatDate(post.createdAt)}</span>
          </div>
        </div>
        {post.user?._id !== user?._id && (
          <button 
            className={`px-4 py-1 rounded-full text-sm font-semibold transition-colors ${
              followLoading 
                ? 'bg-x-text-gray text-x-black opacity-50 cursor-not-allowed'
                : user?.following?.some(id => String(id) === String(post.user?._id))
                  ? 'bg-x-text-gray text-x-black hover:bg-x-hover-gray' 
                  : 'bg-x-blue text-white hover:bg-x-blue-hover'
            }`}
            onClick={() => handleFollowClick(post.user?._id)}
            disabled={followLoading}
          >
            {followLoading ? 'Following...' : (user?.following?.some(id => String(id) === String(post.user?._id)) ? 'Following' : 'Follow')}
          </button>
        )}
        {post.user?._id === user?._id && (
          <div className="flex items-center gap-2">
            <button 
              className="p-1 text-x-text-gray hover:text-x-blue hover:bg-x-blue/10 rounded-full transition-colors"
              onClick={handleEditPostClick}
              title="Edit post"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-x-blue">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
              </svg>
            </button>
            <button 
              className="p-1 text-x-text-gray hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
              onClick={handleDeleteClick}
              title="Delete post"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-red-500">
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
              </svg>
            </button>
          </div>
        )}
      </div>
      
      <div className="mb-3">
        {post.isReshare && (
          <div className="flex items-center gap-2 text-green-400 text-sm mb-2">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M23.77 15.67c-.292-.293-.767-.293-1.06 0l-2.54 2.54V15c0-3.31-2.69-6-6-6s-6 2.69-6 6v3.21l-2.54-2.54c-.292-.293-.767-.293-1.06 0s-.292.767 0 1.06l3.77 3.77c.292.293.767.293 1.06 0l3.77-3.77c.292-.293.292-.767 0-1.06z"/>
            </svg>
            <span>Reposted</span>
          </div>
        )}
        
        {/* Edit Post UI */}
        {editingPost.id === post._id ? (
          <div className="space-y-3">
            <textarea
              value={editingPost.text}
              onChange={(e) => updateEditText(e.target.value)}
              placeholder="What's happening?"
              className="w-full p-3 bg-x-light-gray border border-x-border rounded-lg text-white placeholder-x-text-gray focus:outline-none focus:border-x-blue resize-none"
              rows="3"
            />
            
            {editingPost.imagePreview && (
              <div className="relative">
                <img src={editingPost.imagePreview} alt="Preview" className="w-full max-h-96 object-cover rounded-lg" />
                <button 
                  className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
                  onClick={removeEditImage}
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
                  id={`edit-post-image-${post._id}`}
                  accept="image/*"
                  onChange={handleEditImageUpload}
                  className="hidden"
                />
                <label 
                  htmlFor={`edit-post-image-${post._id}`} 
                  className="p-2 text-x-blue hover:bg-x-blue/10 rounded-full cursor-pointer transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
                    <path d="M14 14h2v-4h-2v4zm-2-6h6v2h-6V8zm-2 4h2V8h-2v4z"/>
                  </svg>
                </label>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={handleSaveEdit}
                  disabled={editLoading}
                  className="px-4 py-2 bg-x-blue text-white rounded-full font-semibold hover:bg-x-blue-hover transition-colors disabled:opacity-50"
                >
                  {editLoading ? 'Saving...' : 'Save'}
                </button>
                <button 
                  onClick={cancelEditing}
                  className="px-4 py-2 bg-x-text-gray text-white rounded-full font-semibold hover:bg-x-hover-gray transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {post.text && <p className="text-white text-base mb-3">{post.text}</p>}
            {post.img && (
              <div className="mb-3">
                <img src={post.img} alt="Post" className="w-full rounded-lg" />
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Post Actions and Comments - Only show when not editing */}
      {editingPost.id !== post._id && (
        <>
          <div className="flex items-center gap-6 border-t border-x-border pt-3">
            <button 
              className={`flex items-center gap-2 text-x-text-gray hover:text-red-500 transition-colors ${
                post.likes.includes(user?._id) ? 'text-red-500' : ''
              }`}
              onClick={() => handleLike(post._id)}
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                <path d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12z"/>
              </svg>
              <span>{post.likes.length}</span>
            </button>
            
            <button 
              className="flex items-center gap-2 text-x-text-gray hover:text-x-blue transition-colors"
              onClick={handleReshareClick}
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                <path d="M23.77 15.67c-.292-.293-.767-.293-1.06 0l-2.54 2.54V15c0-3.31-2.69-6-6-6s-6 2.69-6 6v3.21l-2.54-2.54c-.292-.293-.767-.293-1.06 0s-.292.767 0 1.06l3.77 3.77c.292.293.767.293 1.06 0l3.77-3.77c.292-.293.292-.767 0-1.06z"/>
              </svg>
              <span>Reshare</span>
            </button>
          </div>

          {/* Comments Section */}
          <div className="mt-4 border-t border-x-border pt-3">
            {post.comments && post.comments.length > 0 && (
              <div className="space-y-3 mb-3">
                {post.comments.map((comment) => (
                  <div key={comment._id} className="flex gap-3">
                    <img
                      src={comment.user?.profileImg || 'https://via.placeholder.com/32'}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-white text-sm">{comment.user?.fullName || 'User'}</span>
                        <span className="text-x-text-gray text-xs">@{comment.user?.username || 'username'}</span>
                      </div>
                      {editingComment.id === comment._id ? (
                        <div className="space-y-2">
                          <input
                            value={editingComment.text}
                            onChange={(e) => updateEditingCommentText(e.target.value)}
                            className="w-full p-2 bg-x-light-gray border border-x-border rounded text-white text-sm"
                          />
                          <div className="flex gap-2">
                            <button onClick={handleCommentSave} className="px-3 py-1 bg-x-blue text-white text-xs rounded hover:bg-x-blue-hover">Save</button>
                            <button onClick={cancelEditComment} className="px-3 py-1 bg-x-text-gray text-white text-xs rounded hover:bg-x-hover-gray">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-white text-sm">{comment.text}</p>
                      )}
                    </div>
                    {(comment.user?._id === user?._id) && editingComment.id !== comment._id && (
                      <div className="flex gap-1">
                        <button onClick={() => startEditComment(post._id, comment)} className="text-xs text-x-blue hover:underline">Edit</button>
                        <button onClick={() => showDeleteCommentModal(post._id, comment._id)} className="text-xs text-red-500 hover:underline">Delete</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Add comment */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Write a comment"
                value={commentInputs[post._id] || ''}
                onChange={(e) => handleCommentInputChange(post._id, e.target.value)}
                className="flex-1 p-2 bg-x-light-gray border border-x-border rounded text-white placeholder-x-text-gray text-sm focus:outline-none focus:border-x-blue"
              />
              <button 
                onClick={() => handleCommentSubmit(post._id)} 
                disabled={!commentInputs[post._id]?.trim()}
                className="px-4 py-2 bg-x-blue text-white text-sm rounded hover:bg-x-blue-hover disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Comment
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PostItem;
