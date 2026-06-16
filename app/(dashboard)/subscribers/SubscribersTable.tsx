'use client';

import { useState } from 'react';
import { Download } from 'lucide-react';
import type { Subscriber } from '@/lib/types';
import Pagination from '@/components/Pagination';

const PAGE_SIZE = 10;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

function exportCSV(subscribers: Subscriber[]) {
  const rows = [
    ['Email', 'Name', 'Status', 'Joined'],
    ...subscribers.map((s) => [
      s.email,
      s.name ?? '',
      s.subscribed ? 'Active' : 'Unsubscribed',
      formatDate(s.created_at),
    ]),
  ];
  const csv = rows.map((r) => r.map((v) => `"${v.replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function SubscribersTable({
  initialSubscribers,
  isSuperAdmin,
}: {
  initialSubscribers: Subscriber[];
  isSuperAdmin: boolean;
}) {
  const [subscribers, setSubscribers] = useState<Subscriber[]>(initialSubscribers);
  const [page, setPage] = useState(0);

  const pageSubscribers = subscribers.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const active   = subscribers.filter((s) => s.subscribed).length;
  const inactive = subscribers.length - active;

  async function toggleSubscribed(id: number, current: boolean) {
    const res = await fetch(`/api/subscribers/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subscribed: !current }),
    });
    if (res.ok) {
      setSubscribers((prev) =>
        prev.map((s) => (s.id === id ? { ...s, subscribed: !current } : s)),
      );
    }
  }

  async function deleteSubscriber(id: number) {
    if (!confirm('Remove this subscriber permanently? This cannot be undone.')) return;
    const res = await fetch(`/api/subscribers/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setSubscribers((prev) => prev.filter((s) => s.id !== id));
      setPage(0);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-3 sm:gap-4 text-sm text-gray-500">
          <span><strong className="text-gray-900">{subscribers.length}</strong> total</span>
          <span><strong className="text-green-700">{active}</strong> active</span>
          <span><strong className="text-gray-500">{inactive}</strong> unsubscribed</span>
        </div>
        <button
          onClick={() => exportCSV(subscribers)}
          disabled={subscribers.length === 0}
          className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-200 rounded px-3 py-1.5 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Download size={14} />
          Export CSV
        </button>
      </div>

      <div className="bg-white border border-gray-100 rounded shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="admin-table w-full text-sm">
            <thead>
              <tr>
                <th>Email</th>
                <th className="hidden sm:table-cell">Name</th>
                <th className="hidden md:table-cell">Joined</th>
                <th>Status</th>
                {isSuperAdmin && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {pageSubscribers.length === 0 && (
                <tr>
                  <td colSpan={isSuperAdmin ? 5 : 4} className="text-center text-gray-400 py-8">
                    No subscribers yet.
                  </td>
                </tr>
              )}
              {pageSubscribers.map((s) => (
                <tr key={s.id}>
                  <td className="font-medium text-gray-900 max-w-40 sm:max-w-none truncate">
                    {s.email}
                  </td>
                  <td className="hidden sm:table-cell text-gray-600">{s.name || '—'}</td>
                  <td className="hidden md:table-cell whitespace-nowrap text-gray-500">
                    {formatDate(s.created_at)}
                  </td>
                  <td>
                    <span className={`inline-block text-xs px-2 py-0.5 rounded font-medium ${
                      s.subscribed ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {s.subscribed ? 'Active' : 'Unsubscribed'}
                    </span>
                  </td>
                  {isSuperAdmin && (
                    <td>
                      <div className="flex gap-2 sm:gap-3 whitespace-nowrap">
                        <button
                          onClick={() => toggleSubscribed(s.id, s.subscribed)}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          {s.subscribed ? 'Unsubscribe' : 'Resubscribe'}
                        </button>
                        <button
                          onClick={() => deleteSubscriber(s.id)}
                          className="text-xs text-red-500 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination page={page} total={subscribers.length} pageSize={PAGE_SIZE} onChange={setPage} />
      </div>
    </div>
  );
}
