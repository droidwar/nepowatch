import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            🏴‍☠️ Nepal&apos;s Digital Resistance Hub
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-muted-foreground mb-4">
            Tracking Nepal&apos;s social media ban and Gen Z protests. 13.5 million users affected. 
            Join the movement for digital freedom.
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="destructive">26 Platforms Banned</Badge>
            <Badge variant="outline">80% Traffic Blocked</Badge>
            <Badge variant="secondary">Gen Z Rising</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Latest Updates */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">📢 Latest Updates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-l-4 border-orange-500 pl-4 py-2">
              <p className="font-semibold">At least 19 killed </p>
              <p className="text-sm text-muted-foreground">Police fire on protesters in Kathmandu and Itahari. Parliament stormed, ambulance set ablaze. 
                Home Minister Ramesh Lekhak resigns amid outrage.</p>
            </div>
            <div className="border-l-4 border-red-500 pl-4 py-2">
              <p className="font-semibold">Cabinet Meeting</p>
              <p className="text-sm text-muted-foreground">Prime Minister K.P. Sharma Oli convened a Cabinet meeting. During the session, Home Minister Ramesh Lekhak resigned on moral grounds, taking responsibility for the violent crackdown on the protests</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">🎯 Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <a 
              href="/videos" 
              className="block p-3 rounded-lg border hover:bg-accent transition-colors"
            >
              📱 <span className="font-semibold">View TikTok Videos</span>
              <p className="text-sm text-muted-foreground">Curated protest and resistance content</p>
            </a>
            <a 
              href="/submit" 
              className="block p-3 rounded-lg border hover:bg-accent transition-colors"
            >
              ➕ <span className="font-semibold">Submit Video</span>
              <p className="text-sm text-muted-foreground">Share relevant TikTok content for approval</p>
            </a>
            <a 
              href="/nepo-kids" 
              className="block p-3 rounded-lg border hover:bg-accent transition-colors"
            >
              🏛️ <span className="font-semibold">Nepo Kids Database</span>
              <p className="text-sm text-muted-foreground">Documented political corruption cases</p>
            </a>
          </CardContent>
        </Card>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">19 </div>
            <p className="text-sm text-muted-foreground">Deaths</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">400+</div>
            <p className="text-sm text-muted-foreground">Injured</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-orange-600">Home Minister Ramesh Lekhak</div>
            <p className="text-sm text-muted-foreground">Resigned</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}