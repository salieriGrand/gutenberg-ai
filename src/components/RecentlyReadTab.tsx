'use client';

import Link from 'next/link';

interface RecentlyReadTabProps {
  supabaseHistory: any[];
}

export default function RecentlyReadTab({ supabaseHistory }: RecentlyReadTabProps) {
  const history = supabaseHistory;

  if (history.length === 0) {
    return (
      <div className="col-span-full text-center text-gray-500 py-12">
        <p className="text-lg font-medium">You haven&apos;t read any books yet.</p>
        <Link href="/?tab=explore" className="text-blue-600 hover:underline mt-2 inline-block">Start exploring the library!</Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
      {history.map((item) => (
        <Link key={item.book_id} href={`/books/${item.book_id}/read`} className="group">
          <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 h-full flex flex-col items-center border border-gray-100">
            <div className="w-32 h-48 bg-gray-200 mb-4 overflow-hidden rounded relative flex-shrink-0 shadow-inner">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.cover_url || 'https://via.placeholder.com/128x192?text=No+Cover'}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white font-bold text-sm bg-blue-600 px-3 py-1 rounded-full shadow-lg">Continue</span>
              </div>
            </div>
            <h2 className="text-lg font-semibold text-center line-clamp-2 text-gray-900 group-hover:text-blue-600 transition-colors" title={item.title}>{item.title}</h2>
            <p className="text-sm text-gray-600 text-center mt-2 font-medium">{item.author || 'Unknown Author'}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
