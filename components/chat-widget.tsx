"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mic, Send, MicOff } from "lucide-react"

interface ChatWidgetProps {
  pageText: string
}

interface Message {
  role: "user" | "assistant"
  content: string
}

export function ChatWidget({ pageText }: ChatWidgetProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I can answer questions about this page. What would you like to know?",
    },
  ])
  const [input, setInput] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // Simulate API call to PlayAI Agent
    setTimeout(() => {
      const assistantMessage: Message = {
        role: "assistant",
        content: `I'm analyzing the content about: "${pageText.substring(0, 50)}..."`,
      }
      setMessages((prev) => [...prev, assistantMessage])
    }, 1000)
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)

    // This would be replaced with actual speech recognition
    if (!isRecording) {
      // Start recording
      setTimeout(() => {
        setInput("What is this page about?")
        setIsRecording(false)
      }, 2000)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto mb-4 space-y-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex space-x-2">
        <Button variant={isRecording ? "destructive" : "outline"} size="icon" onClick={toggleRecording}>
          {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </Button>

        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about this page..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage()
            }
          }}
        />

        <Button onClick={handleSendMessage} disabled={!input.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

