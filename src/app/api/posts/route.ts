import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function POST(request: NextRequest) {
  try {
    const { title, content, category, authorId, authorName } = await request.json();
    
    // Validate required fields
    if (!title || !content || !category || !authorId || !authorName) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate field lengths
    if (title.length < 5 || title.length > 200) {
      return NextResponse.json(
        { error: 'Title must be between 5 and 200 characters' },
        { status: 400 }
      );
    }

    if (content.length < 20 || content.length > 5000) {
      return NextResponse.json(
        { error: 'Content must be between 20 and 5000 characters' },
        { status: 400 }
      );
    }

    // Validate category
    const validCategories = ['discussion', 'news', 'corruption', 'protest'];
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      );
    }

    // Create post document
    const postData = {
      title: title.trim(),
      content: content.trim(),
      category,
      authorId,
      authorName,
      upvotes: 0,
      downvotes: 0,
      commentCount: 0,
      status: 'active',
      createdAt: serverTimestamp(),
    };

    // Save to Firestore
    const docRef = await addDoc(collection(db, 'posts'), postData);

    return NextResponse.json({ 
      success: true, 
      message: 'Post created successfully',
      id: docRef.id
    });

  } catch (error) {
    console.error('Post creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create post. Please try again.' },
      { status: 500 }
    );
  }
}