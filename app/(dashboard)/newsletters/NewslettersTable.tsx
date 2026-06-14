'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Newsletter } from '@/lib/types';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

export default function NewslettersTable({ initialNewsletters }: { initialNewsletters: Newsletter[] }) {
  const [newsletters, setNewsletters] = useState<Newsletter[]>(initialNewsletters);

  async function togglePublished(id: number, current: boolean) {
    const res = await fetch(`/api/newsletters/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !current }),
    });
    if (res.ok) {
      setNewsletters((prev) =>
        prev.map((n) => (n.id === id ? { ...n, published: !current } : n)),
      );
    }
  }

  async function deleteNewsletter(id: number) {
    if (!confirm('Delete this newsletter? This cannot be undone.')) return;
    const res = await fetch(`/api/newsletters/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setNewsletters((prev) => prev.filter((n) => n.id !== id));
    }
  }

  return (
    <div className="bg-white border border-gray-100 rounded shadow-sm overflow-x-auto">
      <table className="admin-table w-full text-sm">
        <thead>
          <tr>
            <th>Title</th>
            <th>Subject</th>
            <th>Sent</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {newsletters.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center text-gray-400 py-8">No newsletters found.</td>
            </tr>
          )}
          {newsletters.map((n) => (
            <tr key={n.id}>
              <td className="max-w-[200px]">
                <span className="text-gray-900 font-medium line-clamp-1">{n.title}</span>
              </td>
              <td className="max-w-[240px] text-gray-600 line-clamp-1">{n.subject}</td>
              <td className="whitespace-nowrap text-gray-500">
                {n.sent_at ? formatDate(n.sent_at) : '—'}
              </td>
              <td>
                <span className={`inline-block text-xs px-2 py-0.5 rounded font-medium ${
                  n.published ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                }`}>
                  {n.published ? 'Published' : 'Draft'}
                </span>
              </td>
              <td>
                <div className="flex gap-3 whitespace-nowrap">
                  <Link
                    href={`/newsletters/${n.id}/edit`}
                    className="text-xs text-gray-600 hover:text-gray-900 hover:underline"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => togglePublished(n.id, n.published)}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    {n.published ? 'Unpublish' : 'Publish'}
                  </button>
                  <button
                    onClick={() => deleteNewsletter(n.id)}
                    className="text-xs text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
