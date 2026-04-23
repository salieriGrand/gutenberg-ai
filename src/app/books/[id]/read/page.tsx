import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import Chat from '@/components/Chat';
import { createClient } from '@/utils/supabase/server';

export default async function ReadBookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const res = await fetch(`https://gutendex.com/books/${id}`);

  if (!res.ok) {
    if (res.status === 404) {
      notFound();
    }
    throw new Error('Failed to fetch book data');
  }

  const book = await res.json();

  // Find the HTML format URL to embed
  const htmlFormatUrl = Object.entries(book.formats).find(([format, url]) =>
    typeof url === 'string' && format.includes('text/html')
  )?.[1] as string | undefined;

  if (!htmlFormatUrl) {
    return (
      <div className="flex flex-col items-center min-h-screen p-8 bg-gray-50 text-black">
        <main className="w-full h-[calc(100vh-4rem)] flex flex-col gap-4 bg-white p-8 rounded-xl shadow-sm">
           <Link href={`/books/${id}`} className="text-blue-600 hover:underline mb-4 inline-block">
            &larr; Back to Book Details
          </Link>
          <div className="flex-1 flex items-center justify-center">
            <p className="text-xl text-gray-600">Sorry, HTML format is not available for this book to read online.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left side: Book Content in iframe */}
      <div className="flex-1 flex flex-col border-r h-screen overflow-hidden">
        <div className="p-4 border-b bg-white flex items-center gap-4">
          <Link href={`/books/${id}`} className="text-blue-600 hover:underline">
            &larr; Back
          </Link>
          <h1 className="text-xl font-bold truncate flex-1 text-gray-900">{book.title}</h1>
        </div>
        <iframe
          src={htmlFormatUrl}
          className="w-full flex-1 border-none"
          title={`Read ${book.title}`}
          sandbox="allow-same-origin allow-scripts"
        />
      </div>

      {/* Right side: Chatbot */}
      <div className="w-[400px] flex flex-col h-screen bg-white">
        <div className="p-4 border-b bg-white">
          <h2 className="text-lg font-semibold text-gray-900">Discuss this Book</h2>
        </div>
        <div className="flex-1 p-4 overflow-hidden bg-gray-50">
           <Chat bookContext={book} />
        </div>
      </div>
    </div>
  );
}
