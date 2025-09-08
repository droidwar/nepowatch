'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getUserIdentity } from '@/lib/deviceId';
import { event } from '@/lib/gtag';

export default function SubmitPostPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [userIdentity] = useState(() => getUserIdentity());

  const categories = [
    { value: 'discussion', label: '💬 Discussion', description: 'General conversations and opinions' },
    { value: 'news', label: '📰 News', description: 'Current events and breaking news' },
    { value: 'corruption', label: '🚨 Corruption', description: 'Reports of corruption and nepotism' },
    { value: 'protest', label: '✊ Protest', description: 'Updates about protests and activism' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim() || !formData.category) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.title.length < 5) {
      setError('Title must be at least 5 characters long');
      return;
    }

    if (formData.content.length < 20) {
      setError('Content must be at least 20 characters long');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const postData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        category: formData.category,
        authorId: userIdentity.id,
        authorName: userIdentity.name,
        upvotes: 0,
        downvotes: 0,
        commentCount: 0,
        status: 'active',
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'posts'), postData);

      // Track successful post creation
      event({
        action: 'post_create',
        category: 'community',
        label: `post_${formData.category}`
      });

      router.push(`/community/post/${docRef.id}`);
    } catch (err) {
      console.error('Error creating post:', err);
      setError('Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/community">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Community
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Create New Post</h1>
          <p className="text-muted-foreground">
            Share your thoughts with the NepoWatch community
          </p>
        </div>
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

      {/* Post Form */}
      <Card>
        <CardHeader>
          <CardTitle>New Community Post</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Category *
              </label>
              <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      <div className="flex flex-col">
                        <span>{cat.label}</span>
                        <span className="text-xs text-muted-foreground">{cat.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Title *
              </label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="What would you like to discuss?"
                maxLength={200}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {formData.title.length}/200 characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Content *
              </label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                placeholder="Share your thoughts, experiences, or questions about Nepal's digital resistance, politics, or current events..."
                rows={8}
                maxLength={5000}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {formData.content.length}/5000 characters
              </p>
            </div>

            <Button 
              type="submit" 
              disabled={!formData.title.trim() || !formData.content.trim() || !formData.category || isSubmitting}
              className="w-full"
            >
              {isSubmitting ? "Creating Post..." : "Create Post"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">📋 Posting Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-2">
            <Badge variant="secondary" className="mt-0.5">✅</Badge>
            <p className="text-sm">
              <strong>Be specific:</strong> Choose the right category and write a clear title
            </p>
          </div>
          <div className="flex items-start gap-2">
            <Badge variant="secondary" className="mt-0.5">✅</Badge>
            <p className="text-sm">
              <strong>Add context:</strong> Provide background information when discussing events
            </p>
          </div>
          <div className="flex items-start gap-2">
            <Badge variant="secondary" className="mt-0.5">✅</Badge>
            <p className="text-sm">
              <strong>Encourage discussion:</strong> Ask questions to engage the community
            </p>
          </div>
          <div className="flex items-start gap-2">
            <Badge variant="destructive" className="mt-0.5">❌</Badge>
            <p className="text-sm">
              <strong>No spam:</strong> Avoid duplicate posts or unrelated content
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}