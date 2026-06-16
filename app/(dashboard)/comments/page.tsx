import type { Metadata } from 'next';
import { getAllComments } from '@/lib/data';
import { isSuperAdmin } from '@/lib/auth';
import CommentsTable from './CommentsTable';

export const metadata: Metadata = { title: 'Comments' };

export default async function CommentsPage() {
  const [comments, isSuper] = await Promise.all([getAllComments(), isSuperAdmin()]);
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Comments</h1>
      <CommentsTable initialComments={comments} isSuperAdmin={isSuper} />
    </div>
  );
}
