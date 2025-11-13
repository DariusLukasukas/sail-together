export type User = {
    id: string;
    name: string;
    avatarUrl: string;
  };
  
  export type LocationTag = {
    name: string; 
    lat?: number;
    lng?: number;
  };
  
  export type Comment = {
    id: string;
    user: User;
    text: string;
    createdAt: string;
  };
  
  export type Post = {
    id: string;
    user: User;
    mediaUrl: string;
    mediaAlt?: string;
    location?: LocationTag;
    createdAt: string;
    likeCount: number;
    commentCount: number;
    hasLiked: boolean;
    commentsPreview?: Comment[]; 
  };
  