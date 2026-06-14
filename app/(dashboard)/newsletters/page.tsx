import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllNewslettersAdmin } from '@/lib/data';
import NewslettersTable from './NewslettersTable';

export const metadata: Metadata = { title: 'Newsletters' };

export default async function NewslettersPage() {
  const newsletters = await getAllNewslettersAdmin();
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Newsletters</h1>
        <Link
          href="/newsletters/new"
          className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded transition-colors"
        >
          + New Newsletter
        </Link>
      </div>
      <NewslettersTable initialNewsletters={newsletters} />
    </div>
  );
}
