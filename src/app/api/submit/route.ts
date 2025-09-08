import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function POST(request: NextRequest) {
  try {
    const { submitterName, tiktokUrl, title, description } = await request.json();
    
    // Validate required fields
    if (!tiktokUrl || !title) {
      return NextResponse.json(
        { error: 'TikTok URL and title are required' },
        { status: 400 }
      );
    }

    // Basic TikTok URL validation
    const tiktokUrlPattern = /^https?:\/\/(www\.)?(tiktok\.com|vm\.tiktok\.com)/i;
    if (!tiktokUrlPattern.test(tiktokUrl)) {
      return NextResponse.json(
        { error: 'Please provide a valid TikTok URL' },
        { status: 400 }
      );
    }

    // Create video submission document
    const videoSubmission = {
      submitterName: submitterName?.trim() || 'Anonymous',
      tiktokUrl: tiktokUrl.trim(),
      title: title.trim(),
      description: description?.trim() || '',
      status: 'pending',
      createdAt: serverTimestamp(),
    };

    // Save to Firestore
    const docRef = await addDoc(collection(db, 'videoSubmissions'), videoSubmission);

    return NextResponse.json({ 
      success: true, 
      message: 'Video submitted successfully for review',
      id: docRef.id
    });

  } catch (error) {
    console.error('Video submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit video. Please try again.' },
      { status: 500 }
    );
  }
}