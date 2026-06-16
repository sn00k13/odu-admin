import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { isSuperAdmin, getAdminUser } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import AdminUsersTable from './AdminUsersTable';
import type { AdminUser } from '@/lib/types';

export const metadata: Metadata = { title: 'Settings' };

export default async function SettingsPage() {
  if (!(await isSuperAdmin())) redirect('/');

  const currentUser = await getAdminUser();
  const sb = createAdminClient();
  const { data } = await sb
    .from('admin_users')
    .select('*')
    .order('created_at', { ascending: true });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Settings</h1>

      <section className="max-w-3xl">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Admin Users</h2>
          <p className="text-sm text-gray-500 mt-1">
            Admin users have read-only access. Only the super admin can create, edit, or delete content.
          </p>
        </div>
        <AdminUsersTable
          users={(data ?? []) as AdminUser[]}
          currentUserId={currentUser?.id ?? ''}
        />
      </section>
    </div>
  );
}
