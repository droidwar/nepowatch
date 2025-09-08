import { NextRequest, NextResponse } from 'next/server';

// Get admin emails from environment variable (comma-separated list)
function getAdminEmails(): string[] {
  const adminEmailsStr = process.env.ADMIN_EMAILS;
  if (!adminEmailsStr) {
    console.error('ADMIN_EMAILS environment variable not set');
    return [];
  }
  
  return adminEmailsStr
    .split(',')
    .map(email => email.trim().toLowerCase())
    .filter(email => email.length > 0);
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required', isAdmin: false },
        { status: 400 }
      );
    }

    const adminEmails = getAdminEmails();
    const normalizedEmail = email.toLowerCase().trim();
    const isAdmin = adminEmails.includes(normalizedEmail);

    return NextResponse.json({ 
      isAdmin,
      message: isAdmin ? 'Admin access granted' : 'Access denied'
    });
    
  } catch (error) {
    console.error('Admin verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error', isAdmin: false },
      { status: 500 }
    );
  }
}