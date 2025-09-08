import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { NepoEntry } from "@/types";

async function getApprovedEntries(): Promise<NepoEntry[]> {
  try {
    const q = query(
      collection(db, "nepoEntries"),
      where("status", "==", "approved"),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    const entries: NepoEntry[] = [];
    querySnapshot.forEach((doc) => {
      entries.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      } as NepoEntry);
    });
    return entries;
  } catch (error) {
    console.error("Error fetching entries:", error);
    return [];
  }
}

export default async function NepoKidsPage() {
  const entries = await getApprovedEntries();

  const evidenceTypeLabels = {
    'luxury-spending': { label: '💰 Luxury Spending', color: 'destructive' },
    'property': { label: '🏠 Property Holdings', color: 'destructive' },
    'education': { label: '🎓 Education', color: 'secondary' },
    'travel': { label: '✈️ Travel', color: 'outline' },
    'other': { label: '📋 Other', color: 'secondary' }
  } as const;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">🏛️ Nepo Kids Database</h1>
          <p className="text-muted-foreground">
            Documented cases of political corruption and privilege in Nepal
          </p>
        </div>
        <Button asChild>
          <a href="/nepo-kids/submit">Submit Evidence</a>
        </Button>
      </div>

      {/* Database Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">{entries.length}</div>
            <p className="text-sm text-muted-foreground">Documented Cases</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-orange-600">
              {entries.filter(e => e.evidenceType === 'luxury-spending').length}
            </div>
            <p className="text-sm text-muted-foreground">Luxury Spending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">
              {entries.filter(e => e.evidenceType === 'education').length}
            </div>
            <p className="text-sm text-muted-foreground">Education Cases</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-purple-600">
              {entries.filter(e => e.evidenceType === 'property').length}
            </div>
            <p className="text-sm text-muted-foreground">Property Cases</p>
          </CardContent>
        </Card>
      </div>

      {/* Database Entries */}
      {entries.length === 0 ? (
        <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-lg font-semibold mb-2">No Cases Documented Yet</h3>
              <p className="text-muted-foreground mb-4">
                Be the first to submit evidence of political nepotism and corruption. 
                Help build Nepal&apos;s first public database of political privilege.
              </p>
              <Button asChild>
                <a href="/nepo-kids/submit">Submit First Case</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📋 Documented Cases ({entries.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                {entries.map((entry) => (
                  <Card key={entry.id} className="border-red-200">
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-red-800">{entry.childName}</h3>
                          <p className="text-sm text-muted-foreground">
                            Child of {entry.parentName}
                            {entry.parentPosition && ` (${entry.parentPosition})`}
                          </p>
                        </div>
                        <Badge variant={evidenceTypeLabels[entry.evidenceType]?.color || 'secondary'}>
                          {evidenceTypeLabels[entry.evidenceType]?.label || entry.evidenceType}
                        </Badge>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">{entry.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{entry.description}</p>
                        
                        {entry.amount && (
                          <p className="text-sm">
                            <strong>Amount:</strong> {entry.amount}
                          </p>
                        )}
                        
                        {entry.dateOccurred && (
                          <p className="text-sm">
                            <strong>Date:</strong> {entry.dateOccurred}
                          </p>
                        )}
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-sm font-medium mb-2">Sources:</p>
                        <div className="space-y-1">
                          {entry.sources.map((source, index) => (
                            <a
                              key={index}
                              href={source}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block text-xs text-blue-600 hover:underline break-all"
                            >
                              {source}
                            </a>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>Submitted by {entry.submitterName}</span>
                        <span>{entry.createdAt.toLocaleDateString()}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Information Cards */}
      <div className="grid md:grid-cols-2 gap-6">
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
                <p className="font-semibold text-sm">Multiple Sources Required</p>
                <p className="text-xs text-muted-foreground">
                  All entries verified before approval
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">📈 Why This Matters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
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
            <p className="text-xs text-muted-foreground">
              While young Nepalis struggle with unemployment, politicians&apos; children 
              enjoy taxpayer-funded privilege. This database exposes the inequality.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}