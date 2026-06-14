import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSingleProject } from '@/lib/data';
import ProjectForm from '@/components/ProjectForm';

export const metadata: Metadata = { title: 'Edit Project' };

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getSingleProject(Number(id));
  if (!project) notFound();

  return (
    <div>
      <div className="flex items-center gap-2 mb-8">
        <Link href="/projects" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
          ← Projects
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-2xl font-bold text-gray-900 truncate max-w-lg">{project.title}</h1>
      </div>
      <ProjectForm initialData={project} />
    </div>
  );
}
