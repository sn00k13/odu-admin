import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllBlogsAdmin } from '@/lib/data';
import BlogsTable from './BlogsTable';

export const metadata: Metadata = { title: 'Blogs' };

export default async function BlogsPage() {
  const blogs = await getAllBlogsAdmin();
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Blogs</h1>
        <Link
          href="/blogs/new"
          className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded transition-colors"
        >
          + New Post
        </Link>
      </div>
      <BlogsTable initialBlogs={blogs} />
    </div>
  );
}
