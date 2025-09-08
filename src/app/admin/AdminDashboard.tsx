"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  doc, 
  updateDoc 
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { VideoSubmission } from "@/types";

interface AdminDashboardProps {
  adminEmail: string;
}

export function AdminDashboard({ adminEmail }: AdminDashboardProps) {
  const [pendingVideos, setPendingVideos] = useState<VideoSubmission[]>([]);
  const [allVideos, setAllVideos] = useState<VideoSubmission[]>([]);
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

    return () => {
      unsubscribePending();
      unsubscribeAll();
    };
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/admin/logout', {
        method: 'POST',
      });
      
      if (response.ok) {
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleApprove = async (videoId: string) => {
    try {
      await updateDoc(doc(db, "videoSubmissions", videoId), {
        status: "approved"
      });
    } catch (error) {
      console.error("Error approving video:", error);
      alert("Error approving video");
    }
  };

  const handleReject = async (videoId: string) => {
    try {
      await updateDoc(doc(db, "videoSubmissions", videoId), {
        status: "rejected"
      });
    } catch (error) {
      console.error("Error rejecting video:", error);
      alert("Error rejecting video");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  const approvedCount = allVideos.filter(v => v.status === 'approved').length;
  const rejectedCount = allVideos.filter(v => v.status === 'rejected').length;

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
            <div className="text-2xl font-bold text-orange-600">{pendingVideos.length}</div>
            <p className="text-sm text-muted-foreground">Pending Review</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
            <p className="text-sm text-muted-foreground">Approved</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">{rejectedCount}</div>
            <p className="text-sm text-muted-foreground">Rejected</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{allVideos.length}</div>
            <p className="text-sm text-muted-foreground">Total Submissions</p>
          </CardContent>
        </Card>
      </div>

      {/* Security Notice */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-4">
          <div className="flex items-center gap-2">
            <div className="text-green-600">🔒</div>
            <p className="text-sm text-green-800">
              <strong>Secure Admin Access:</strong> Authenticated via Google OAuth with server-side 
              email verification. Cannot be bypassed by client-side modifications.
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
                          By {video.submitterName} • {video.createdAt.toLocaleDateString()}
                        </p>
                        <p className="text-sm mt-2">{video.description}</p>
                        <a 
                          href={video.tiktokUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm"
                        >
                          {video.tiktokUrl}
                        </a>
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

      {/* Recent Submissions */}
      <Card>
        <CardHeader>
          <CardTitle>📊 Recent Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {allVideos.slice(0, 10).map((video) => (
              <div key={video.id} className="flex items-center justify-between py-2 border-b">
                <div>
                  <span className="font-medium text-sm">{video.title}</span>
                  <span className="text-muted-foreground text-sm ml-2">
                    by {video.submitterName}
                  </span>
                </div>
                <Badge 
                  variant={
                    video.status === 'approved' ? 'default' :
                    video.status === 'rejected' ? 'destructive' : 'secondary'
                  }
                >
                  {video.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}