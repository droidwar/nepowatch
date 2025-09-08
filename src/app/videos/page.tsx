import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function VideosPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">📱 Curated TikTok Videos</h1>
          <p className="text-muted-foreground">
            Community-approved content related to Nepal's digital resistance
          </p>
        </div>
        <Button asChild>
          <a href="/submit">Submit Video</a>
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-lg font-semibold mb-2">No videos yet</h3>
            <p className="text-muted-foreground mb-4">
              Be the first to submit a TikTok video for the community!
            </p>
            <Button asChild>
              <a href="/submit">Submit First Video</a>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">🤝 Community Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            All videos are community-submitted and reviewed before appearing here. 
            Help us maintain quality by reporting inappropriate content and submitting 
            relevant videos about Nepal's digital resistance movement.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}