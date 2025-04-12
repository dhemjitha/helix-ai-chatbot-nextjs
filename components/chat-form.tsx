"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { useChat } from "ai/react"
import { SendIcon, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { AutoResizeTextarea } from "@/components/autoresize-textarea"
import { useState, useEffect } from "react"

export function HelixChatForm({ className, ...props }: React.ComponentProps<"form">) {
  const { messages, input, setInput, append, isLoading } = useChat({
    api: "/api/chat",
  })

  const [showIntro, setShowIntro] = useState(true)

  // Prevent zoom on iOS devices
  useEffect(() => {
    // Add event listener to prevent zoom on iOS when focusing input
    const preventZoom = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault()
      }
    }

    document.addEventListener("touchmove", preventZoom, { passive: false })

    return () => {
      document.removeEventListener("touchmove", preventZoom)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim()) return

    void append({ content: input, role: "user" })
    setInput("")
    setShowIntro(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>)
    }
  }

  const introContent = (
    <div className="flex h-full flex-col items-center justify-center gap-6 px-4">
      <div className="flex items-center gap-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600">
          <Zap size={24} className="text-white" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
          HelixAI
        </h1>
      </div>

      <div className="max-w-md text-center">
        <p className="text-lg font-medium mb-2">Your AI-powered conversation assistant</p>
        <p className="text-gray-500 text-sm">
          Developed by Dulran Hemjitha, HelixAI helps answer questions, generate content, and solve problems.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-md">
        {[
          "Explain quantum computing",
          "Write a short poem about technology",
          "Help me plan a weekend trip",
          "Draft an email to my team",
        ].map((example) => (
          <button
            key={example}
            className="text-left p-3 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors text-sm"
            onClick={() => {
              setInput(example)
              setShowIntro(false)
              append({ content: example, role: "user" })
            }}
          >
            {example}
          </button>
        ))}
      </div>
    </div>
  )

  const messageList = (
    <div className="flex h-full flex-col gap-4 py-4 px-1">
      {messages.map((message, index) => (
        <div key={index} className={cn("flex w-full", message.role === "user" ? "justify-end" : "justify-start")}>
          <div
            className={cn(
              "max-w-[85%] rounded-2xl px-4 py-3 text-sm",
              message.role === "user"
                ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                : "bg-gray-100 text-gray-800",
            )}
          >
            {message.content}
          </div>
        </div>
      ))}
      {isLoading && (
        <div className="flex justify-start">
          <div className="bg-gray-100 rounded-2xl px-4 py-3 max-w-[85%]">
            <div className="flex gap-2">
              <span className="h-2 w-2 rounded-full bg-gray-400 animate-pulse"></span>
              <span className="h-2 w-2 rounded-full bg-gray-400 animate-pulse delay-100"></span>
              <span className="h-2 w-2 rounded-full bg-gray-400 animate-pulse delay-200"></span>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <TooltipProvider>
      <main
        className={cn("mx-auto flex h-svh max-h-svh w-full max-w-3xl flex-col border-none bg-white", className)}
        {...props}
      >
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <h2 className="font-medium">HelixAI</h2>
          </div>
          <div className="text-xs text-gray-500">by Dulran Hemjitha</div>
        </div>

        <div className="flex-1 overflow-y-auto px-4">{messages.length ? messageList : introContent}</div>

        <form onSubmit={handleSubmit} className="border-t border-gray-100 bg-white px-4 py-3">
          <div className="relative flex items-center overflow-hidden rounded-full border bg-white px-4 py-2 focus-within:ring-2 focus-within:ring-indigo-500/50">
            <AutoResizeTextarea
              onKeyDown={handleKeyDown}
              onChange={(v) => setInput(v)}
              value={input}
              placeholder="Message HelixAI..."
              className="flex-1 bg-transparent focus:outline-none max-h-32 text-sm"
              disabled={isLoading}
              style={{ fontSize: "16px" }} // Prevents iOS zoom
            />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  size="sm"
                  className={cn(
                    "ml-2 h-8 w-8 rounded-full flex items-center justify-center p-0",
                    input.trim() ? "bg-gradient-to-r from-indigo-500 to-purple-600" : "bg-gray-200 text-gray-400",
                  )}
                >
                  <SendIcon size={14} className={input.trim() ? "text-white" : ""} />
                </Button>
              </TooltipTrigger>
              <TooltipContent sideOffset={12}>Send message</TooltipContent>
            </Tooltip>
          </div>
        </form>
      </main>
    </TooltipProvider>
  )
}
