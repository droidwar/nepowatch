"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function SubmitPage() {
  const [formData, setFormData] = useState({
    submitterName: "",
    tiktokUrl: "",
    title: "",
    description: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.tiktokUrl || !formData.title) return;

    // Simulate submission for now
    setTimeout(() => {
      setSubmitted(true);
      setFormData({
        submitterName: "",
        tiktokUrl: "",
        title: "",
        description: "",
      });
    }, 1000);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-4xl mb-4">✅</div>
              <h2 className="text-xl font-bold text-green-800 mb-2">
                Video Submitted Successfully!
              </h2>
              <p className="text-green-700 mb-4">
                Your TikTok video has been submitted for review. It will appear in the feed once approved by moderators.
              </p>
              <Button 
                onClick={() => setSubmitted(false)}
                className="mr-2"
              >
                Submit Another
              </Button>
              <Button variant="outline" asChild>
                <a href="/videos">View Videos</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📱 Submit TikTok Video
          </CardTitle>
          <p className="text-muted-foreground">
            Share relevant TikTok content related to Nepal&apos;s social media ban and protests. 
            All submissions are reviewed before appearing in the feed.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Your Name (Optional)
              </label>
              <Input
                value={formData.submitterName}
                onChange={(e) => setFormData({...formData, submitterName: e.target.value})}
                placeholder="Anonymous"
                className="w-full"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Leave blank to submit anonymously
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                TikTok URL *
              </label>
              <Input
                value={formData.tiktokUrl}
                onChange={(e) => setFormData({...formData, tiktokUrl: e.target.value})}
                placeholder="https://www.tiktok.com/@username/video/1234567890"
                required
                className="w-full"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Paste the full TikTok video URL
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Title *
              </label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Brief title describing the video content"
                required
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Why is this video relevant to Nepal&apos;s digital resistance movement?"
                rows={3}
                className="w-full"
              />
            </div>

            <Button 
              type="submit" 
              disabled={!formData.tiktokUrl || !formData.title}
              className="w-full"
            >
              Submit Video
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">📋 Submission Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-2">
            <Badge variant="secondary" className="mt-0.5">✅</Badge>
            <p className="text-sm">
              <strong>Relevant Content:</strong> Videos about Nepal&apos;s social media ban, protests, digital rights, or political corruption
            </p>
          </div>
          <div className="flex items-start gap-2">
            <Badge variant="secondary" className="mt-0.5">✅</Badge>
            <p className="text-sm">
              <strong>Respectful:</strong> No hate speech, violence, or harassment
            </p>
          </div>
          <div className="flex items-start gap-2">
            <Badge variant="secondary" className="mt-0.5">✅</Badge>
            <p className="text-sm">
              <strong>Factual:</strong> Accurate information with context when possible
            </p>
          </div>
          <div className="flex items-start gap-2">
            <Badge variant="destructive" className="mt-0.5">❌</Badge>
            <p className="text-sm">
              <strong>No Spam:</strong> Avoid duplicate or unrelated content
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}