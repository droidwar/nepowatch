import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function NepoKidsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">🏛️ Nepo Kids Database</h1>
          <p className="text-muted-foreground">
            Documented cases of political corruption and privilege in Nepal
          </p>
        </div>
      </div>

      {/* Coming Soon Card */}
      <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🚧</div>
            <h3 className="text-lg font-semibold mb-2">Database Under Construction</h3>
            <p className="text-muted-foreground mb-4">
              We&apos;re carefully documenting and verifying cases of political nepotism and corruption. 
              This section will feature detailed profiles of politicians&apos; children and their 
              taxpayer-funded lifestyles.
            </p>
            <div className="flex flex-wrap gap-2 justify-center mb-4">
              <Badge variant="destructive">Luxury Lifestyles</Badge>
              <Badge variant="outline">Taxpayer Funded</Badge>
              <Badge variant="secondary">Evidence-Based</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Information Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">📊 What We&apos;re Documenting</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-2">
              <Badge variant="destructive" className="mt-0.5">💰</Badge>
              <div>
                <p className="font-semibold text-sm">Lavish Spending</p>
                <p className="text-xs text-muted-foreground">
                  Expensive purchases funded by public resources
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="destructive" className="mt-0.5">🏠</Badge>
              <div>
                <p className="font-semibold text-sm">Property Holdings</p>
                <p className="text-xs text-muted-foreground">
                  Real estate acquisitions beyond legitimate means
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="destructive" className="mt-0.5">✈️</Badge>
              <div>
                <p className="font-semibold text-sm">Luxury Travel</p>
                <p className="text-xs text-muted-foreground">
                  International trips and expensive vacations
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="destructive" className="mt-0.5">🎓</Badge>
              <div>
                <p className="font-semibold text-sm">Educational Privileges</p>
                <p className="text-xs text-muted-foreground">
                  Expensive foreign education funded questionably
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">⚖️ Our Standards</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-2">
              <Badge variant="secondary" className="mt-0.5">✅</Badge>
              <div>
                <p className="font-semibold text-sm">Evidence-Based</p>
                <p className="text-xs text-muted-foreground">
                  All claims backed by verifiable sources
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="secondary" className="mt-0.5">✅</Badge>
              <div>
                <p className="font-semibold text-sm">Public Interest</p>
                <p className="text-xs text-muted-foreground">
                  Focus on corruption affecting taxpayers
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="secondary" className="mt-0.5">✅</Badge>
              <div>
                <p className="font-semibold text-sm">Factual Accuracy</p>
                <p className="text-xs text-muted-foreground">
                  Multiple source verification required
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="secondary" className="mt-0.5">✅</Badge>
              <div>
                <p className="font-semibold text-sm">Regular Updates</p>
                <p className="text-xs text-muted-foreground">
                  Continuous monitoring and documentation
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Impact Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">📈 Why This Matters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">19%</div>
              <p className="text-xs text-muted-foreground">Youth Unemployment</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">5M+</div>
              <p className="text-xs text-muted-foreground">Working Abroad</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">33%</div>
              <p className="text-xs text-muted-foreground">GDP from Remittances</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">25%</div>
              <p className="text-xs text-muted-foreground">Population Under 28</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            While young Nepalis struggle with unemployment and are forced to work abroad, 
            politicians&apos; children enjoy taxpayer-funded luxury lifestyles. This database 
            exposes the stark inequality in Nepal&apos;s political system.
          </p>
        </CardContent>
      </Card>

      {/* CTA Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Help Us Build This Database</h3>
            <p className="text-muted-foreground mb-4">
              Have evidence of political nepotism or corruption? Help us document it responsibly.
            </p>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" asChild>
                <a href="mailto:nepowatch@proton.me">Submit Evidence</a>
              </Button>
              <Button asChild>
                <a href="/videos">View Related Videos</a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}