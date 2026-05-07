'use server'

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function recordReadingProgress(
  bookId: number,
  title: string,
  author: string,
  coverUrl: string
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: 'Not authenticated' };

  const { error } = await supabase
    .from('reading_history')
    .upsert({
      user_id: user.id,
      book_id: bookId,
      title,
      author,
      cover_url: coverUrl,
      last_read_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id, book_id'
    });

  if (error) {
    console.error('Error recording reading progress:', error);
    return { error: error.message };
  }

  revalidatePath('/');
  return { success: true };
}
