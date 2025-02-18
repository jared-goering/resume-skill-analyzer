"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CaretUp, CaretDown } from "@phosphor-icons/react";

interface FollowupQuestionsCardProps {
  questions: string[];
  email: string;
  file?: File;
  manualResume?: string;
  originalAnalysis: string; // stringified original analysis
  onUpdatedAnalysis?: (updatedAnalysis: any) => void;
}

export default function FollowupQuestionsCard({
  questions,
  email,
  file,
  manualResume,
  originalAnalysis,
  onUpdatedAnalysis,
}: FollowupQuestionsCardProps) {
  const [responses, setResponses] = useState<string[]>(questions.map(() => ""));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [collapsed, setCollapsed] = useState(false);

  const handleChange = (index: number, value: string) => {
    const newResponses = [...responses];
    newResponses[index] = value;
    setResponses(newResponses);
  };

  const handleFollowupSubmit = async () => {
    setSubmitting(true);
    setError("");

    const formData = new FormData();
    formData.append("email", email);
    if (file) {
      formData.append("resume", file);
    } else if (manualResume) {
      formData.append("manualResume", manualResume);
    }
    formData.append("followupResponses", JSON.stringify(responses));
    formData.append("originalAnalysis", originalAnalysis);
    formData.append("questions", JSON.stringify(questions));

    try {
      const res = await fetch("/api/followup", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const errData = await res.json();
        setError(errData.error || "Error processing follow-up analysis");
      } else {
        const data = await res.json();
        if (onUpdatedAnalysis) {
          onUpdatedAnalysis(data.updatedAnalysis);
        }
      }
    } catch (err: any) {
      setError(err.message || "Error processing follow-up analysis");
    }
    setSubmitting(false);
  };

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
        <div>
          <CardTitle>Follow-up Questions</CardTitle>
          <CardDescription>
            Add additional information to fill out our picture of your skills.
          </CardDescription>
        </div>
        {/* Minimize/Expand toggle button in the top-right corner */}
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
        className={`overflow-hidden transition-all duration-300 ${
          collapsed ? "max-h-0" : "max-h-[1000px]"
        }`}
      >
        <CardContent>
          {questions && questions.length > 0 ? (
            <ul className="list-disc pl-5">
              {questions.map((question, index) => (
                <li key={index} className="mb-4">
                  <p className="mb-2">{question}</p>
                  <Textarea
                    placeholder="Optional: Type your response here..."
                    value={responses[index]}
                    onChange={(e) => handleChange(index, e.target.value)}
                    className="
                      mt-1 w-full 
                      dark:bg-[#3B3744]
                      dark:border-gray-600
                      dark:text-gray-100
                    "
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p>No follow-up questions available.</p>
          )}
          <Button
            onClick={handleFollowupSubmit}
            disabled={submitting}
            className="mt-4"
          >
            {submitting ? "Submitting..." : "✨ Submit to AI Analysis"}
          </Button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </CardContent>
      </div>
    </Card>
  );
}