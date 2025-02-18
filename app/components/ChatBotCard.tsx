"use client";

import { useState, useRef } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { PaperPlaneTilt, CaretUp, CaretDown } from "@phosphor-icons/react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatBotCardProps {
  email: string;
  analysisResults?: any;
}

export default function ChatBotCard({ email, analysisResults }: ChatBotCardProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiSuggestedQuestions, setAiSuggestedQuestions] = useState<string[]>([]);

  // New state for collapse/expand
  const [collapsed, setCollapsed] = useState(false);

  const handleSend = async () => {
    if (!inputText.trim()) return;
    const newUserMessage: Message = { role: "user", content: inputText };
    setMessages((prev) => [...prev, newUserMessage]);
    setInputText("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          messages: [...messages, newUserMessage],
          analysisResults,
        }),
      });

      if (!res.ok) {
        setLoading(false);
        return;
      }

      const data = await res.json();
      if (data.reply) {
        const assistantMsg: Message = { role: "assistant", content: data.reply };
        setMessages((prev) => [...prev, assistantMsg]);
      }

      if (data.suggestedQuestions?.length) {
        setAiSuggestedQuestions(data.suggestedQuestions);
      } else {
        setAiSuggestedQuestions([]);
      }
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  const handleSuggestedQuestion = (question: string) => {
    setInputText(question);
  };

  return (
    <Card className="w-full max-w-xl rounded-md 
    shadow-[0_6px_15px_rgba(0,0,0,0.05)] 
    border-none ">
      <CardHeader className="relative">
        {/* Title & Description */}
        <div>
          <CardTitle>Explore the Master's of Innovation Design Program</CardTitle>
          <CardDescription>
            Chat with our AI to see how MID can address your skill gaps and advance your career.
          </CardDescription>
        </div>

        {/* Minimize/Expand Button - top-right corner */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <CaretDown size={20} /> : <CaretUp size={20} />}
        </Button>
      </CardHeader>

      {/* Animated container for the card content */}
      <div
        className={`
          overflow-hidden transition-all duration-300 
          ${collapsed ? "max-h-0" : "max-h-[1000px]"}
        `}
      >
        <CardContent>
          {/* Chat messages container */}
          <div className="max-h-84 overflow-y-auto border rounded-xl p-2 mb-4">
            {/* If no messages yet, show initial suggestions */}
            {messages.length === 0 && (
              <div className="mb-2 flex justify-start">
                <div className="p-2 rounded-xl max-w-[70%] bg-gray-100 text-green-700">
                  <p className="text-sm mb-1">Try asking one of these:</p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleSuggestedQuestion("How might the Master's of Innovation Design help me?")
                      }
                    >
                      How might the MID help me?
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleSuggestedQuestion("What makes the MID different from other programs?")
                      }
                    >
                      What makes MID different?
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleSuggestedQuestion("Which skills does the MID focus on improving?")
                      }
                    >
                      Which skills does the MID improve?
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Existing conversation */}
            {messages.map((msg, idx) => {
              const isAssistant = msg.role === "assistant";
              return (
                <div
                  key={idx}
                  className={`mb-2 flex ${isAssistant ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`
                      p-3 rounded-xl max-w-[70%]
                      text-base leading-relaxed
                      ${isAssistant
                        ? "bg-gray-100 text-gray-800"
                        : "bg-blue-500 text-white"
                      }
                    `}
                  >
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                </div>
              );
            })}

            {loading && <p className="text-sm text-gray-500">Thinking...</p>}

            {/* If the AI suggests more questions after a response */}
            {aiSuggestedQuestions.length > 0 && (
              <div className="mt-2 flex justify-start">
                <div className="p-2 rounded-xl w-full bg-gray-100 text-green-700">
                  <p className="text-sm mb-1">You might also ask:</p>
                  <div className="flex flex-wrap gap-2">
                    {aiSuggestedQuestions.map((q, i) => (
                      <Button
                        key={i}
                        className="max-w-[200px] h-full p-2 whitespace-normal break-words"
                        variant="outline"
                        size="sm"
                        onClick={() => handleSuggestedQuestion(q)}
                      >
                        {q}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input area */}
          <div className="flex gap-2">
            <Input
              className="rounded-xl"
              placeholder="Ask about your skills..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
            />
            <Button className="rounded-xl" onClick={handleSend} disabled={loading}>
              <PaperPlaneTilt size={32} />
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}