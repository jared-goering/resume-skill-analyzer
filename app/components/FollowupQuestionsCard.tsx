// components/FollowupQuestionsCard.tsx
"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface FollowupQuestionsCardProps {
  questions: string[];
}

export default function FollowupQuestionsCard({ questions }: FollowupQuestionsCardProps) {
  // Initialize an array of responses, one for each question.
  const [responses, setResponses] = useState<string[]>(questions.map(() => ""));

  const handleChange = (index: number, value: string) => {
    const newResponses = [...responses];
    newResponses[index] = value;
    setResponses(newResponses);
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Follow-up Questions</CardTitle>
      </CardHeader>
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
                  className="mt-1 w-full"
                />
              </li>
            ))}
          </ul>
        ) : (
          <p>No follow-up questions available.</p>
        )}
      </CardContent>
    </Card>
  );
}