import type { Metadata } from 'next';
import Link from 'next/link';
import NewsletterForm from '@/components/NewsletterForm';

export const metadata: Metadata = { title: 'New Newsletter' };

export default function NewNewsletterPage() {
  return (
    <div>
      <div className="flex items-center gap-2 mb-8">
        <Link href="/newsletters" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
          ← Newsletters
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-2xl font-bold text-gray-900">New Newsletter</h1>
      </div>
      <NewsletterForm />
    </div>
  );
}
