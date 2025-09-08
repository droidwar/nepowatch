'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, ArrowLeft, Reply, Send } from "lucide-react";
import VoteButtons from "@/components/VoteButtons";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp, updateDoc, increment } from "firebase/firestore";
import { Post, PostComment } from "@/types";
import { getUserIdentity } from "@/lib/deviceId";
import { event } from "@/lib/gtag";

interface CommentTreeProps {
  comments: PostComment[];
  postId: string;
  onReply: (parentId: string) => void;
  replyingTo: string | null;
}

interface CommentWithChildren extends PostComment {
  children?: CommentWithChildren[];
}

function CommentTree({ comments, onReply }: CommentTreeProps) {
  // Group comments by depth and organize them
  const organizeComments = (comments: PostComment[]) => {
    const commentMap = new Map<string, CommentWithChildren>();
    const rootComments: CommentWithChildren[] = [];
    
    // First pass: create comment map
    comments.forEach(comment => {
      commentMap.set(comment.id, { ...comment, children: [] });
    });
    
    // Second pass: organize hierarchy
    comments.forEach(comment => {
      if (!comment.parentId) {
        rootComments.push(commentMap.get(comment.id)!);
      } else {
        const parent = commentMap.get(comment.parentId);
        if (parent) {
          if (!parent.children) parent.children = [];
          parent.children.push(commentMap.get(comment.id)!);
        }
      }
    });
    
    return rootComments;
  };

  const timeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const renderComment = (comment: CommentWithChildren, depth = 0) => {
    const maxDepth = 3;
    const canReply = depth < maxDepth;

    return (
      <div key={comment.id} className={`${depth > 0 ? 'ml-8 mt-4' : 'mt-4'}`}>
        <Card className={`${depth > 0 ? 'border-l-2 border-l-blue-200' : ''}`}>
          <CardContent className="pt-4">
            <div className="flex gap-3">
              {/* Vote buttons */}
              <VoteButtons 
                targetId={comment.id}
                targetType="comment"
                upvotes={comment.upvotes}
                downvotes={comment.downvotes}
                size="sm"
              />

              {/* Comment content */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {comment.authorName.split(' ').map(w => w[0]).join('')}
                  </div>
                  <span className="text-sm font-medium">{comment.authorName}</span>
                  <span className="text-xs text-muted-foreground">
                    {timeAgo(comment.createdAt)}
                  </span>
                </div>
                <p className="text-sm mb-3 whitespace-pre-wrap">{comment.content}</p>
                
                {canReply && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onReply(comment.id)}
                    className="h-7 px-2 text-xs"
                  >
                    <Reply className="w-3 h-3 mr-1" />
                    Reply
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Render child comments */}
        {comment.children && comment.children.length > 0 && (
          <div>
            {comment.children.map(child => renderComment(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const organizedComments = organizeComments(comments);
  
  return (
    <div>
      {organizedComments.map(comment => renderComment(comment))}
    </div>
  );
}

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;
  
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<PostComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [userIdentity] = useState(() => getUserIdentity());

  useEffect(() => {
    if (!postId) return;

    // Load post
    const loadPost = async () => {
      try {
        const postDoc = await getDoc(doc(db, 'posts', postId));
        if (postDoc.exists()) {
          setPost({
            id: postDoc.id,
            ...postDoc.data(),
            createdAt: postDoc.data().createdAt?.toDate() || new Date(),
          } as Post);
        } else {
          router.push('/community');
        }
      } catch (error) {
        console.error('Error loading post:', error);
        router.push('/community');
      }
    };

    // Real-time listener for comments
    const commentsQuery = query(
      collection(db, 'comments'),
      where('postId', '==', postId),
      where('status', '==', 'active'),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(commentsQuery, (querySnapshot) => {
      const commentsData: PostComment[] = [];
      querySnapshot.forEach((doc) => {
        commentsData.push({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        } as PostComment);
      });
      setComments(commentsData);
      setLoading(false);
    });

    loadPost();
    return () => unsubscribe();
  }, [postId, router]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim() || !post) return;

    setIsSubmitting(true);

    try {
      const commentData = {
        postId: post.id,
        parentId: replyingTo || null,
        content: newComment.trim(),
        authorId: userIdentity.id,
        authorName: userIdentity.name,
        upvotes: 0,
        downvotes: 0,
        depth: replyingTo ? 1 : 0, // Simplified depth calculation
        status: 'active',
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'comments'), commentData);
      
      // Update comment count on post
      await updateDoc(doc(db, 'posts', post.id), {
        commentCount: increment(1)
      });

      // Track comment creation
      event({
        action: 'comment_create',
        category: 'community',
        label: replyingTo ? 'reply' : 'comment'
      });

      setNewComment('');
      setReplyingTo(null);
    } catch (error) {
      console.error('Error creating comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'news': return 'bg-blue-100 text-blue-800';
      case 'corruption': return 'bg-red-100 text-red-800';
      case 'protest': return 'bg-orange-100 text-orange-800';
      case 'discussion': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryEmoji = (category: string) => {
    switch (category) {
      case 'news': return '📰';
      case 'corruption': return '🚨';
      case 'protest': return '✊';
      case 'discussion': return '💬';
      default: return '📄';
    }
  };

  const timeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  if (loading || !post) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg">Loading post...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/community">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Community
          </Link>
        </Button>
      </div>

      {/* Post */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            {/* Vote buttons */}
            <VoteButtons 
              targetId={post.id}
              targetType="post"
              upvotes={post.upvotes}
              downvotes={post.downvotes}
              size="lg"
              className="pt-1"
            />

            {/* Post content */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Badge className={getCategoryColor(post.category)}>
                  {getCategoryEmoji(post.category)} {post.category}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  by {post.authorName} • {timeAgo(post.createdAt)}
                </span>
              </div>

              <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
              <p className="text-base whitespace-pre-wrap leading-relaxed">{post.content}</p>

              <div className="flex items-center gap-4 mt-6 pt-4 border-t">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MessageSquare className="w-4 h-4" />
                  {post.commentCount} comments
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comment Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {replyingTo ? 'Reply to Comment' : 'Add Comment'}
          </CardTitle>
          {replyingTo && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Replying to a comment</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setReplyingTo(null)}
                className="h-6 px-2 text-xs"
              >
                Cancel
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {userIdentity.name.split(' ').map(w => w[0]).join('')}
            </div>
            <span className="text-sm font-medium">{userIdentity.name}</span>
          </div>
          
          <form onSubmit={handleSubmitComment} className="space-y-4">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts..."
              rows={4}
              maxLength={2000}
              className="w-full"
            />
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground">
                {newComment.length}/2000 characters
              </p>
              <Button 
                type="submit" 
                disabled={!newComment.trim() || isSubmitting}
                className="px-6"
              >
                <Send className="w-4 h-4 mr-2" />
                {isSubmitting ? "Posting..." : (replyingTo ? "Post Reply" : "Post Comment")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Comments */}
      {comments.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Comments ({comments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CommentTree 
              comments={comments} 
              postId={post.id}
              onReply={setReplyingTo}
              replyingTo={replyingTo}
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
              <h3 className="text-lg font-semibold mb-2">No comments yet</h3>
              <p className="text-muted-foreground">
                Be the first to share your thoughts on this post!
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}