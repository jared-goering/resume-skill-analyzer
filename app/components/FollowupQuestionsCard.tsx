// components/FollowupQuestionsCard.tsx
"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

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
  // Initialize an array of responses, one for each question.
  const [responses, setResponses] = useState<string[]>(questions.map(() => ""));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (index: number, value: string) => {
    const newResponses = [...responses];
    newResponses[index] = value;
    setResponses(newResponses);
  };

  const handleFollowupSubmit = async () => {
    setSubmitting(true);
    setError("");

    // Build form data for the followup submission.
    const formData = new FormData();
    formData.append("email", email);
    if (file) {
      formData.append("resume", file);
    } else if (manualResume) {
      formData.append("manualResume", manualResume);
    }
    formData.append("followupResponses", JSON.stringify(responses));
    formData.append("originalAnalysis", originalAnalysis);
    // Add the questions array as well.
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
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Follow-up Questions</CardTitle>
        <CardDescription>Add additional information to fill out our picture of your skills</CardDescription>
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
        <Button onClick={handleFollowupSubmit} disabled={submitting} className="mt-4">
          {submitting ? "Submitting..." : "✨ Submit to AI Analysis"}
        </Button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </CardContent>
    </Card>
  );
}
