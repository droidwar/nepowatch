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

export interface Post {
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
  targetId: string;
  targetType: 'video' | 'post' | 'comment';
  voteType: 'up' | 'down';
  ipHash: string;
  createdAt: Date;
}