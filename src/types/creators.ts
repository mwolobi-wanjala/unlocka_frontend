// types/creators.ts - Creators/Reels types

export interface CreatorVideo {
  id: string;
  creatorId: number;
  creatorName: string;
  creatorAvatar?: string;
  videoUrl: string;
  thumbnailUrl: string;
  caption: string;
  hashtags: string[];
  duration: number;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isSaved: boolean;
  isFollowing: boolean;
  category: string;
  musicTitle?: string;
  musicArtist?: string;
  createdAt: string;
}

export interface VideoComment {
  id: string;
  videoId: string;
  userId: number;
  userName: string;
  userAvatar?: string;
  text: string;
  likes: number;
  isLiked: boolean;
  replies: VideoComment[];
  createdAt: string;
}

export interface CreatorProfile {
  userId: number;
  userName: string;
  fullName: string;
  avatar?: string;
  bio: string;
  totalVideos: number;
  totalFollowers: number;
  totalFollowing: number;
  totalLikes: number;
  isFollowing: boolean;
  videos: CreatorVideo[];
}

export interface CreatorsState {
  videos: CreatorVideo[];
  activeVideoIndex: number;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  currentCategory: string;
}

export const VIDEO_CATEGORIES = [
  { id: 'all', name: 'All', icon: '🔥' },
  { id: 'music', name: 'Music', icon: '🎵' },
  { id: 'comedy', name: 'Comedy', icon: '😂' },
  { id: 'dance', name: 'Dance', icon: '💃' },
  { id: 'education', name: 'Education', icon: '📚' },
  { id: 'sports', name: 'Sports', icon: '⚽' },
  { id: 'food', name: 'Food', icon: '🍔' },
  { id: 'fashion', name: 'Fashion', icon: '👗' },
  { id: 'tech', name: 'Tech', icon: '💻' },
  { id: 'travel', name: 'Travel', icon: '✈️' },
];
