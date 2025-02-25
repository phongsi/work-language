import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://api.targon.com/v1",
  apiKey: process.env.TARGON_API_KEY,
});

export async function POST(req) {
  try {
    const { messages } = await req.json();
    const stream = await client.chat.completions.create({
      model: "deepseek-ai/DeepSeek-R1",
      stream: true,
      messages,
      temperature: 0.7,
      max_tokens: 256,
      top_p: 0.1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          controller.enqueue(
            encoder.encode(chunk.choices[0]?.delta?.content || ""),
          );
        }
        controller.close();
      },
    });

    return new Response(readableStream, {
      headers: { "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    return Response.json(
      { error: "Failed to generate response" },
      { status: 500 },
    );
  }
}
