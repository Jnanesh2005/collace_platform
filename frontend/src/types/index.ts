export interface User {
  id: number;
  username: string;
  email: string;
  college: string;
  first_name: string;
  last_name: string;
  bio: string;
  avatar: string | null;
  cover_image: string | null;
  is_verified: boolean;
  created_at: string;
}

export interface Post {
  id: number;
  author: User;
  content: string;
  post_type: 'text' | 'image' | 'video' | 'poll';
  media_file: string | null;
  likes_count: number;
  comments_count: number;
  is_liked: boolean;
  comments: Comment[];
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: number;
  user: User;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface Community {
  id: number;
  name: string;
  description: string;
  college: string;
  is_official: boolean;
  cover_image: string | null;
  avatar: string | null;
  created_by: User;
  members_count: number;
  is_member: boolean;
  user_role: string | null;
  created_at: string;
  updated_at: string;
}

export interface Blip {
  id: number;
  user: User;
  video: string;
  thumbnail: string | null;
  caption: string;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  duration: number;
  is_liked: boolean;
  comments: BlipComment[];
  video_url: string;
  thumbnail_url: string | null;
  created_at: string;
}

export interface BlipComment {
  id: number;
  user: User;
  content: string;
  created_at: string;
}

export interface Friendship {
  id: number;
  from_user: User;
  to_user: User;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
}

export interface AuthResponse {
  user: User;
  access: string;
  refresh: string;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}