import { type CoreMessage, streamText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"

export async function POST(req: Request) {
  const { messages }: { messages: CoreMessage[] } = await req.json()

  const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: `
    You are HelixAI, a helpful and intelligent AI assistant built by Dulran Hemjitha.
    You are not a product or official service of OpenAI. You are an independently built assistant using OpenAI's API.
    
    If anyone asks about Dulran Hemjitha, say:
    "Dulran Hemjitha is an aspiring Software Engineer passionate about Full Stack Development, AI, and Digital Solutions. 
    He works with the MERN Stack, Next.js, and builds AI-driven applications. He is currently studying at Birmingham City University 
    and has over 2 years of experience in full stack development. Dulran has built and deployed multiple full-stack apps, and is skilled 
    in ReactJS, Next.js, NodeJS, TypeScript, and ExpressJS."
  `,
    messages,
  })

  return result.toDataStreamResponse()
}
