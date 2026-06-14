'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Project } from '@/lib/types';
import BlogEditor from './BlogEditor';
import CloudinaryUpload from './CloudinaryUpload';

const CATEGORIES = [
  'Agriculture', 'Community', 'Culture',
  'Sustainability', 'Education', 'Health', 'Other',
];

interface Props {
  initialData?: Project;
}

export default function ProjectForm({ initialData }: Props) {
  const router = useRouter();
  const isEdit = Boolean(initialData);

  const [title, setTitle]             = useState(initialData?.title ?? '');
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [content, setContent]         = useState(initialData?.content ?? '');
  const [image, setImage]             = useState(initialData?.image ?? '');
  const [category, setCategory]       = useState(initialData?.category ?? '');
  const [published, setPublished]     = useState(initialData?.published ?? false);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      title:       title.trim(),
      description: description.trim(),
      content,
      image:       image.trim(),
      category:    category.trim(),
      published,
    };

    const res = isEdit
      ? await fetch(`/api/projects/${initialData!.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      : await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

    if (res.ok) {
      router.push('/projects');
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
          placeholder="Enter project title"
          className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Short Description *</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={3}
          placeholder="A brief summary shown on project cards (1–2 sentences)"
          className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          list="project-category-list"
          placeholder="e.g. Agriculture"
          className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <datalist id="project-category-list">
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
          {saving ? 'Saving…' : isEdit ? 'Update Project' : 'Create Project'}
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
