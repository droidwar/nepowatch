'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Plus } from "lucide-react";
import VoteButtons from "@/components/VoteButtons";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, where } from "firebase/firestore";
import { Post } from "@/types";
import { getUserIdentity } from "@/lib/deviceId";

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [userIdentity] = useState(() => getUserIdentity());

  useEffect(() => {
    // Real-time listener for posts
    const postsQuery = query(
      collection(db, "posts"),
      where("status", "==", "active"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(postsQuery, (querySnapshot) => {
      const postsData: Post[] = [];
      querySnapshot.forEach((doc) => {
        postsData.push({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        } as Post);
      });
      setPosts(postsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg">Loading community posts...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">💬 Community Discussion</h1>
          <p className="text-muted-foreground">
            Anonymous discussions about Nepal&apos;s digital resistance
          </p>
        </div>
        <Button asChild>
          <Link href="/community/submit">
            <Plus className="w-4 h-4 mr-2" />
            New Post
          </Link>
        </Button>
      </div>

      {/* User Identity */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="pt-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {userIdentity.name.split(' ').map(w => w[0]).join('')}
            </div>
            <div>
              <p className="text-sm font-medium">Posting as: {userIdentity.name}</p>
              <p className="text-xs text-muted-foreground">
                Your anonymous identity is tied to this device
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Posts */}
      {posts.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-lg font-semibold mb-2">No discussions yet</h3>
              <p className="text-muted-foreground mb-4">
                Be the first to start a conversation in the community!
              </p>
              <Button asChild>
                <Link href="/community/submit">Create First Post</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-4">
                <div className="flex gap-4">
                  {/* Vote buttons */}
                  <VoteButtons 
                    targetId={post.id}
                    targetType="post"
                    upvotes={post.upvotes}
                    downvotes={post.downvotes}
                    size="sm"
                    className="pt-1"
                  />

                  {/* Post content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getCategoryColor(post.category)}>
                        {getCategoryEmoji(post.category)} {post.category}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        by {post.authorName} • {timeAgo(post.createdAt)}
                      </span>
                    </div>

                    <Link href={`/community/post/${post.id}`} className="block hover:text-blue-600 transition-colors">
                      <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                      <p className="text-muted-foreground line-clamp-3">{post.content}</p>
                    </Link>

                    <div className="flex items-center gap-4 mt-3 pt-2 border-t">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/community/post/${post.id}`}>
                          <MessageSquare className="w-4 h-4 mr-1" />
                          {post.commentCount} comments
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Community Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">📋 Community Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-start gap-2">
            <Badge variant="secondary" className="mt-0.5">✅</Badge>
            <p className="text-sm">Stay on topic about Nepal&apos;s digital resistance and politics</p>
          </div>
          <div className="flex items-start gap-2">
            <Badge variant="secondary" className="mt-0.5">✅</Badge>
            <p className="text-sm">Respect others and keep discussions civil</p>
          </div>
          <div className="flex items-start gap-2">
            <Badge variant="secondary" className="mt-0.5">✅</Badge>
            <p className="text-sm">Share reliable sources when discussing news or events</p>
          </div>
          <div className="flex items-start gap-2">
            <Badge variant="destructive" className="mt-0.5">❌</Badge>
            <p className="text-sm">No harassment, hate speech, or personal attacks</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}