'use client';

import { useState } from 'react';
import type { Comment } from '@/lib/types';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://theoduproject.com';

export default function CommentsTable({ initialComments }: { initialComments: Comment[] }) {
  const [comments, setComments] = useState<Comment[]>(initialComments);

  async function deleteComment(id: number) {
    if (!confirm('Delete this comment?')) return;
    const res = await fetch(`/api/comments/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setComments((prev) => prev.filter((c) => c.id !== id));
    }
  }

  return (
    <div className="bg-white border border-gray-100 rounded shadow-sm overflow-x-auto">
      <table className="admin-table w-full text-sm">
        <thead>
          <tr>
            <th>Name</th>
            <th>Comment</th>
            <th>Blog</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {comments.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center text-gray-400 py-8">No comments yet.</td>
            </tr>
          )}
          {comments.map((c) => (
            <tr key={c.id}>
              <td className="whitespace-nowrap font-medium text-gray-900">{c.name}</td>
              <td className="max-w-[300px] text-gray-600 truncate">{c.text}</td>
              <td>
                <a
                  href={`${SITE_URL}/blog/${c.blog_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-xs"
                >
                  #{c.blog_id}
                </a>
              </td>
              <td className="whitespace-nowrap text-gray-400 text-xs">
                {c.created_at ? new Date(c.created_at).toLocaleDateString('en-GB', {
                  day: 'numeric', month: 'short', year: 'numeric',
                }) : '—'}
              </td>
              <td>
                <button
                  onClick={() => deleteComment(c.id)}
                  className="text-xs text-red-500 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
