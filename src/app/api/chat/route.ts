import { streamText, Message } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createClient } from '@/utils/supabase/server';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GEMINI_API_KEY,
});

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { messages, bookContext } = await req.json();

  const systemMessage: Message = {
    id: 'system',
    role: 'system',
    content: `You are a helpful, knowledgeable AI assistant for an online library.
You are currently discussing the following book:
Title: ${bookContext.title || 'Unknown Title'}
Author: ${bookContext.authors?.map((a: { name: string }) => a.name).join(', ') || 'Unknown Author'}
Summary: ${bookContext.summaries?.[0] || 'No summary available.'}

Answer user questions about this book based on the provided context and your general knowledge. Be conversational, polite, and concise.`,
  };

  const coreMessages = [systemMessage, ...messages];

  const result = await streamText({
    model: google('models/gemini-3.1-flash-lite-preview'),
    messages: coreMessages,
  });

  return result.toAIStreamResponse();
}
