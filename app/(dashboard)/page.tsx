import type { Metadata } from 'next';
import { getAllBlogsAdmin, getAllComments } from '@/lib/data';
import { FileText, MessageSquare, Eye, Heart } from 'lucide-react';

export const metadata: Metadata = { title: 'Overview' };

export default async function OverviewPage() {
  const [blogs, comments] = await Promise.all([
    getAllBlogsAdmin(),
    getAllComments(),
  ]);

  const totalViews = blogs.reduce((sum, b) => sum + (b.views ?? 0), 0);
  const totalLikes = blogs.reduce((sum, b) => sum + (b.likes ?? 0), 0);
  const published = blogs.filter((b) => b.published).length;

  const stats = [
    { label: 'Total Blogs', value: blogs.length, sub: `${published} published`, icon: FileText },
    { label: 'Comments', value: comments.length, sub: 'All time', icon: MessageSquare },
    { label: 'Total Views', value: totalViews.toLocaleString(), sub: 'Across all posts', icon: Eye },
    { label: 'Total Likes', value: totalLikes.toLocaleString(), sub: 'Across all posts', icon: Heart },
  ];

  const recentBlogs = blogs.slice(0, 5);
  const recentComments = comments.slice(0, 5);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Overview</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="bg-white border border-gray-100 rounded p-5 shadow-sm">
            <div className="flex items-center gap-2 text-gray-400 mb-3">
              <s.icon size={16} />
              <span className="text-xs font-medium uppercase tracking-wide">{s.label}</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-400 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Blogs</h2>
          <div className="bg-white border border-gray-100 rounded shadow-sm overflow-hidden">
            <table className="admin-table w-full text-sm">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Views</th>
                </tr>
              </thead>
              <tbody>
                {recentBlogs.map((b) => (
                  <tr key={b.id}>
                    <td className="max-w-[200px] truncate">{b.title}</td>
                    <td>
                      <span className={`inline-block text-xs px-2 py-0.5 rounded font-medium ${
                        b.published ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {b.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td>{b.views ?? 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Comments</h2>
          <div className="bg-white border border-gray-100 rounded shadow-sm overflow-hidden">
            <table className="admin-table w-full text-sm">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Comment</th>
                </tr>
              </thead>
              <tbody>
                {recentComments.map((c) => (
                  <tr key={c.id}>
                    <td className="whitespace-nowrap">{c.name}</td>
                    <td className="max-w-[240px] truncate text-gray-500">{c.text}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
