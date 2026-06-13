'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Blog } from '@/lib/types';
import BlogEditor from './BlogEditor';
import CloudinaryUpload from './CloudinaryUpload';

const CATEGORIES = [
  'Agriculture', 'Culture', 'Community',
  'Sustainability', 'Events', 'Research', 'Other',
];

interface Props {
  initialData?: Blog;
}

export default function BlogForm({ initialData }: Props) {
  const router = useRouter();
  const isEdit = Boolean(initialData);

  const [title, setTitle]         = useState(initialData?.title ?? '');
  const [content, setContent]     = useState(initialData?.content ?? '');
  const [image, setImage]         = useState(initialData?.image ?? '');
  const [category, setCategory]   = useState(initialData?.category ?? '');
  const [firstname, setFirstname] = useState(initialData?.firstname ?? '');
  const [lastname, setLastname]   = useState(initialData?.lastname ?? '');
  const [published, setPublished] = useState(initialData?.published ?? false);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      title:     title.trim(),
      content,
      image:     image.trim(),
      category:  category.trim(),
      firstname: firstname.trim(),
      lastname:  lastname.trim(),
      published,
    };

    const res = isEdit
      ? await fetch(`/api/blogs/${initialData!.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      : await fetch('/api/blogs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

    if (res.ok) {
      router.push('/blogs');
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? 'Something went wrong. Please try again.');
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Enter blog title"
          className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      {/* Author */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
          <input
            type="text"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
          <input
            type="text"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          list="category-list"
          placeholder="e.g. Agriculture"
          className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <datalist id="category-list">
          {CATEGORIES.map((c) => <option key={c} value={c} />)}
        </datalist>
      </div>

      {/* Cover Image */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
        <CloudinaryUpload value={image} onChange={setImage} />
      </div>

      {/* Content */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
        <BlogEditor content={content} onChange={setContent} />
      </div>

      {/* Published toggle */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setPublished((v) => !v)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 ${
            published ? 'bg-red-600' : 'bg-gray-200'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
              published ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
        <span className="text-sm font-medium text-gray-700">
          {published ? 'Published' : 'Draft — not visible on the public site'}
        </span>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-4 py-2">{error}</p>
      )}

      <div className="flex gap-3 pt-2 border-t border-gray-100">
        <button
          type="submit"
          disabled={saving}
          className="bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-semibold px-6 py-2 rounded text-sm transition-colors"
        >
          {saving ? 'Saving…' : isEdit ? 'Update Post' : 'Create Post'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold px-6 py-2 rounded text-sm transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
