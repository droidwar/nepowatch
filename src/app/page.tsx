import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            🏴‍☠️ Nepal's Digital Resistance Hub
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-muted-foreground mb-4">
            Tracking Nepal's social media ban and Gen Z protests. 13.5 million users affected. 
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
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <p className="font-semibold">September 8 Protests Ongoing</p>
              <p className="text-sm text-muted-foreground">Gen Z protesters gather with One Piece flags across Nepal</p>
            </div>
            <div className="border-l-4 border-orange-500 pl-4 py-2">
              <p className="font-semibold">VPN Usage Up 400%</p>
              <p className="text-sm text-muted-foreground">Youth circumventing social media restrictions</p>
            </div>
            <div className="border-l-4 border-red-500 pl-4 py-2">
              <p className="font-semibold">$37M Economic Impact</p>
              <p className="text-sm text-muted-foreground">Immediate losses to telecom sector</p>
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">13.5M</div>
            <p className="text-sm text-muted-foreground">Users Affected</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">26</div>
            <p className="text-sm text-muted-foreground">Platforms Banned</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-orange-600">80%</div>
            <p className="text-sm text-muted-foreground">Traffic Blocked</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-purple-600">19%</div>
            <p className="text-sm text-muted-foreground">Youth Unemployment</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}