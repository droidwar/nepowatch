"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    if (password === "nepowatch2025") {
      setIsAuthenticated(true);
    } else {
      alert("Incorrect password");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-20">
        <Card>
          <CardHeader>
            <CardTitle>🔒 Admin Login</CardTitle>
            <p className="text-muted-foreground">Enter admin password to continue</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="password"
              placeholder="Admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
            <Button onClick={handleLogin} className="w-full">
              Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">🛡️ Admin Dashboard</h1>
        <Button variant="outline" onClick={() => setIsAuthenticated(false)}>
          Logout
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-orange-600">0</div>
            <p className="text-sm text-muted-foreground">Pending Review</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">0</div>
            <p className="text-sm text-muted-foreground">Approved</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">0</div>
            <p className="text-sm text-muted-foreground">Rejected</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">0</div>
            <p className="text-sm text-muted-foreground">Total Submissions</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>⏳ Pending Approvals (0)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No pending videos to review. Firebase integration required for full functionality.
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>🚧 Setup Required</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            To enable full admin functionality, Firebase integration needs to be completed:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
            <li>Configure Firebase project</li>
            <li>Set up Firestore database</li>
            <li>Add environment variables</li>
            <li>Enable real-time video moderation</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}