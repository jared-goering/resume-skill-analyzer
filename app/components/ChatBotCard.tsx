"use client";

import { useState } from "react";
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

  // 1) Shared classes for suggested question buttons
  const suggestedBtnClasses = `
    border-brandBlue text-brandBlue border-dashed
    shadow-none hover:border-solid hover:bg-white 
    hover:text-brandBlue 
    dark:hover:bg-[#514C5D]
    dark:bg-[#514C5D]
    max-w-[200px] h-full p-2 
    whitespace-normal break-words
  `;

  return (
    <Card
      className="
        w-full max-w-xl 
        rounded-md 
        shadow-[0_6px_15px_rgba(0,0,0,0.05)] 
        border border-gray-200 
        bg-white 
        text-black 
        dark:border-none 
        dark:bg-gradient-to-b dark:from-[#433F4D] dark:to-[#302D39]
        dark:text-gray-100
      "
    >
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
        <CardContent className="rounded-md">
          {/* Chat messages container */}
          <div
            className="
              max-h-84 overflow-y-auto 
              border border-gray-200 
              rounded-xl p-2 mb-4
              bg-gray-50 
              dark:border-gray-600
              dark:bg-[#3B3744]
            "
          >
            {/* If no messages yet, show initial suggestions */}
            {messages.length === 0 && (
              <div className="mb-2 flex justify-start rounded-md">
                <div
                  className="
                    p-2 rounded-xl max-w-[70%] 
                    bg-gray-100 text-brandBlue
                    dark:bg-[#514C5D] dark:text-brandBlue
                  "
                >
                  <p className="text-sm mb-1">Try asking one of these:</p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      className={suggestedBtnClasses}
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleSuggestedQuestion("How might the Master's of Innovation Design help me?")
                      }
                    >
                      How might the MID help me?
                    </Button>
                    <Button
                      className={suggestedBtnClasses}
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleSuggestedQuestion("What makes the MID different from other programs?")
                      }
                    >
                      What makes MID different?
                    </Button>
                    <Button
                      className={suggestedBtnClasses}
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
                      p-2 rounded-xl max-w-[70%]
                      text-base leading-relaxed
                      ${isAssistant
                        ? "bg-gray-100 text-gray-800 dark:bg-[#514C5D] dark:text-gray-100"
                        : "bg-brandBlue text-white"
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

            {loading && <p className="text-sm text-gray-500 dark:text-gray-400">Thinking...</p>}

            {/* If the AI suggests more questions after a response */}
            {aiSuggestedQuestions.length > 0 && (
              <div className="mt-2 flex justify-start">
                <div
                  className="
                    p-2 rounded-xl w-full 
                    bg-gray-100
                    dark:bg-[#514C5D]
                    /* remove text color here so it doesn't override the button text */
                    text-inherit dark:text-inherit
                  "
                >
                  <p className="text-sm mb-1">You might also ask:</p>
                  <div className="flex flex-wrap gap-2">
                    {aiSuggestedQuestions.map((q, i) => (
                      <Button
                        key={i}
                        className={suggestedBtnClasses}
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
              className="
                rounded-xl 
                dark:bg-[#3B3744] 
                dark:text-gray-100 
                dark:placeholder-gray-300
              "
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