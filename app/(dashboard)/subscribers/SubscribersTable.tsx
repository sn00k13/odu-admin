'use client';

import { useState } from 'react';
import type { Subscriber } from '@/lib/types';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

export default function SubscribersTable({ initialSubscribers }: { initialSubscribers: Subscriber[] }) {
  const [subscribers, setSubscribers] = useState<Subscriber[]>(initialSubscribers);

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
    }
  }

  const active   = subscribers.filter((s) => s.subscribed).length;
  const inactive = subscribers.length - active;

  return (
    <div className="space-y-4">
      <div className="flex gap-4 text-sm text-gray-500">
        <span><strong className="text-gray-900">{subscribers.length}</strong> total</span>
        <span><strong className="text-green-700">{active}</strong> active</span>
        <span><strong className="text-gray-500">{inactive}</strong> unsubscribed</span>
      </div>

      <div className="bg-white border border-gray-100 rounded shadow-sm overflow-x-auto">
        <table className="admin-table w-full text-sm">
          <thead>
            <tr>
              <th>Email</th>
              <th>Name</th>
              <th>Joined</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-gray-400 py-8">No subscribers yet.</td>
              </tr>
            )}
            {subscribers.map((s) => (
              <tr key={s.id}>
                <td className="font-medium text-gray-900">{s.email}</td>
                <td className="text-gray-600">{s.name || '—'}</td>
                <td className="whitespace-nowrap text-gray-500">{formatDate(s.created_at)}</td>
                <td>
                  <span className={`inline-block text-xs px-2 py-0.5 rounded font-medium ${
                    s.subscribed ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {s.subscribed ? 'Active' : 'Unsubscribed'}
                  </span>
                </td>
                <td>
                  <div className="flex gap-3 whitespace-nowrap">
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
