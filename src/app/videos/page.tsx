import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { VideoSubmission } from "@/types";

async function getApprovedVideos(): Promise<VideoSubmission[]> {
  const q = query(
    collection(db, "videoSubmissions"),
    where("status", "==", "approved"),
    orderBy("createdAt", "desc")
  );
  const querySnapshot = await getDocs(q);
  const videos: VideoSubmission[] = [];
  querySnapshot.forEach((doc) => {
    videos.push({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    } as VideoSubmission);
  });
  return videos;
}

function extractTikTokId(url: string): string {
  // Example: https://www.tiktok.com/@user/video/1234567890123456789
  const match = url.match(/\/video\/(\d+)/);
  return match ? match[1] : "";
}

export default async function VideosPage() {
  const videos = await getApprovedVideos();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">📱 Curated TikTok Videos</h1>
          <p className="text-muted-foreground">
            Community-approved content related to Nepal&apos;s digital resistance
          </p>
        </div>
        <Button asChild>
          <a href="/submit">Submit Video</a>
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {videos.length === 0 ? (
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
          ) : (
            <div className="space-y-4">
              {videos.map((video) => (
                <Card key={video.id} className="border-green-200">
                  <CardContent className="pt-4">
                    <div>
                      <h4 className="font-semibold">{video.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        By {video.submitterName} • {video.createdAt.toLocaleDateString()}
                      </p>
                      <p className="text-sm mt-2">{video.description}</p>
                      {/* TikTok embed */}
                      <div className="my-4">
                        <iframe
                          src={`https://www.tiktok.com/embed/${extractTikTokId(video.tiktokUrl)}`}
                          width="325"
                          height="575"
                          allow="encrypted-media"
                          allowFullScreen
                          frameBorder="0"
                          className="rounded-lg mx-auto"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
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
            relevant videos about Nepal&apos;s digital resistance movement.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}