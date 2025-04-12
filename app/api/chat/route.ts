import { type CoreMessage, streamText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"

export async function POST(req: Request) {
  const { messages }: { messages: CoreMessage[] } = await req.json()

  const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: "You are a helpful assistant.",
    messages,
  })

  return result.toDataStreamResponse()
}
