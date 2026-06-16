import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { isSuperAdmin } from '@/lib/auth';
import ProjectForm from '@/components/ProjectForm';

export const metadata: Metadata = { title: 'New Project' };

export default async function NewProjectPage() {
  if (!(await isSuperAdmin())) redirect('/projects');

  return (
    <div>
      <div className="flex items-center gap-2 mb-8">
        <Link href="/projects" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
          ← Projects
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-2xl font-bold text-gray-900">New Project</h1>
      </div>
      <ProjectForm />
    </div>
  );
}
