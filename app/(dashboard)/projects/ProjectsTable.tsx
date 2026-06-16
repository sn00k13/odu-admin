'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Project } from '@/lib/types';
import Pagination from '@/components/Pagination';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://theoduproject.com';
const PAGE_SIZE = 10;

export default function ProjectsTable({
  initialProjects,
  isSuperAdmin,
}: {
  initialProjects: Project[];
  isSuperAdmin: boolean;
}) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [page, setPage] = useState(0);

  const pageProjects = projects.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  async function togglePublished(id: number, current: boolean) {
    const res = await fetch(`/api/projects/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !current }),
    });
    if (res.ok) {
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, published: !current } : p)),
      );
    }
  }

  async function deleteProject(id: number) {
    if (!confirm('Delete this project? This cannot be undone.')) return;
    const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setProjects((prev) => prev.filter((p) => p.id !== id));
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
              <th className="hidden sm:table-cell">Category</th>
              <th>Status</th>
              {isSuperAdmin && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {pageProjects.length === 0 && (
              <tr>
                <td colSpan={isSuperAdmin ? 4 : 3} className="text-center text-gray-400 py-8">
                  No projects found.
                </td>
              </tr>
            )}
            {pageProjects.map((p) => (
              <tr key={p.id}>
                <td>
                  <a
                    href={`${SITE_URL}/projects/${p.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-900 font-medium hover:text-red-600 transition-colors line-clamp-1 block max-w-52 sm:max-w-xs lg:max-w-sm"
                  >
                    {p.title}
                  </a>
                </td>
                <td className="hidden sm:table-cell text-gray-500">{p.category || '—'}</td>
                <td>
                  <span className={`inline-block text-xs px-2 py-0.5 rounded font-medium ${
                    p.published ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {p.published ? 'Published' : 'Draft'}
                  </span>
                </td>
                {isSuperAdmin && (
                  <td>
                    <div className="flex gap-2 sm:gap-3 whitespace-nowrap">
                      <Link
                        href={`/projects/${p.id}/edit`}
                        className="text-xs text-gray-600 hover:text-gray-900 hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => togglePublished(p.id, p.published)}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        {p.published ? 'Unpublish' : 'Publish'}
                      </button>
                      <button
                        onClick={() => deleteProject(p.id)}
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
      <Pagination page={page} total={projects.length} pageSize={PAGE_SIZE} onChange={setPage} />
    </div>
  );
}
