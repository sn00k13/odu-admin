'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Newsletter } from '@/lib/types';
import BlogEditor from './BlogEditor';

interface Props {
  initialData?: Newsletter;
}

export default function NewsletterForm({ initialData }: Props) {
  const router = useRouter();
  const isEdit = Boolean(initialData);

  const [title, setTitle]       = useState(initialData?.title ?? '');
  const [subject, setSubject]   = useState(initialData?.subject ?? '');
  const [content, setContent]   = useState(initialData?.content ?? '');
  const [published, setPublished] = useState(initialData?.published ?? false);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      title:     title.trim(),
      subject:   subject.trim(),
      content,
      published,
    };

    const res = isEdit
      ? await fetch(`/api/newsletters/${initialData!.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      : await fetch('/api/newsletters', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

    if (res.ok) {
      router.push('/newsletters');
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? 'Something went wrong. Please try again.');
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">

      {/* Internal title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Internal name, e.g. June 2026 Update"
          className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <p className="text-xs text-gray-400 mt-1">Used only internally — not shown to subscribers.</p>
      </div>

      {/* Email subject */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email Subject *</label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
          placeholder="What subscribers will see in their inbox"
          className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
        />
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
          {published ? 'Published' : 'Draft'}
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
          {saving ? 'Saving…' : isEdit ? 'Update Newsletter' : 'Create Newsletter'}
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
