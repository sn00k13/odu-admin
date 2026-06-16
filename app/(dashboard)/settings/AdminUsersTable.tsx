'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Plus, Shield, ShieldCheck } from 'lucide-react';
import type { AdminUser } from '@/lib/types';

export default function AdminUsersTable({
  users: initialUsers,
  currentUserId,
}: {
  users: AdminUser[];
  currentUserId: string;
}) {
  const [users, setUsers] = useState(initialUsers);
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setError('');

    const res = await fetch('/api/admin-users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      const newUser = await res.json();
      setUsers((prev) => [...prev, newUser]);
      setEmail('');
      setPassword('');
      setShowForm(false);
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error ?? 'Failed to create admin user.');
    }
    setCreating(false);
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    const res = await fetch(`/api/admin-users/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
    }
    setDeletingId(null);
  }

  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-100 rounded shadow-sm overflow-hidden">
        <table className="admin-table w-full text-sm">
          <thead>
            <tr>
              <th>Email</th>
              <th>Role</th>
              <th>Added</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  {user.email}
                  {user.id === currentUserId && (
                    <span className="ml-2 text-xs text-gray-400">(you)</span>
                  )}
                </td>
                <td>
                  <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded font-medium ${
                    user.role === 'super_admin'
                      ? 'bg-red-50 text-red-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {user.role === 'super_admin'
                      ? <ShieldCheck size={11} />
                      : <Shield size={11} />}
                    {user.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                  </span>
                </td>
                <td className="text-gray-500">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td>
                  {user.role !== 'super_admin' && user.id !== currentUserId && (
                    <button
                      onClick={() => handleDelete(user.id)}
                      disabled={deletingId === user.id}
                      className="text-gray-400 hover:text-red-600 transition-colors disabled:opacity-40"
                      title="Remove admin"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm ? (
        <form
          onSubmit={handleCreate}
          className="bg-white border border-gray-100 rounded p-5 shadow-sm space-y-4 max-w-md"
        >
          <h3 className="text-sm font-semibold text-gray-900">Add Admin User</h3>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          {error && <p className="text-red-600 text-xs">{error}</p>}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={creating}
              className="bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded hover:bg-red-700 transition-colors disabled:opacity-60"
            >
              {creating ? 'Creating…' : 'Create'}
            </button>
            <button
              type="button"
              onClick={() => { setShowForm(false); setError(''); }}
              className="text-sm text-gray-600 hover:text-gray-900 px-4 py-2"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
        >
          <Plus size={15} />
          Add admin user
        </button>
      )}
    </div>
  );
}
