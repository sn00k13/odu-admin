import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getSingleNewsletter } from '@/lib/data';
import { isSuperAdmin } from '@/lib/auth';
import NewsletterForm from '@/components/NewsletterForm';

export const metadata: Metadata = { title: 'Edit Newsletter' };

export default async function EditNewsletterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await isSuperAdmin())) redirect('/newsletters');

  const { id } = await params;
  const newsletter = await getSingleNewsletter(Number(id));
  if (!newsletter) notFound();

  return (
    <div>
      <div className="flex items-center gap-2 mb-8">
        <Link href="/newsletters" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
          ← Newsletters
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-2xl font-bold text-gray-900 truncate max-w-lg">{newsletter.title}</h1>
      </div>
      <NewsletterForm initialData={newsletter} />
    </div>
  );
}
