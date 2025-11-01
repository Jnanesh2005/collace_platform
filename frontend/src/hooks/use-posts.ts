import { useState, useEffect } from 'react';
import { Post } from '../types';
import api from '../services/api';

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/posts/');
      setPosts(response.data);
    } catch (err) {
      setError('Failed to fetch posts');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (postData: FormData) => {
    try {
      const response = await api.post('/posts/create/', postData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setPosts(prev => [response.data, ...prev]);
      return response.data;
    } catch (err) {
      setError('Failed to create post');
      throw err;
    }
  };

  const likePost = async (postId: number) => {
    try {
      await api.post(`/posts/${postId}/like/`);
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              is_liked: !post.is_liked,
              likes_count: post.is_liked ? post.likes_count - 1 : post.likes_count + 1
            } 
          : post
      ));
    } catch (err) {
      setError('Failed to like post');
      throw err;
    }
  };

  const addComment = async (postId: number, content: string) => {
    try {
      const response = await api.post(`/posts/${postId}/comment/`, { content });
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              comments: [...post.comments, response.data],
              comments_count: post.comments_count + 1
            } 
          : post
      ));
      return response.data;
    } catch (err) {
      setError('Failed to add comment');
      throw err;
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return {
    posts,
    loading,
    error,
    fetchPosts,
    createPost,
    likePost,
    addComment,
  };
};