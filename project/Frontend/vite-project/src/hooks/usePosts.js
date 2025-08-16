import { useState, useEffect } from 'react';
import axios from 'axios';

export const usePosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const addPost = (newPost) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  const addRepost = (newRepost) => {
    setPosts(prevPosts => [newRepost, ...prevPosts]);
  };

  const updatePost = (postId, updatedPost) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post._id === postId ? { ...post, ...updatedPost } : post
      )
    );
  };

  const removePost = (postId) => {
    setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
  };

  const updatePostLikes = (postId, userId, isLiked) => {
    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post._id === postId) {
          return {
            ...post,
            likes: isLiked 
              ? post.likes.filter(id => id !== userId)
              : [...post.likes, userId]
          };
        }
        return post;
      })
    );
  };

  const addComment = (postId, comment) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post._id === postId
          ? { ...post, comments: [...(post.comments || []), comment] }
          : post
      )
    );
  };

  const updateComment = (postId, commentId, updatedComment) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post._id === postId
          ? { 
              ...post, 
              comments: post.comments.map(c => 
                c._id === commentId ? { ...c, ...updatedComment } : c
              )
            }
          : post
      )
    );
  };

  const removeComment = (postId, commentId) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post._id === postId
          ? { ...post, comments: post.comments.filter(c => c._id !== commentId) }
          : post
      )
    );
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return {
    posts,
    loading,
    fetchPosts,
    addPost,
    addRepost,
    updatePost,
    removePost,
    updatePostLikes,
    addComment,
    updateComment,
    removeComment
  };
};
