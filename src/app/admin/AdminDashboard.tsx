"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { event } from "@/lib/gtag";
import TikTokVideo from "@/components/TikTokVideo";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { VideoSubmission, NepoEntry } from "@/types";

interface AdminDashboardProps {
  adminEmail: string;
}

export function AdminDashboard({ adminEmail }: AdminDashboardProps) {
  const [pendingVideos, setPendingVideos] = useState<VideoSubmission[]>([]);
  const [allVideos, setAllVideos] = useState<VideoSubmission[]>([]);
  const [pendingNepoEntries, setPendingNepoEntries] = useState<NepoEntry[]>([]);
  const [allNepoEntries, setAllNepoEntries] = useState<NepoEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Load videos on component mount
  useEffect(() => {
    // Get pending videos
    const pendingQuery = query(
      collection(db, "videoSubmissions"),
      where("status", "==", "pending"),
      orderBy("createdAt", "desc")
    );

    const unsubscribePending = onSnapshot(pendingQuery, (querySnapshot) => {
      const videosData: VideoSubmission[] = [];
      querySnapshot.forEach((doc) => {
        videosData.push({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        } as VideoSubmission);
      });
      setPendingVideos(videosData);
      setLoading(false);
    });

    // Get all videos for overview
    const allQuery = query(
      collection(db, "videoSubmissions"),
      orderBy("createdAt", "desc")
    );

    const unsubscribeAll = onSnapshot(allQuery, (querySnapshot) => {
      const videosData: VideoSubmission[] = [];
      querySnapshot.forEach((doc) => {
        videosData.push({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        } as VideoSubmission);
      });
      setAllVideos(videosData);
    });

    // Get pending nepo entries
    const pendingNepoQuery = query(
      collection(db, "nepoEntries"),
      where("status", "==", "pending"),
      orderBy("createdAt", "desc")
    );

    const unsubscribePendingNepo = onSnapshot(pendingNepoQuery, (querySnapshot) => {
      const nepoData: NepoEntry[] = [];
      querySnapshot.forEach((doc) => {
        nepoData.push({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        } as NepoEntry);
      });
      setPendingNepoEntries(nepoData);
    });

    // Get all nepo entries for overview
    const allNepoQuery = query(
      collection(db, "nepoEntries"),
      orderBy("createdAt", "desc")
    );

    const unsubscribeAllNepo = onSnapshot(allNepoQuery, (querySnapshot) => {
      const nepoData: NepoEntry[] = [];
      querySnapshot.forEach((doc) => {
        nepoData.push({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        } as NepoEntry);
      });
      setAllNepoEntries(nepoData);
      setLoading(false);
    });

    return () => {
      unsubscribePending();
      unsubscribeAll();
      unsubscribePendingNepo();
      unsubscribeAllNepo();
    };
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/admin/logout", {
        method: "POST",
      });

      if (response.ok) {
        router.push("/admin/login");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleApprove = async (videoId: string) => {
    try {
      await updateDoc(doc(db, "videoSubmissions", videoId), {
        status: "approved",
      });
      
      // Track video approval
      event({
        action: 'video_approve',
        category: 'admin',
        label: 'content_moderation'
      });
    } catch (error) {
      console.error("Error approving video:", error);
      alert("Error approving video");
    }
  };

  const handleReject = async (videoId: string) => {
    try {
      await updateDoc(doc(db, "videoSubmissions", videoId), {
        status: "rejected",
      });
    } catch (error) {
      console.error("Error rejecting video:", error);
      alert("Error rejecting video");
    }
  };

  const handleApproveNepo = async (entryId: string) => {
    try {
      await updateDoc(doc(db, "nepoEntries", entryId), {
        status: "approved"
      });
      
      // Track nepo entry approval
      event({
        action: 'nepo_approve',
        category: 'admin',
        label: 'content_moderation'
      });
    } catch (error) {
      console.error("Error approving nepo entry:", error);
      alert("Error approving nepo entry");
    }
  };

  const handleRejectNepo = async (entryId: string) => {
    try {
      await updateDoc(doc(db, "nepoEntries", entryId), {
        status: "rejected"
      });
    } catch (error) {
      console.error("Error rejecting nepo entry:", error);
      alert("Error rejecting nepo entry");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  const approvedCount = allVideos.filter((v) => v.status === "approved").length;
  const approvedNepoCount = allNepoEntries.filter((e) => e.status === "approved").length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">🛡️ Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome, {adminEmail} • Google authenticated • Server-side verified
          </p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          Sign Out
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-orange-600">
              {pendingVideos.length + pendingNepoEntries.length}
            </div>
            <p className="text-sm text-muted-foreground">Pending Review</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {approvedCount + approvedNepoCount}
            </div>
            <p className="text-sm text-muted-foreground">Approved Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">
              {allVideos.length}
            </div>
            <p className="text-sm text-muted-foreground">Video Submissions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-purple-600">
              {allNepoEntries.length}
            </div>
            <p className="text-sm text-muted-foreground">Nepo Database Entries</p>
          </CardContent>
        </Card>
      </div>

      {/* Security Notice */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-4">
          <div className="flex items-center gap-2">
            <div className="text-green-600">🔒</div>
            <p className="text-sm text-green-800">
              <strong>Secure Admin Access:</strong> Authenticated via Google OAuth
              with server-side email verification. Cannot be bypassed by
              client-side modifications.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Pending Videos */}
      <Card>
        <CardHeader>
          <CardTitle>⏳ Pending Approvals ({pendingVideos.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {pendingVideos.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No pending videos to review
            </div>
          ) : (
            <div className="space-y-4">
              {pendingVideos.map((video) => (
                <Card key={video.id} className="border-orange-200">
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold">{video.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          By {video.submitterName} •{" "}
                          {video.createdAt.toLocaleDateString()}
                        </p>
                        <p className="text-sm mt-2">{video.description}</p>
                        <TikTokVideo url={video.tiktokUrl} size="medium" />
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReject(video.id)}
                        >
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleApprove(video.id)}
                        >
                          Approve
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pending Nepo Entries */}
      <Card>
        <CardHeader>
          <CardTitle>🏛️ Pending Nepo Database Entries ({pendingNepoEntries.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {pendingNepoEntries.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No pending nepo entries to review
            </div>
          ) : (
            <div className="space-y-4">
              {pendingNepoEntries.map((entry) => (
                <Card key={entry.id} className="border-purple-200">
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-purple-800">{entry.childName}</h3>
                          <Badge variant="secondary">
                            {entry.evidenceType.replace('-', ' ')}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Child of {entry.parentName}
                          {entry.parentPosition && ` (${entry.parentPosition})`}
                        </p>
                        <h4 className="font-medium mb-2">{entry.title}</h4>
                        <p className="text-sm mb-2">{entry.description}</p>
                        
                        {entry.amount && (
                          <p className="text-sm mb-2">
                            <strong>Amount:</strong> {entry.amount}
                          </p>
                        )}
                        
                        {entry.dateOccurred && (
                          <p className="text-sm mb-2">
                            <strong>Date:</strong> {entry.dateOccurred}
                          </p>
                        )}

                        <div className="mb-2">
                          <p className="text-sm font-medium mb-1">Sources:</p>
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

                        <p className="text-xs text-muted-foreground">
                          By {entry.submitterName} • {entry.createdAt.toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRejectNepo(entry.id)}
                        >
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleApproveNepo(entry.id)}
                        >
                          Approve
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Submissions */}
      <Card>
        <CardHeader>
          <CardTitle>📊 Recent Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {/* Video submissions */}
            {allVideos.slice(0, 5).map((video) => (
              <div
                key={`video-${video.id}`}
                className="flex items-center justify-between py-2 border-b"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-blue-600">📱 VIDEO</span>
                    <span className="font-medium text-sm">{video.title}</span>
                  </div>
                  <span className="text-muted-foreground text-xs">
                    by {video.submitterName}
                  </span>
                </div>
                <Badge
                  variant={
                    video.status === "approved"
                      ? "default"
                      : video.status === "rejected"
                      ? "destructive"
                      : "secondary"
                  }
                >
                  {video.status}
                </Badge>
              </div>
            ))}
            
            {/* Nepo entries */}
            {allNepoEntries.slice(0, 5).map((entry) => (
              <div
                key={`nepo-${entry.id}`}
                className="flex items-center justify-between py-2 border-b"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-purple-600">🏛️ NEPO</span>
                    <span className="font-medium text-sm">{entry.childName}: {entry.title}</span>
                  </div>
                  <span className="text-muted-foreground text-xs">
                    by {entry.submitterName}
                  </span>
                </div>
                <Badge
                  variant={
                    entry.status === "approved"
                      ? "default"
                      : entry.status === "rejected"
                      ? "destructive"
                      : "secondary"
                  }
                >
                  {entry.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}