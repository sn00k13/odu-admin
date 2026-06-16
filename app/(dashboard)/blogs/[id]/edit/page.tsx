import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getSingleBlog } from '@/lib/data';
import { isSuperAdmin } from '@/lib/auth';
import BlogForm from '@/components/BlogForm';

export const metadata: Metadata = { title: 'Edit Blog Post' };

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await isSuperAdmin())) redirect('/blogs');

  const { id } = await params;
  const blog = await getSingleBlog(Number(id));
  if (!blog) notFound();

  return (
    <div>
      <div className="flex items-center gap-2 mb-8">
        <Link href="/blogs" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
          ← Blogs
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-2xl font-bold text-gray-900 truncate max-w-lg">{blog.title}</h1>
      </div>
      <BlogForm initialData={blog} />
    </div>
  );
}
