import type { Metadata } from 'next';
import { getAllSubscribers } from '@/lib/data';
import SubscribersTable from './SubscribersTable';

export const metadata: Metadata = { title: 'Subscribers' };

export default async function SubscribersPage() {
  const subscribers = await getAllSubscribers();
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Subscribers</h1>
        <p className="text-sm text-gray-500 mt-1">People who signed up via the public site.</p>
      </div>
      <SubscribersTable initialSubscribers={subscribers} />
    </div>
  );
}
