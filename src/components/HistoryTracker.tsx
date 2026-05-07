'use client';

import { useEffect } from 'react';

interface HistoryTrackerProps {
  book: {
    id: number;
    title: string;
    authors: Array<{ name: string }>;
    formats: Record<string, string>;
  };
}

export default function HistoryTracker({ book }: HistoryTrackerProps) {
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('gutenberg_history') || '[]');
    
    const newEntry = {
      book_id: book.id,
      title: book.title,
      author: book.authors?.map(a => a.name).join(', ') || 'Unknown Author',
      cover_url: book.formats['image/jpeg'] || '',
      last_read_at: new Date().toISOString()
    };

    // Remove existing entry for this book if it exists
    const filteredHistory = history.filter((item: any) => item.book_id !== book.id);
    
    // Add new entry to the top
    const updatedHistory = [newEntry, ...filteredHistory].slice(0, 12); // Keep last 12
    
    localStorage.setItem('gutenberg_history', JSON.stringify(updatedHistory));
  }, [book]);

  return null;
}
