import React, { useState } from 'react';
import { usePosts } from '../hooks/use-posts';
import { useAuth } from '../hooks/use-auth';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Heart, MessageCircle, Share, MoreHorizontal } from 'lucide-react';

const Feed: React.FC = () => {
  const { posts, loading, error, createPost, likePost, addComment } = usePosts();
  const { user } = useAuth();
  const [newPostContent, setNewPostContent] = useState('');
  const [commentContent, setCommentContent] = useState<{ [key: number]: string }>({});
  const [showComments, setShowComments] = useState<{ [key: number]: boolean }>({});

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    const formData = new FormData();
    formData.append('content', newPostContent);
    formData.append('post_type', 'text');

    try {
      await createPost(formData);
      setNewPostContent('');
    } catch (err) {
      console.error('Failed to create post:', err);
    }
  };

  const handleLike = async (postId: number) => {
    try {
      await likePost(postId);
    } catch (err) {
      console.error('Failed to like post:', err);
    }
  };

  const handleAddComment = async (postId: number) => {
    const content = commentContent[postId];
    if (!content?.trim()) return;

    try {
      await addComment(postId, content);
      setCommentContent(prev => ({ ...prev, [postId]: '' }));
    } catch (err) {
      console.error('Failed to add comment:', err);
    }
  };

  const toggleComments = (postId: number) => {
    setShowComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading posts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Create Post */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <form onSubmit={handleCreatePost} className="space-y-4">
            <Input
              placeholder="What's happening on campus?"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              className="w-full"
            />
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                {/* Add media buttons would go here */}
              </div>
              <Button type="submit" disabled={!newPostContent.trim()}>
                Post
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Posts Feed */}
      <div className="space-y-6">
        {posts.map((post) => (
          <Card key={post.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <img
                  src={post.author.avatar || '/default-avatar.png'}
                  alt={post.author.username}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h3 className="font-semibold">
                    {post.author.first_name} {post.author.last_name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    @{post.author.username} · {new Date(post.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pb-4">
              <p className="text-gray-800 dark:text-gray-200 mb-4 whitespace-pre-wrap">
                {post.content}
              </p>

              {/* Post Actions */}
              <div className="flex items-center justify-between text-gray-500">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center space-x-1 ${
                    post.is_liked ? 'text-red-500' : ''
                  }`}
                >
                  <Heart size={18} fill={post.is_liked ? 'currentColor' : 'none'} />
                  <span>{post.likes_count}</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleComments(post.id)}
                  className="flex items-center space-x-1"
                >
                  <MessageCircle size={18} />
                  <span>{post.comments_count}</span>
                </Button>

                <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                  <Share size={18} />
                  <span>Share</span>
                </Button>

                <Button variant="ghost" size="sm">
                  <MoreHorizontal size={18} />
                </Button>
              </div>

              {/* Comments Section */}
              {showComments[post.id] && (
                <div className="mt-4 space-y-3">
                  {/* Add Comment */}
                  <div className="flex space-x-2">
                    <img
                      src={user?.avatar || '/default-avatar.png'}
                      alt={user?.username}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1 flex space-x-2">
                      <Input
                        placeholder="Write a comment..."
                        value={commentContent[post.id] || ''}
                        onChange={(e) => setCommentContent(prev => ({
                          ...prev,
                          [post.id]: e.target.value
                        }))}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleAddComment(post.id);
                          }
                        }}
                      />
                      <Button 
                        onClick={() => handleAddComment(post.id)}
                        disabled={!commentContent[post.id]?.trim()}
                      >
                        Post
                      </Button>
                    </div>
                  </div>

                  {/* Comments List */}
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="flex space-x-3">
                      <img
                        src={comment.user.avatar || '/default-avatar.png'}
                        alt={comment.user.username}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-semibold text-sm">
                              {comment.user.first_name} {comment.user.last_name}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(comment.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {posts.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No posts yet. Be the first to post!
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;