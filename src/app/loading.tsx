export default function Loading() {
  return (
    <div className="flex flex-col items-center min-h-screen p-8 gap-8 bg-gray-50 text-black">
      <main className="w-full max-w-5xl flex flex-col gap-8 items-center animate-pulse">
        <div className="h-12 w-3/4 bg-gray-200 rounded-lg"></div>
        
        <div className="w-full max-w-md h-12 bg-gray-200 rounded-lg"></div>

        <div className="flex gap-4 border-b border-gray-200 w-full pb-2">
          <div className="h-6 w-32 bg-gray-200 rounded"></div>
          <div className="h-6 w-32 bg-gray-200 rounded"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-4 h-80 flex flex-col items-center border border-gray-100">
              <div className="w-32 h-48 bg-gray-200 mb-4 rounded shadow-inner"></div>
              <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
