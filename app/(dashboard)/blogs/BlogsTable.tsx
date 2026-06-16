'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Blog } from '@/lib/types';
import Pagination from '@/components/Pagination';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://theoduproject.com';
const PAGE_SIZE = 10;

export default function BlogsTable({
  initialBlogs,
  isSuperAdmin,
}: {
  initialBlogs: Blog[];
  isSuperAdmin: boolean;
}) {
  const [blogs, setBlogs] = useState<Blog[]>(initialBlogs);
  const [page, setPage] = useState(0);

  const pageBlogs = blogs.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  async function togglePublished(id: number, current: boolean) {
    const res = await fetch(`/api/blogs/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !current }),
    });
    if (res.ok) {
      setBlogs((prev) =>
        prev.map((b) => (b.id === id ? { ...b, published: !current } : b)),
      );
    }
  }

  async function deleteBlog(id: number) {
    if (!confirm('Delete this blog post? This cannot be undone.')) return;
    const res = await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setBlogs((prev) => prev.filter((b) => b.id !== id));
      setPage(0);
    }
  }

  return (
    <div className="bg-white border border-gray-100 rounded shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="admin-table w-full text-sm">
          <thead>
            <tr>
              <th>Title</th>
              <th className="hidden sm:table-cell">Author</th>
              <th className="hidden lg:table-cell">Category</th>
              <th className="hidden sm:table-cell">Views</th>
              <th>Status</th>
              {isSuperAdmin && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {pageBlogs.length === 0 && (
              <tr>
                <td colSpan={isSuperAdmin ? 6 : 5} className="text-center text-gray-400 py-8">
                  No blogs found.
                </td>
              </tr>
            )}
            {pageBlogs.map((b) => (
              <tr key={b.id}>
                <td>
                  <a
                    href={`${SITE_URL}/blog/${b.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-900 font-medium hover:text-red-600 transition-colors line-clamp-1 block max-w-40 sm:max-w-55 lg:max-w-xs"
                  >
                    {b.title}
                  </a>
                </td>
                <td className="hidden sm:table-cell whitespace-nowrap text-gray-600">
                  {b.firstname} {b.lastname}
                </td>
                <td className="hidden lg:table-cell text-gray-500">{b.category || '—'}</td>
                <td className="hidden sm:table-cell">{b.views ?? 0}</td>
                <td>
                  <span className={`inline-block text-xs px-2 py-0.5 rounded font-medium ${
                    b.published ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {b.published ? 'Published' : 'Draft'}
                  </span>
                </td>
                {isSuperAdmin && (
                  <td>
                    <div className="flex gap-2 sm:gap-3 whitespace-nowrap">
                      <Link
                        href={`/blogs/${b.id}/edit`}
                        className="text-xs text-gray-600 hover:text-gray-900 hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => togglePublished(b.id, b.published)}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        {b.published ? 'Unpublish' : 'Publish'}
                      </button>
                      <button
                        onClick={() => deleteBlog(b.id)}
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
      <Pagination page={page} total={blogs.length} pageSize={PAGE_SIZE} onChange={setPage} />
    </div>
  );
}
