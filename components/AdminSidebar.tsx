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
  X,
} from 'lucide-react';

const NAV = [
  { href: '/',            label: 'Overview',    icon: LayoutDashboard },
  { href: '/blogs',       label: 'Blogs',       icon: FileText },
  { href: '/projects',    label: 'Projects',    icon: FolderKanban },
  { href: '/newsletters', label: 'Newsletters', icon: Mail },
  { href: '/subscribers', label: 'Subscribers', icon: Users },
  { href: '/comments',    label: 'Comments',    icon: MessageSquare },
  { href: '/settings',    label: 'Settings',    icon: Settings },
];

export default function AdminSidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  }

  return (
    <aside className="w-56 min-h-dvh shrink-0 bg-white border-r border-gray-100 flex flex-col py-8 px-4">
      <div className="mb-10 px-2 flex items-center justify-between">
        <span className="text-lg font-bold">
          <span className="text-red-600">Odu</span>
          <span className="text-gray-900"> Admin</span>
        </span>
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden text-gray-400 hover:text-gray-600 p-1"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
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
