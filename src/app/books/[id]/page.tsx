import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';

export default async function BookDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const res = await fetch(`https://gutendex.com/books/${id}`);

  if (!res.ok) {
    if (res.status === 404) {
      notFound();
    }
    throw new Error('Failed to fetch book data');
  }

  const book = await res.json();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="flex flex-col items-center min-h-screen p-8 bg-gray-50 text-black">
      <main className="w-full max-w-5xl flex flex-col gap-8 bg-white p-8 rounded-xl shadow-sm">
        <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
          &larr; Back to Library
        </Link>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-shrink-0 flex justify-center md:justify-start">
            <div className="w-64 h-96 bg-gray-200 overflow-hidden rounded-lg shadow-md relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={book.formats['image/jpeg'] || 'https://via.placeholder.com/256x384?text=No+Cover'}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="flex flex-col flex-1 gap-4">
            <h1 className="text-4xl font-bold">{book.title}</h1>

            <div>
              <h2 className="text-xl font-semibold text-gray-900">Author(s)</h2>
              <p className="text-lg text-gray-900">
                {book.authors?.map((a: { name: string }) => a.name).join(', ') || 'Unknown Author'}
              </p>
            </div>

            {book.subjects && book.subjects.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Subjects</h2>
                <div className="flex flex-wrap gap-2 mt-2">
                  {book.subjects.map((subject: string, idx: number) => (
                    <span key={idx} className="bg-gray-200 px-3 py-1 rounded-full text-sm text-gray-800 border border-gray-300">
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {book.summaries && book.summaries.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Summary</h2>
                <p className="text-gray-900 leading-relaxed mt-2 whitespace-pre-line">
                  {book.summaries[0]}
                </p>
              </div>
            )}

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mt-4 mb-2">Read Online</h2>
              {user ? (
                <Link
                  href={`/books/${id}/read`}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-block font-semibold shadow-sm"
                >
                  Read Book & Chat
                </Link>
              ) : (
                <div className="bg-gray-100 p-4 rounded-lg inline-block border border-gray-200">
                  <p className="text-gray-800 mb-3 font-medium">Login to read this book online and discuss it with our AI.</p>
                  <Link href="/login" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors inline-block text-sm font-semibold">
                    Log In to Read
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
