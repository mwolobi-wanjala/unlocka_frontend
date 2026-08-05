// services/creatorsService.ts - Creators API service
import { CreatorVideo, VideoComment, CreatorProfile } from '../types/creators';

const API_URL = 'http://localhost:8000/api/v1/creators';

/**
 * Get video feed
 */
export const getVideoFeed = async (
  userId: number,
  category: string = 'all',
  page: number = 1
): Promise<CreatorVideo[]> => {
  try {
    const response = await fetch(
      `${API_URL}/feed?user_id=${userId}&category=${category}&page=${page}`
    );
    const data = await response.json();
    return data.videos || [];
  } catch {
    return [];
  }
};

/**
 * Get trending videos
 */
export const getTrendingVideos = async (userId: number): Promise<CreatorVideo[]> => {
  try {
    const response = await fetch(`${API_URL}/trending?user_id=${userId}`);
    const data = await response.json();
    return data.videos || [];
  } catch {
    return [];
  }
};

/**
 * Upload video
 */
export const uploadVideo = async (
  userId: number,
  videoUri: string,
  caption: string,
  category: string,
  hashtags: string[],
  musicTitle?: string,
  musicArtist?: string,
  thumbnailUri?: string
): Promise<{ success: boolean; video?: CreatorVideo }> => {
  try {
    const formData = new FormData();
    formData.append('user_id', userId.toString());
    formData.append('caption', caption);
    formData.append('category', category);
    formData.append('hashtags', JSON.stringify(hashtags));
    if (musicTitle) formData.append('music_title', musicTitle);
    if (musicArtist) formData.append('music_artist', musicArtist);

    // Append video file
    const videoFilename = videoUri.split('/').pop() || 'video.mp4';
    formData.append('video', {
      uri: videoUri,
      name: videoFilename,
      type: 'video/mp4',
    } as any);

    if (thumbnailUri) {
      formData.append('thumbnail', {
        uri: thumbnailUri,
        name: 'thumbnail.jpg',
        type: 'image/jpeg',
      } as any);
    }

    const response = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      body: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return await response.json();
  } catch {
    return { success: false };
  }
};

/**
 * Like/unlike video
 */
export const toggleLikeVideo = async (
  videoId: string,
  userId: number
): Promise<{ success: boolean; liked: boolean; likes: number }> => {
  try {
    const formData = new FormData();
    formData.append('video_id', videoId);
    formData.append('user_id', userId.toString());

    const response = await fetch(`${API_URL}/like`, {
      method: 'POST',
      body: formData,
    });
    return await response.json();
  } catch {
    return { success: false, liked: false, likes: 0 };
  }
};

/**
 * Save/unsave video
 */
export const toggleSaveVideo = async (
  videoId: string,
  userId: number
): Promise<{ success: boolean; saved: boolean }> => {
  try {
    const formData = new FormData();
    formData.append('video_id', videoId);
    formData.append('user_id', userId.toString());

    const response = await fetch(`${API_URL}/save`, {
      method: 'POST',
      body: formData,
    });
    return await response.json();
  } catch {
    return { success: false, saved: false };
  }
};

/**
 * Get video comments
 */
export const getVideoComments = async (
  videoId: string,
  page: number = 1
): Promise<VideoComment[]> => {
  try {
    const response = await fetch(`${API_URL}/comments/${videoId}?page=${page}`);
    const data = await response.json();
    return data.comments || [];
  } catch {
    return [];
  }
};

/**
 * Add comment
 */
export const addComment = async (
  videoId: string,
  userId: number,
  userName: string,
  text: string
): Promise<VideoComment | null> => {
  try {
    const formData = new FormData();
    formData.append('video_id', videoId);
    formData.append('user_id', userId.toString());
    formData.append('user_name', userName);
    formData.append('text', text);

    const response = await fetch(`${API_URL}/comment`, {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    return data.comment || null;
  } catch {
    return null;
  }
};

/**
 * Like comment
 */
export const likeComment = async (
  commentId: string,
  userId: number
): Promise<boolean> => {
  try {
    const formData = new FormData();
    formData.append('comment_id', commentId);
    formData.append('user_id', userId.toString());

    const response = await fetch(`${API_URL}/comment/like`, {
      method: 'POST',
      body: formData,
    });
    return response.ok;
  } catch {
    return false;
  }
};

/**
 * Reply to comment
 */
export const replyToComment = async (
  videoId: string,
  commentId: string,
  userId: number,
  userName: string,
  text: string
): Promise<VideoComment | null> => {
  try {
    const formData = new FormData();
    formData.append('video_id', videoId);
    formData.append('parent_id', commentId);
    formData.append('user_id', userId.toString());
    formData.append('user_name', userName);
    formData.append('text', text);

    const response = await fetch(`${API_URL}/comment/reply`, {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    return data.comment || null;
  } catch {
    return null;
  }
};

/**
 * Share video
 */
export const shareVideo = async (
  videoId: string,
  userId: number,
  platform: 'whatsapp' | 'instagram' | 'twitter' | 'copy'
): Promise<void> => {
  try {
    const formData = new FormData();
    formData.append('video_id', videoId);
    formData.append('user_id', userId.toString());
    formData.append('platform', platform);

    await fetch(`${API_URL}/share`, {
      method: 'POST',
      body: formData,
    });
  } catch {}
};

/**
 * Follow/unfollow creator
 */
export const toggleFollowCreator = async (
  creatorId: number,
  userId: number
): Promise<{ success: boolean; following: boolean }> => {
  try {
    const formData = new FormData();
    formData.append('creator_id', creatorId.toString());
    formData.append('user_id', userId.toString());

    const response = await fetch(`${API_URL}/follow`, {
      method: 'POST',
      body: formData,
    });
    return await response.json();
  } catch {
    return { success: false, following: false };
  }
};

/**
 * Get creator profile
 */
export const getCreatorProfile = async (
  creatorId: number,
  userId: number
): Promise<CreatorProfile | null> => {
  try {
    const response = await fetch(`${API_URL}/profile/${creatorId}?user_id=${userId}`);
    return await response.json();
  } catch {
    return null;
  }
};

/**
 * Get saved videos
 */
export const getSavedVideos = async (userId: number): Promise<CreatorVideo[]> => {
  try {
    const response = await fetch(`${API_URL}/saved?user_id=${userId}`);
    const data = await response.json();
    return data.videos || [];
  } catch {
    return [];
  }
};
