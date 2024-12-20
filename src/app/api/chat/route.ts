import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText } from 'ai';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY
});

const model = google('gemini-1.5-flash'); 

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Intercepts the message and send it to the vercel ai sdk to stream a response 
export const POST = async (req: Request) => {
  const { messages } = await req.json();

  const result = streamText({
    model,
    messages
  });

  return result.toDataStreamResponse();
}

