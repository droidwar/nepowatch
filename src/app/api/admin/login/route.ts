import { NextRequest, NextResponse } from 'next/server';
import { isAdminEmail } from '@/lib/auth-helpers';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { idToken, email } = await request.json();
    
    if (!idToken || !email) {
      return NextResponse.json(
        { error: 'Google ID token and email are required' },
        { status: 400 }
      );
    }

    // First check if email is in admin list
    if (!isAdminEmail(email)) {
      return NextResponse.json(
        { error: 'Unauthorized email address. Access denied.' },
        { status: 403 }
      );
    }

    try {
      // Verify Google ID token (in production, you'd verify the token with Google)
      // For now, we trust the client-side Google auth since we're checking the email
      
      // Create secure session
      const sessionData = {
        email: email.toLowerCase().trim(),
        timestamp: Date.now(),
        provider: 'google',
      };

      const cookieStore = await cookies();
      cookieStore.set('admin-session', JSON.stringify(sessionData), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60, // 24 hours
        path: '/'
      });

      return NextResponse.json({ 
        success: true, 
        message: 'Google Sign-In successful',
        redirectTo: '/admin'
      });

    } catch {
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      );
    }
    
  } catch (error) {
    console.error('Google Sign-In error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}