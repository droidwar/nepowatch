import { NextRequest, NextResponse } from 'next/server';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { NepoEntry } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');
    
    if (!name || name.trim().length < 2) {
      return NextResponse.json({ entries: [] });
    }

    const searchName = name.trim().toLowerCase();

    // Search for entries with matching child names
    const q = query(
      collection(db, 'nepoEntries'),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const allEntries: NepoEntry[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      allEntries.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
      } as NepoEntry);
    });

    // Filter entries by name match (client-side filtering due to Firestore limitations)
    const matchingEntries = allEntries.filter(entry => 
      entry.childName.toLowerCase().includes(searchName) ||
      entry.parentName.toLowerCase().includes(searchName)
    );

    // Return only approved entries for public search
    // (Admin can see all entries in dashboard)
    const publicEntries = matchingEntries
      .filter(entry => entry.status === 'approved')
      .map(entry => ({
        id: entry.id,
        childName: entry.childName,
        parentName: entry.parentName,
        parentPosition: entry.parentPosition,
        title: entry.title,
        evidenceType: entry.evidenceType,
        createdAt: entry.createdAt,
      }));

    return NextResponse.json({ 
      entries: publicEntries,
      count: publicEntries.length 
    });

  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Search failed', entries: [] },
      { status: 500 }
    );
  }
}