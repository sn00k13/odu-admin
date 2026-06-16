import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { isAdmin, isSuperAdmin, getAdminUser } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import AdminUsersTable from './AdminUsersTable';
import ChangePasswordForm from '@/components/ChangePasswordForm';
import type { AdminUser } from '@/lib/types';

export const metadata: Metadata = { title: 'Settings' };

export default async function SettingsPage() {
  if (!(await isAdmin())) redirect('/login');

  const superAdmin = await isSuperAdmin();
  const currentUser = await getAdminUser();

  let adminUsers: AdminUser[] = [];
  if (superAdmin) {
    const sb = createAdminClient();
    const { data } = await sb
      .from('admin_users')
      .select('*')
      .order('created_at', { ascending: true });
    adminUsers = (data ?? []) as AdminUser[];
  }

  return (
    <div className="space-y-12">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

      <section className="max-w-md">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
          <p className="text-sm text-gray-500 mt-1">
            Update the password for your admin account.
          </p>
        </div>
        <div className="bg-white border border-gray-100 rounded p-6 shadow-sm">
          <ChangePasswordForm />
        </div>
      </section>

      {superAdmin && (
        <section className="max-w-3xl">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Admin Users</h2>
            <p className="text-sm text-gray-500 mt-1">
              Admin users have read-only access. Only the super admin can create, edit, or delete content.
            </p>
          </div>
          <AdminUsersTable
            users={adminUsers}
            currentUserId={currentUser?.id ?? ''}
          />
        </section>
      )}
    </div>
  );
}
