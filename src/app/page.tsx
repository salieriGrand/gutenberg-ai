import Link from 'next/link';
import { getCachedBooks, setCachedBooks } from '@/utils/cache';
import Pagination from '@/components/Pagination';
import RecentlyReadTab from '@/components/RecentlyReadTab';

import { createClient } from '@/utils/supabase/server';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; page?: string; tab?: string }>;
}) {
  const { query, page, tab } = await searchParams;
  const searchQuery = query || '';
  const currentPage = parseInt(page || '1', 10);
  const activeTab = tab || 'explore';
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let books = [];
  let count = 0;
  let recentlyRead: any[] = [];

  if (user) {
    const { data } = await supabase
      .from('reading_history')
      .select('*')
      .order('last_read_at', { ascending: false });
    recentlyRead = data || [];
  }

  if (activeTab === 'explore' || searchQuery) {
    if (!searchQuery && currentPage === 1) {
      const cachedData = await getCachedBooks();
      if (cachedData) {
        books = cachedData;
      }
    }

    if (books.length === 0) {
      const baseUrl = 'https://gutendex.com/books/';
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (currentPage > 1) params.append('page', currentPage.toString());
      
      const url = `${baseUrl}${params.toString() ? `?${params.toString()}` : ''}`;
      const res = await fetch(url);
      const data = await res.json();
      books = data.results || [];
      count = data.count || 0;

      if (!searchQuery && currentPage === 1 && books.length > 0) {
        await setCachedBooks(books);
      }
    } else {
      const res = await fetch('https://gutendex.com/books/');
      const data = await res.json();
      count = data.count || 0;
    }
  }

  const totalPages = Math.ceil(count / 32);

  return (
    <div className="flex flex-col items-center min-h-screen p-8 pb-20 gap-8 bg-gray-50 text-black">
      <main className="w-full max-w-5xl flex flex-col gap-8 items-center">
        <h1 className="text-4xl font-bold text-center">Project Gutenberg Library</h1>

        <form className="w-full max-w-md flex gap-2">
          <input
            type="text"
            name="query"
            defaultValue={searchQuery}
            placeholder="Search for books, authors..."
            className="flex-1 border border-gray-300 p-2 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-semibold shadow-sm transition-colors">
            Search
          </button>
        </form>

        {user && !searchQuery && (
          <div className="flex gap-4 border-b border-gray-200 w-full">
            <Link 
              href="/?tab=explore" 
              className={`pb-2 px-4 font-semibold transition-colors ${activeTab === 'explore' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Explore Library
            </Link>
            <Link 
              href="/?tab=recent" 
              className={`pb-2 px-4 font-semibold transition-colors ${activeTab === 'recent' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Recently Read ({recentlyRead.length})
            </Link>
          </div>
        )}

        {activeTab === 'recent' && !searchQuery ? (
          <RecentlyReadTab supabaseHistory={recentlyRead} />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
              {books.map((book: any) => (
                <Link key={book.id} href={`/books/${book.id}`} className="group">
                  <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 h-full flex flex-col items-center border border-gray-100">
                    <div className="w-32 h-48 bg-gray-200 mb-4 overflow-hidden rounded relative flex-shrink-0 shadow-inner">
                      <img
                        src={book.formats['image/jpeg'] || 'https://via.placeholder.com/128x192?text=No+Cover'}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <h2 className="text-lg font-semibold text-center line-clamp-2 text-gray-900 group-hover:text-blue-600 transition-colors" title={book.title}>{book.title}</h2>
                    <p className="text-sm text-gray-600 text-center mt-2 font-medium">
                      {book.authors?.map((a: { name: string }) => a.name).join(', ') || 'Unknown Author'}
                    </p>
                  </div>
                </Link>
              ))}
              {books.length === 0 && (
                <div className="col-span-full text-center text-gray-600 font-medium py-12">
                  No books found for &quot;{searchQuery}&quot;
                </div>
              )}
            </div>

            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              searchQuery={searchQuery} 
            />
          </>
        )}
      </main>
    </div>
  );
}
