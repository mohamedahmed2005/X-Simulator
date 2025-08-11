import { useState, useEffect } from 'react';
import axios from 'axios';
import './Post.css';

const Post = ({ user, onPostCreated, onPostDeleted, onFollowUpdate }) => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [postImage, setPostImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [editingComment, setEditingComment] = useState({ id: null, text: '', postId: null });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('/api/posts/all', {
        withCredentials: true
      });
      
      if (response.data.success) {
        setPosts(response.data.posts);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentInputChange = (postId, value) => {
    setCommentInputs(prev => ({ ...prev, [postId]: value }));
  };

  const submitComment = async (postId) => {
    const text = (commentInputs[postId] || '').trim();
    if (!text) return;
    try {
      await axios.post(`/api/posts/comment/${postId}`, { text }, { withCredentials: true });
      setCommentInputs(prev => ({ ...prev, [postId]: '' }));
      fetchPosts();
    } catch (error) {
      console.error('Error commenting:', error);
      alert('Failed to add comment');
    }
  };

  const startEditComment = (postId, comment) => {
    setEditingComment({ id: comment._id, text: comment.text, postId });
  };

  const cancelEditComment = () => setEditingComment({ id: null, text: '', postId: null });

  const saveEditComment = async () => {
    const { id, text, postId } = editingComment;
    if (!id || !text.trim()) return;
    try {
      await axios.post(`/api/posts/edit-comment/${id}`, { text: text.trim(), postId }, { withCredentials: true });
      cancelEditComment();
      fetchPosts();
    } catch (error) {
      console.error('Error editing comment:', error);
      alert('Failed to edit comment');
    }
  };

  const deleteComment = async (postId, commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await axios.delete(`/api/posts/delete-comment/${commentId}`, {
        data: { postId },
        withCredentials: true
      });
      fetchPosts();
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment');
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setPostImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setPostImage(null);
    setImagePreview(null);
    const fileInput = document.getElementById('post-image-upload');
    if (fileInput) fileInput.value = '';
  };

  const createPost = async () => {
    if (!newPost.trim() && !postImage) {
      alert('Please enter some text or upload an image');
      return;
    }

    setIsCreating(true);
    try {
      let imgData = null;
      if (postImage) {
        const reader = new FileReader();
        reader.onload = (e) => {
          imgData = e.target.result;
          submitPost(imgData);
        };
        reader.readAsDataURL(postImage);
      } else {
        submitPost(null);
      }
    } catch (error) {
      console.error('Error creating post:', error);
      setIsCreating(false);
    }
  };

  const submitPost = async (imgData) => {
    try {
      const postData = {
        text: newPost.trim()
      };
      
      if (imgData) {
        postData.img = imgData;
      }

      const response = await axios.post('/api/posts/create', postData, {
        withCredentials: true
      });

      if (response.data.success) {
        setNewPost('');
        setPostImage(null);
        setImagePreview(null);
        const fileInput = document.getElementById('post-image-upload');
        if (fileInput) fileInput.value = '';
        
        // Refresh posts
        fetchPosts();
        if (onPostCreated) onPostCreated();
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Error creating post. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      const response = await axios.post(`/api/posts/like/${postId}`, {}, {
        withCredentials: true
      });
      
      if (response.data.success) {
        // Update the post's like status locally
        setPosts(prevPosts => 
          prevPosts.map(post => {
            if (post._id === postId) {
              const isLiked = post.likes.includes(user._id);
              return {
                ...post,
                likes: isLiked 
                  ? post.likes.filter(id => id !== user._id)
                  : [...post.likes, user._id]
              };
            }
            return post;
          })
        );
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleReshare = async (postId) => {
    try {
      const response = await axios.post(`/api/posts/reshare/${postId}`, {}, {
        withCredentials: true
      });

      if (response.data.success) {
        fetchPosts();
        alert('Post reshared successfully!');
      }
    } catch (error) {
      console.error('Error resharing post:', error);
      alert('Error resharing post. Please try again.');
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      const response = await axios.delete(`/api/posts/delete/${postId}`, {
        withCredentials: true
      });
      
      if (response.data.success) {
        setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
        if (onPostDeleted) onPostDeleted();
        alert('Post deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Error deleting post. Please try again.');
    }
  };

  const handleFollow = async (userId) => {
    if (!user) return;
    
    setFollowLoading(prev => ({ ...prev, [userId]: true }));
    
    try {
      const response = await axios.post(`/api/user/follow/${userId}`, {}, {
        withCredentials: true
      });
      
      if (response.data.success) {
        const isCurrentlyFollowing = user.following?.includes(userId);
        const newFollowingStatus = !isCurrentlyFollowing;
        
        // Call the callback to update the user state in Dashboard
        if (onFollowUpdate) {
          onFollowUpdate(userId, newFollowingStatus);
        }
      }
    } catch (error) {
      console.error('Error following user:', error);
    } finally {
      setFollowLoading(prev => ({ ...prev, [userId]: false }));
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      return `${diffInMinutes}m`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d`;
    }
  };

  if (loading) {
    return <div className="loading">Loading posts...</div>;
  }

  return (
    <div className="post-container">
      {/* Create Post Section */}
      <div className="create-post-section">
        <div className="create-post-card">
          <div className="post-input-container">
            <img 
              src={user?.profileImg || 'https://via.placeholder.com/40'} 
              alt="Profile" 
              className="user-avatar"
            />
            <div className="post-input-wrapper">
              <textarea
                placeholder="What's happening?"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="post-input"
                rows="3"
              />
              
              {imagePreview && (
                <div className="image-preview-container">
                  <img src={imagePreview} alt="Preview" className="image-preview" />
                  <button className="remove-image-btn" onClick={removeImage}>
                    <svg viewBox="0 0 24 24" className="remove-icon">
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                  </button>
                </div>
              )}
              
              <div className="post-actions">
                <div className="post-attachments">
                  <input
                    type="file"
                    id="post-image-upload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="file-input"
                  />
                  <label htmlFor="post-image-upload" className="attachment-btn">
                    <svg viewBox="0 0 24 24" className="attachment-icon">
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
                      <path d="M14 14h2v-4h-2v4zm-2-6h6v2h-6V8zm-2 4h2V8h-2v4z"/>
                    </svg>
                  </label>
                </div>
                <button 
                  className="post-submit-btn"
                  onClick={createPost}
                  disabled={isCreating || (!newPost.trim() && !postImage)}
                >
                  {isCreating ? 'Posting...' : 'Post'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Feed */}
      <div className="posts-feed">
        {posts.length === 0 ? (
          <div className="no-posts">
            <p>No posts yet. Be the first to post something!</p>
          </div>
        ) : (
          posts.map((post, index) => (
            <div key={post._id} className="post-card">
              <div className="post-header">
                <img 
                  src={post.user?.profileImg || 'https://via.placeholder.com/40'} 
                  alt="Profile" 
                  className="post-user-avatar"
                />
                <div className="post-user-info">
                  <div className="post-user-name">{post.user?.fullName}</div>
                  <div className="post-user-handle">@{post.user?.username}</div>
                  <div className="post-time">{formatDate(post.createdAt)}</div>
                </div>
                {post.user?._id !== user?._id && (
                  <button 
                    className={`follow-btn ${user?.following?.includes(post.user?._id) ? 'following' : ''}`}
                    onClick={() => handleFollow(post.user?._id, index)}
                    disabled={followLoading[post.user?._id]}
                  >
                    {followLoading[post.user?._id] ? (
                      '...'
                    ) : user?.following?.includes(post.user?._id) ? (
                      'Following'
                    ) : (
                      'Follow'
                    )}
                  </button>
                )}
                {post.user?._id === user?._id && (
                  <button 
                    className="delete-post-btn"
                    onClick={() => handleDelete(post._id)}
                  >
                    <svg viewBox="0 0 24 24" className="delete-icon">
                      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                    </svg>
                  </button>
                )}
              </div>
              
              <div className="post-content">
                {post.isReshare && (
                  <div className="reshare-indicator">
                    <svg viewBox="0 0 24 24" className="reshare-icon">
                      <path d="M23.77 15.67c-.292-.293-.767-.293-1.06 0l-2.54 2.54V15c0-3.31-2.69-6-6-6s-6 2.69-6 6v3.21l-2.54-2.54c-.292-.293-.767-.293-1.06 0s-.292.767 0 1.06l3.77 3.77c.292.293.767.293 1.06 0l3.77-3.77c.292-.293.292-.767 0-1.06z"/>
                    </svg>
                    <span>Reposted</span>
                  </div>
                )}
                {post.text && <p className="post-text">{post.text}</p>}
                {post.img && (
                  <div className="post-image-container">
                    <img src={post.img} alt="Post" className="post-image" />
                    </div>
                  )}
                </div>
              
              <div className="post-actions-bar">
                <button 
                  className={`action-btn like-btn ${post.likes.includes(user?._id) ? 'liked' : ''}`}
                  onClick={() => handleLike(post._id)}
                >
                  <svg viewBox="0 0 24 24" className="action-icon">
                    <path d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12z"/>
                  </svg>
                  <span>{post.likes.length}</span>
                </button>
                
                <button 
                  className="action-btn reshare-btn"
                  onClick={() => handleReshare(post._id)}
                >
                  <svg viewBox="0 0 24 24" className="action-icon">
                    <path d="M23.77 15.67c-.292-.293-.767-.293-1.06 0l-2.54 2.54V15c0-3.31-2.69-6-6-6s-6 2.69-6 6v3.21l-2.54-2.54c-.292-.293-.767-.293-1.06 0s-.292.767 0 1.06l3.77 3.77c.292.293.767.293 1.06 0l3.77-3.77c.292-.293.292-.767 0-1.06z"/>
                  </svg>
                  <span>Reshare</span>
                </button>
              </div>

              {/* Comments Section */}
              <div className="comments-section">
                {post.comments && post.comments.length > 0 && (
                  <div className="comments-list">
                    {post.comments.map((comment) => (
                      <div key={comment._id} className="comment-item">
                        <img
                          src={comment.user?.profileImg || 'https://via.placeholder.com/32'}
                          alt="Profile"
                          className="comment-avatar"
                        />
                        <div className="comment-body">
                          <div className="comment-header">
                            <span className="comment-author">{comment.user?.fullName || 'User'}</span>
                            <span className="comment-username">@{comment.user?.username || 'username'}</span>
                          </div>
                          {editingComment.id === comment._id ? (
                            <div className="comment-edit-row">
                              <input
                                value={editingComment.text}
                                onChange={(e) => setEditingComment(prev => ({ ...prev, text: e.target.value }))}
                              />
                              <div className="comment-edit-actions">
                                <button onClick={saveEditComment}>Save</button>
                                <button onClick={cancelEditComment} className="secondary">Cancel</button>
                              </div>
                            </div>
                          ) : (
                            <p className="comment-text">{comment.text}</p>
                          )}
                        </div>
                        {(comment.user?._id === user?._id) && editingComment.id !== comment._id && (
                          <div className="comment-actions">
                            <button onClick={() => startEditComment(post._id, comment)}>Edit</button>
                            <button onClick={() => deleteComment(post._id, comment._id)} className="danger">Delete</button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Add comment */}
                <div className="comment-input-row">
                  <input
                    type="text"
                    placeholder="Write a comment"
                    value={commentInputs[post._id] || ''}
                    onChange={(e) => handleCommentInputChange(post._id, e.target.value)}
                  />
                  <button onClick={() => submitComment(post._id)} disabled={!commentInputs[post._id]?.trim()}>Comment</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Post; 