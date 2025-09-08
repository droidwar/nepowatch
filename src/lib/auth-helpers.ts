import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// Get admin emails from environment variable (server-side only)
export function getAdminEmails(): string[] {
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

// Check if email is admin (server-side only)
export function isAdminEmail(email: string): boolean {
  const adminEmails = getAdminEmails();
  const normalizedEmail = email.toLowerCase().trim();
  return adminEmails.includes(normalizedEmail);
}

// Server-side auth check
export async function requireAdminAuth() {
  const cookieStore = await cookies();
  const adminSession = cookieStore.get('admin-session');
  
  if (!adminSession?.value) {
    redirect('/admin/login');
  }

  try {
    const sessionData = JSON.parse(adminSession.value);
    const { email, timestamp } = sessionData;
    
    // Check if session is expired (24 hours)
    const sessionAge = Date.now() - timestamp;
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    
    if (sessionAge > maxAge) {
      redirect('/admin/login');
    }
    
    // Verify admin status
    if (!isAdminEmail(email)) {
      redirect('/admin/login');
    }
    
    return { email, isAdmin: true };
  } catch {
    redirect('/admin/login');
  }
}