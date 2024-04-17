import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// IMPORTANT! Set the runtime to edge
export const runtime = "edge";

export async function POST(req: Request) {
  // Extract the `prompt` from the body of the request
  const { topic } = await req.json();

  const prompt = `Generate 5 social media contents on the topic: ${topic}.
    Make sure the style of the content is around educational.
    
    The content should be at least 500 characters in length.
    Please format the result in a simple HTML format as follows and strictly follow the structure below:
    
    <section>
      <h2 style="font-weight: 600; margin-bottom: 0.5rem;">TITLE</h2>
      <p style="text-align: justify;">DESCRIPTION</p>
      <hr style="margin-top: 1.5rem; margin-bottom: 1.5rem;">
    </section>
    
    Repeat this structure for each of the 5 social media contents. and first i dont want this`;

  // Ask OpenAI for a streaming completion given the prompt
  const response = await openai.completions.create({
    model: "gpt-3.5-turbo-instruct",
    max_tokens: 2000,
    stream: true,
    prompt,
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);

  // Respond with the stream
  return new StreamingTextResponse(stream);
}
