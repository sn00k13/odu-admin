import { createClient } from '@/lib/supabase/server';

export async function getAdminUser() {
  const sb = await createClient();
  const { data: { user } } = await sb.auth.getUser();
  return user;
}

export async function isAdmin(): Promise<boolean> {
  const user = await getAdminUser();
  const role = user?.app_metadata?.role;
  return role === 'admin' || role === 'super_admin';
}

export async function isSuperAdmin(): Promise<boolean> {
  const user = await getAdminUser();
  return user?.app_metadata?.role === 'super_admin';
}
