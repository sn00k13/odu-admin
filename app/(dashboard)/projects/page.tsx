import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllProjectsAdmin } from '@/lib/data';
import { isSuperAdmin } from '@/lib/auth';
import ProjectsTable from './ProjectsTable';

export const metadata: Metadata = { title: 'Projects' };

export default async function ProjectsPage() {
  const [projects, isSuper] = await Promise.all([getAllProjectsAdmin(), isSuperAdmin()]);
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        {isSuper && (
          <Link
            href="/projects/new"
            className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded transition-colors"
          >
            + New Project
          </Link>
        )}
      </div>
      <ProjectsTable initialProjects={projects} isSuperAdmin={isSuper} />
    </div>
  );
}
