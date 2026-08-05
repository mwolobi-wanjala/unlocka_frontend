// types/status.ts - Status/Stories Types

export type StatusType = 'image' | 'video' | 'text';
export type StatusPrivacy = 'all' | 'contacts' | 'except' | 'only';

export interface StatusView {
  userId: number;
  userName: string;
  userAvatar?: string;
  viewedAt: string;
}

export interface StatusReaction {
  userId: number;
  userName: string;
  emoji: string;
  timestamp: string;
}

export interface Status {
  id: string;
  userId: number;
  userName: string;
  userAvatar?: string;
  type: StatusType;
  content: string;
  thumbnail?: string;
  caption?: string;
  backgroundColor?: string;
  textColor?: string;
  fontStyle?: string;
  duration: number;
  privacy: StatusPrivacy;
  views: StatusView[];
  reactions: StatusReaction[];
  viewCount: number;
  isViewed: boolean;
  expiresAt: string;
  createdAt: string;
}

export interface UserStatus {
  userId: number;
  userName: string;
  userAvatar?: string;
  isOnline: boolean;
  statuses: Status[];
  hasUnviewed: boolean;
  latestTimestamp: string;
}

export interface StatusState {
  myStatuses: Status[];
  friendsStatuses: UserStatus[];
  viewedStatuses: string[];
  mutedStatuses: string[];
  loading: boolean;
  error: string | null;
}
