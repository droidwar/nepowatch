import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function POST(request: NextRequest) {
  try {
    const { 
      childName, 
      parentName, 
      parentPosition,
      evidenceType,
      title,
      description,
      amount,
      dateOccurred,
      sources,
      submitterName 
    } = await request.json();
    
    // Validate required fields
    if (!childName || !parentName || !title || !evidenceType || !description) {
      return NextResponse.json(
        { error: 'Child name, parent name, title, evidence type, and description are required' },
        { status: 400 }
      );
    }

    // Validate sources array
    if (!sources || !Array.isArray(sources) || sources.filter(s => s.trim()).length === 0) {
      return NextResponse.json(
        { error: 'At least one source/evidence link is required' },
        { status: 400 }
      );
    }

    // Validate evidence type
    const validEvidenceTypes = ['luxury-spending', 'property', 'education', 'travel', 'other'];
    if (!validEvidenceTypes.includes(evidenceType)) {
      return NextResponse.json(
        { error: 'Invalid evidence type' },
        { status: 400 }
      );
    }

    // Clean and validate sources
    const cleanSources = sources
      .map((source: string) => source.trim())
      .filter((source: string) => source.length > 0);

    if (cleanSources.length === 0) {
      return NextResponse.json(
        { error: 'At least one valid source is required' },
        { status: 400 }
      );
    }

    // Create nepo kids entry document
    const nepoEntry = {
      childName: childName.trim(),
      parentName: parentName.trim(),
      parentPosition: parentPosition?.trim() || '',
      evidenceType: evidenceType,
      title: title.trim(),
      description: description.trim(),
      amount: amount?.trim() || '',
      dateOccurred: dateOccurred?.trim() || '',
      sources: cleanSources,
      submitterName: submitterName?.trim() || 'Anonymous',
      status: 'pending',
      createdAt: serverTimestamp(),
    };

    // Save to Firestore
    const docRef = await addDoc(collection(db, 'nepoEntries'), nepoEntry);

    return NextResponse.json({ 
      success: true, 
      message: 'Evidence submitted successfully for review',
      id: docRef.id
    });

  } catch (error) {
    console.error('Nepo kids submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit evidence. Please try again.' },
      { status: 500 }
    );
  }
}