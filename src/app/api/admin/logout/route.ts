import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = await cookies();
    
    // Clear the admin session cookie
    cookieStore.delete('admin-session');

    return NextResponse.json({ 
      success: true, 
      message: 'Logged out successfully',
      redirectTo: '/admin/login'
    });
    
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}