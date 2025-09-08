"use client";

import { useState } from "react";
import { event } from "@/lib/gtag";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function SubmitNepoEntryPage() {
  const [formData, setFormData] = useState({
    childName: "",
    parentName: "",
    parentPosition: "",
    evidenceType: "",
    title: "",
    description: "",
    amount: "",
    dateOccurred: "",
    sources: [""],
    submitterName: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [existingEntries, setExistingEntries] = useState([]);

  const evidenceTypes = [
    { value: "luxury-spending", label: "💰 Luxury Spending" },
    { value: "property", label: "🏠 Property Holdings" },
    { value: "education", label: "🎓 Expensive Education" },
    { value: "travel", label: "✈️ Luxury Travel" },
    { value: "other", label: "📋 Other Evidence" },
  ];

  const handleSourceChange = (index: number, value: string) => {
    const newSources = [...formData.sources];
    newSources[index] = value;
    setFormData({ ...formData, sources: newSources });
  };

  const addSource = () => {
    setFormData({ ...formData, sources: [...formData.sources, ""] });
  };

  const removeSource = (index: number) => {
    const newSources = formData.sources.filter((_, i) => i !== index);
    setFormData({ ...formData, sources: newSources });
  };

  const searchExistingEntries = async () => {
    if (!formData.childName.trim()) return;

    try {
      const response = await fetch(`/api/nepo-kids/search?name=${encodeURIComponent(formData.childName)}`);
      const data = await response.json();
      setExistingEntries(data.entries || []);
    } catch (error) {
      console.error("Error searching entries:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.childName || !formData.parentName || !formData.title || !formData.evidenceType) {
      setError("Please fill in all required fields");
      return;
    }

    // Filter out empty sources
    const validSources = formData.sources.filter(source => source.trim() !== "");
    if (validSources.length === 0) {
      setError("Please provide at least one source/evidence link");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch('/api/nepo-kids/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          sources: validSources,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit entry');
      }

      // Track successful nepo entry submission
      event({
        action: 'nepo_submit',
        category: 'engagement',
        label: `nepo_submission_${formData.evidenceType}`
      });

      setSubmitted(true);
      setFormData({
        childName: "",
        parentName: "",
        parentPosition: "",
        evidenceType: "",
        title: "",
        description: "",
        amount: "",
        dateOccurred: "",
        sources: [""],
        submitterName: "",
      });
      setExistingEntries([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit entry');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-4xl mb-4">✅</div>
              <h2 className="text-xl font-bold text-green-800 mb-2">
                Evidence Submitted Successfully!
              </h2>
              <p className="text-green-700 mb-4">
                Your submission has been received and will be reviewed by moderators before appearing in the database.
              </p>
              <Button 
                onClick={() => {
                  setSubmitted(false);
                  setError("");
                }}
                className="mr-2"
              >
                Submit Another
              </Button>
              <Button variant="outline" asChild>
                <a href="/nepo-kids">View Database</a>
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
            🏛️ Submit Nepo Kids Evidence
          </CardTitle>
          <p className="text-muted-foreground">
            Help document cases of political nepotism and corruption in Nepal. 
            All submissions are fact-checked before appearing in the database.
          </p>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {existingEntries.length > 0 && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-blue-800 text-sm font-medium mb-2">
                Existing entries found for &quot;{formData.childName}&quot;:
              </p>
              {existingEntries.map((entry: {id: string, title: string, evidenceType: string}) => (
                <div key={entry.id} className="text-xs text-blue-700 mb-1">
                  • {entry.title} ({entry.evidenceType})
                </div>
              ))}
              <p className="text-xs text-blue-600 mt-2">
                You can still add new evidence about this person.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Child&apos;s Name *
                </label>
                <Input
                  value={formData.childName}
                  onChange={(e) => setFormData({...formData, childName: e.target.value})}
                  onBlur={searchExistingEntries}
                  placeholder="e.g. Aryan Deuba"
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Parent&apos;s Name *
                </label>
                <Input
                  value={formData.parentName}
                  onChange={(e) => setFormData({...formData, parentName: e.target.value})}
                  placeholder="e.g. Sher Bahadur Deuba"
                  required
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Parent&apos;s Position
              </label>
              <Input
                value={formData.parentPosition}
                onChange={(e) => setFormData({...formData, parentPosition: e.target.value})}
                placeholder="e.g. Prime Minister, Minister of Finance"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Evidence Type *
              </label>
              <Select value={formData.evidenceType} onValueChange={(value) => setFormData({...formData, evidenceType: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select evidence type" />
                </SelectTrigger>
                <SelectContent>
                  {evidenceTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
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
                placeholder="e.g. Expensive foreign education at US university"
                required
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Description *
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Provide detailed information about this evidence of nepotism/corruption..."
                rows={4}
                required
                className="w-full"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Amount/Value (Optional)
                </label>
                <Input
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  placeholder="e.g. Rs. 50 Lakh, $100,000"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Date Occurred (Optional)
                </label>
                <Input
                  value={formData.dateOccurred}
                  onChange={(e) => setFormData({...formData, dateOccurred: e.target.value})}
                  placeholder="e.g. March 2024"
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Sources/Evidence Links *
              </label>
              {formData.sources.map((source, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    value={source}
                    onChange={(e) => handleSourceChange(index, e.target.value)}
                    placeholder="Paste news article, social media post, or document link"
                    className="flex-1"
                  />
                  {formData.sources.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeSource(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addSource}
                className="mt-2"
              >
                Add Another Source
              </Button>
            </div>

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

            <Button 
              type="submit" 
              disabled={!formData.childName || !formData.parentName || !formData.title || !formData.evidenceType || isSubmitting}
              className="w-full"
            >
              {isSubmitting ? "Submitting..." : "Submit Evidence"}
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
              <strong>Evidence-Based:</strong> All claims must be backed by verifiable sources
            </p>
          </div>
          <div className="flex items-start gap-2">
            <Badge variant="secondary" className="mt-0.5">✅</Badge>
            <p className="text-sm">
              <strong>Public Interest:</strong> Focus on corruption that affects taxpayers
            </p>
          </div>
          <div className="flex items-start gap-2">
            <Badge variant="secondary" className="mt-0.5">✅</Badge>
            <p className="text-sm">
              <strong>Multiple Sources:</strong> Provide multiple credible sources when possible
            </p>
          </div>
          <div className="flex items-start gap-2">
            <Badge variant="destructive" className="mt-0.5">❌</Badge>
            <p className="text-sm">
              <strong>No Personal Attacks:</strong> Focus on documented evidence, not personal opinions
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}