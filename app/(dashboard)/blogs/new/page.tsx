import type { Metadata } from 'next';
import Link from 'next/link';
import BlogForm from '@/components/BlogForm';

export const metadata: Metadata = { title: 'New Blog Post' };

export default function NewBlogPage() {
  return (
    <div>
      <div className="flex items-center gap-2 mb-8">
        <Link href="/blogs" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
          ← Blogs
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-2xl font-bold text-gray-900">New Post</h1>
      </div>
      <BlogForm />
    </div>
  );
}
