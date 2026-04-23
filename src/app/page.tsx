import Link from 'next/link';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const { query } = await searchParams;
  const searchQuery = query || '';

  const url = searchQuery
    ? `https://gutendex.com/books/?search=${encodeURIComponent(searchQuery)}`
    : `https://gutendex.com/books/`;

  const res = await fetch(url);
  const data = await res.json();
  const books = data.results || [];

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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
          {books.map((book: { id: string | number; title: string; formats: Record<string, string>; authors: Array<{ name: string }> }) => (
            <Link key={book.id} href={`/books/${book.id}`} className="group">
              <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 h-full flex flex-col items-center border border-gray-100">
                <div className="w-32 h-48 bg-gray-200 mb-4 overflow-hidden rounded relative flex-shrink-0 shadow-inner">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
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
      </main>
    </div>
  );
}
