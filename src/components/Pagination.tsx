'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useTransition } from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  searchQuery: string;
}

export default function Pagination({ currentPage, totalPages, searchQuery }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [jumpPage, setJumpPage] = useState(currentPage.toString());
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setJumpPage(currentPage.toString());
  }, [currentPage]);

  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', pageNumber.toString());
    if (searchQuery) {
      params.set('query', searchQuery);
    }
    return `/?${params.toString()}`;
  };

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      startTransition(() => {
        router.push(createPageUrl(pageNumber));
      });
    }
  };

  const handleJumpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(jumpPage, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      handlePageChange(pageNum);
    } else {
      setJumpPage(currentPage.toString());
    }
  };

  if (totalPages <= 1) return null;

  // Calculate visible page numbers
  const getVisiblePages = () => {
    const pages = [];
    const maxVisible = 5;
    
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    if (end === totalPages) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className={`flex flex-col items-center gap-6 mt-12 w-full max-w-5xl transition-opacity duration-200 ${isPending ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
      <div className="flex items-center gap-2">
        {/* Previous Button */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1 || isPending}
          className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          aria-label="Previous Page"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {visiblePages[0] > 1 && (
            <>
              <button
                onClick={() => handlePageChange(1)}
                disabled={isPending}
                className="w-10 h-10 rounded-lg flex items-center justify-center border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm text-sm font-medium"
              >
                1
              </button>
              {visiblePages[0] > 2 && <span className="px-1 text-gray-400">...</span>}
            </>
          )}

          {visiblePages.map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              disabled={isPending}
              className={`w-10 h-10 rounded-lg flex items-center justify-center border transition-all shadow-sm text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50 ${
                currentPage === page
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}

          {visiblePages[visiblePages.length - 1] < totalPages && (
            <>
              {visiblePages[visiblePages.length - 1] < totalPages - 1 && <span className="px-1 text-gray-400">...</span>}
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={isPending}
                className="w-10 h-10 rounded-lg flex items-center justify-center border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm text-sm font-medium"
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        {/* Next Button */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages || isPending}
          className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          aria-label="Next Page"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>

      {/* Jump to Page Input */}
      <form onSubmit={handleJumpSubmit} className="flex items-center gap-3">
        <label htmlFor="jump-page" className="text-sm font-medium text-gray-600">
          Jump to page:
        </label>
        <div className="flex gap-2">
          <input
            id="jump-page"
            type="text"
            value={jumpPage}
            onChange={(e) => setJumpPage(e.target.value)}
            className="w-16 border border-gray-300 rounded-lg p-1.5 text-center text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="No."
          />
          <button
            type="submit"
            className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-lg hover:bg-blue-100 font-semibold text-sm transition-colors border border-blue-100"
          >
            Go
          </button>
        </div>
        <span className="text-sm text-gray-500 font-medium">
          of {totalPages}
        </span>
      </form>
    </div>
  );
}
