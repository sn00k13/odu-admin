'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';
import AdminSidebar from './AdminSidebar';

export default function SidebarShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-dvh bg-gray-50 flex">
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-40 md:static md:inset-auto md:z-auto transition-transform duration-200 ease-in-out ${
          open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <AdminSidebar onClose={() => setOpen(false)} />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 md:hidden bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setOpen(true)}
            className="text-gray-600 hover:text-gray-900 p-1 -ml-1"
            aria-label="Open navigation"
          >
            <Menu size={20} />
          </button>
          <span className="text-base font-bold">
            <span className="text-red-600">Odu</span>
            <span className="text-gray-900"> Admin</span>
          </span>
        </header>

        <main className="flex-1 p-4 sm:p-6 md:p-10 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
