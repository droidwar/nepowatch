export interface VideoSubmission {
  id: string;
  submitterName: string;
  tiktokUrl: string;
  title: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  ipHash: string;
  votes: number;
}

export interface BlogPost {
  id: string;
  authorName: string;
  title: string;
  content: string;
  category: 'news' | 'protest' | 'politics' | 'general';
  createdAt: Date;
  ipHash: string;
}

export interface Comment {
  id: string;
  postId?: string;
  videoId?: string;
  commenterName: string;
  content: string;
  createdAt: Date;
  ipHash: string;
}

export interface NepoEntry {
  id: string;
  childName: string;
  parentName: string;
  parentPosition: string;
  evidenceType: 'luxury-spending' | 'property' | 'education' | 'travel' | 'other';
  title: string;
  description: string;
  amount?: string;
  dateOccurred?: string;
  sources: string[];
  submitterName?: string;
  createdAt: Date;
  status: 'pending' | 'approved' | 'rejected';
}

export interface Vote {
  id: string;
  userId: string;
  targetId: string;
  targetType: 'video' | 'post' | 'comment';
  voteType: 'up' | 'down';
  createdAt: Date;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: Date;
  upvotes: number;
  downvotes: number;
  commentCount: number;
  category: 'discussion' | 'news' | 'corruption' | 'protest';
  status: 'active' | 'hidden';
}

export interface PostComment {
  id: string;
  postId: string;
  parentId?: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: Date;
  upvotes: number;
  downvotes: number;
  depth: number;
  status: 'active' | 'hidden';
}