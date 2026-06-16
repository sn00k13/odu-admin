import { getAdminUser } from '@/lib/auth';
import AdminSidebar from '@/components/AdminSidebar';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getAdminUser();
  const isSuperAdmin = user?.app_metadata?.role === 'super_admin';

  return (
    <div className="min-h-dvh bg-gray-50 flex">
      <AdminSidebar isSuperAdmin={isSuperAdmin} />
      <main className="flex-1 p-6 md:p-10 overflow-auto">{children}</main>
    </div>
  );
}
