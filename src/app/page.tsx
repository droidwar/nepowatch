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
            Social media ban lifted after deadly Gen Z protests! PM Oli resigned. 
            30+ killed, 1,000+ wounded. The fight for systemic change continues.
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Ban Lifted ✅</Badge>
            <Badge variant="destructive">PM Resigned</Badge>
            <Badge variant="default">Army in Control</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Ongoing Demands */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">⚡ Gen Z Demands (Non-Negotiable)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2 text-red-600">Immediate Actions Required:</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  Parliament dissolution
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  Mass resignation of parliamentarians
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  Suspension of officials who ordered police firing
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  New elections immediately
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-orange-600">Movement Status:</h4>
              <div className="bg-orange-50 p-3 rounded-lg">
                <p className="text-sm text-orange-700">
                  <strong>&ldquo;Indefinite continuation until demands are met&rdquo;</strong> - Protest leaders
                </p>
                <p className="text-xs text-orange-600 mt-2">
                  Despite social media restoration and PM resignation, systemic change demands remain unmet.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Complete Timeline */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl">📅 Complete Timeline - September 2025</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-l-4 border-orange-500 pl-4 py-2">
            <p className="font-semibold">September 3: Registration Deadline</p>
            <p className="text-sm text-muted-foreground">Government sets final deadline for social media platforms to register with authorities under controversial new law.</p>
          </div>
          <div className="border-l-4 border-red-500 pl-4 py-2">
            <p className="font-semibold">September 4: Historic Ban Implemented</p>
            <p className="text-sm text-muted-foreground">Nepal blocks 26 major platforms including Facebook, YouTube, X, Instagram, WhatsApp. Only Hamro Patro and X respond to registration requirements.</p>
          </div>
          <div className="border-l-4 border-purple-500 pl-4 py-2">
            <p className="font-semibold">September 5-6: Gen Z Mobilization</p>
            <p className="text-sm text-muted-foreground">Massive protests begin led by ages 13-28. One Piece Jolly Roger flags appear as symbol of resistance. #NepoBaby corruption campaign fuels anger.</p>
          </div>
          <div className="border-l-4 border-red-600 pl-4 py-2">
            <p className="font-semibold">September 7-8: Violence Escalates</p>
            <p className="text-sm text-muted-foreground">Police fire on protesters in Kathmandu and Itahari. Parliament and Supreme Court buildings set ablaze. 30+ killed, 1,000+ wounded.</p>
          </div>
          <div className="border-l-4 border-green-500 pl-4 py-2">
            <p className="font-semibold">September 9: Government Collapses</p>
            <p className="text-sm text-muted-foreground">🎉 Social media ban lifted. PM Oli resigns. Army effectively takes control as civilian government fails.</p>
          </div>
        </CardContent>
      </Card>

      {/* Current Developments */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">🔥 Current Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-l-4 border-green-500 pl-4 py-2">
              <p className="font-semibold">✅ Ban Lifted</p>
              <p className="text-sm text-muted-foreground">All 26 platforms restored after just 5 days of resistance. Facebook, YouTube, X, Instagram back online.</p>
            </div>
            <div className="border-l-4 border-red-500 pl-4 py-2">
              <p className="font-semibold">🏛️ Government in Crisis</p>
              <p className="text-sm text-muted-foreground">PM Oli stepped down. President lacks credibility with Gen Z. Army coordination necessary for governance.</p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <p className="font-semibold">📱 Platform Registration Status</p>
              <p className="text-sm text-muted-foreground">Requirements remain but enforcement suspended. TikTok and Viber were already registered before ban.</p>
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

      {/* Protest Movement Details */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">🏴‍☠️ The One Piece Phenomenon</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-purple-50 p-3 rounded-lg">
              <p className="font-semibold text-purple-800">Straw Hat Pirates&rsquo; Symbol</p>
              <p className="text-sm text-purple-600">Protesters carry Luffy&rsquo;s Jolly Roger (skull with straw hat) as declaration of living freely and pursuing dreams regardless of government rules.</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="font-semibold text-blue-800">International Movement</p>
              <p className="text-sm text-blue-600">Similar One Piece flag usage seen in Indonesian protests weeks earlier. Anime symbolism transcends borders in youth resistance.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">💰 Nepo Kids Campaign</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-red-50 p-3 rounded-lg">
              <p className="font-semibold text-red-800">#NepoBaby Trending</p>
              <p className="text-sm text-red-600">TikTok videos exposed extravagant lifestyles of politicians&rsquo; children in country with $1,300 per capita income.</p>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg">
              <p className="font-semibold text-orange-800">Corruption Catalyst</p>
              <p className="text-sm text-orange-600">Social media posts documenting luxury while citizens struggle became key mobilization factor for Gen Z anger.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">30+</div>
            <p className="text-sm text-muted-foreground">Deaths</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-orange-600">1,000+</div>
            <p className="text-sm text-muted-foreground">Wounded</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">5 Days</div>
            <p className="text-sm text-muted-foreground">Ban Duration</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-purple-600">26</div>
            <p className="text-sm text-muted-foreground">Platforms Blocked</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}