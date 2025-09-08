import { requireAdminAuth } from '@/lib/auth-helpers';
import { AdminDashboard } from './AdminDashboard';

export default async function AdminPage() {
  // Server-side authentication check - cannot be bypassed
  const authResult = await requireAdminAuth();
  
  // If we reach here, user is authenticated as admin
  return <AdminDashboard adminEmail={authResult.email} />;
}