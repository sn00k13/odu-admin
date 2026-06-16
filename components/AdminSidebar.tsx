'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  FolderKanban,
  Mail,
  Users,
  MessageSquare,
  Settings,
  LogOut,
} from 'lucide-react';

const NAV = [
  { href: '/',            label: 'Overview',    icon: LayoutDashboard },
  { href: '/blogs',       label: 'Blogs',       icon: FileText },
  { href: '/projects',    label: 'Projects',    icon: FolderKanban },
  { href: '/newsletters', label: 'Newsletters', icon: Mail },
  { href: '/subscribers', label: 'Subscribers', icon: Users },
  { href: '/comments',    label: 'Comments',    icon: MessageSquare },
];

export default function AdminSidebar({ isSuperAdmin }: { isSuperAdmin: boolean }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  }

  return (
    <aside className="w-56 shrink-0 bg-white border-r border-gray-100 flex flex-col py-8 px-4">
      <div className="mb-10 px-2">
        <span className="text-lg font-bold text-red-600">Odu</span>
        <span className="text-lg font-bold text-gray-900"> Admin</span>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded text-sm font-medium transition-colors ${
                active
                  ? 'bg-red-50 text-red-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}

        {isSuperAdmin && (
          <Link
            href="/settings"
            className={`flex items-center gap-3 px-3 py-2 rounded text-sm font-medium transition-colors ${
              pathname.startsWith('/settings')
                ? 'bg-red-50 text-red-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <Settings size={16} />
            Settings
          </Link>
        )}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-3 py-2 rounded text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors mt-4"
      >
        <LogOut size={16} />
        Sign out
      </button>
    </aside>
  );
}
