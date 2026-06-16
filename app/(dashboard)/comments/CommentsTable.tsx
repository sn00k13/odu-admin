'use client';

import { useState } from 'react';
import type { Comment } from '@/lib/types';
import Pagination from '@/components/Pagination';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://theoduproject.com';
const PAGE_SIZE = 10;

export default function CommentsTable({
  initialComments,
  isSuperAdmin,
}: {
  initialComments: Comment[];
  isSuperAdmin: boolean;
}) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [page, setPage] = useState(0);

  const pageComments = comments.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  async function deleteComment(id: number) {
    if (!confirm('Delete this comment?')) return;
    const res = await fetch(`/api/comments/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setComments((prev) => prev.filter((c) => c.id !== id));
      setPage(0);
    }
  }

  return (
    <div className="bg-white border border-gray-100 rounded shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="admin-table w-full text-sm">
          <thead>
            <tr>
              <th>Name</th>
              <th>Comment</th>
              <th className="hidden sm:table-cell">Blog</th>
              <th className="hidden sm:table-cell">Date</th>
              {isSuperAdmin && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {pageComments.length === 0 && (
              <tr>
                <td colSpan={isSuperAdmin ? 5 : 4} className="text-center text-gray-400 py-8">
                  No comments yet.
                </td>
              </tr>
            )}
            {pageComments.map((c) => (
              <tr key={c.id}>
                <td className="whitespace-nowrap font-medium text-gray-900">{c.name}</td>
                <td className="text-gray-600 max-w-48 sm:max-w-xs truncate">{c.text}</td>
                <td className="hidden sm:table-cell">
                  <a
                    href={`${SITE_URL}/blog/${c.blog_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-xs"
                  >
                    #{c.blog_id}
                  </a>
                </td>
                <td className="hidden sm:table-cell whitespace-nowrap text-gray-400 text-xs">
                  {c.created_at ? new Date(c.created_at).toLocaleDateString('en-GB', {
                    day: 'numeric', month: 'short', year: 'numeric',
                  }) : '—'}
                </td>
                {isSuperAdmin && (
                  <td>
                    <button
                      onClick={() => deleteComment(c.id)}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination page={page} total={comments.length} pageSize={PAGE_SIZE} onChange={setPage} />
    </div>
  );
}
