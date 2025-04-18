"use client";

import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface FollowupQuestionsCardProps {
  questions: string[];
  email: string;
  file?: File;
  manualResume?: string;
  originalAnalysis: string; // stringified original analysis
  onUpdatedAnalysis?: (updatedAnalysis: any) => void;

  // Optionally pass dynamic headings if you like:
  heading?: string;
  subheading?: string;
}

export default function FollowupQuestionsCard({
  questions,
  email,
  file,
  manualResume,
  originalAnalysis,
  onUpdatedAnalysis,
  heading,
  subheading,
}: FollowupQuestionsCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<string[]>(() =>
    questions.map(() => "")
  );
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (value: string) => {
    const newResponses = [...responses];
    newResponses[currentIndex] = value;
    setResponses(newResponses);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSuggestions([]); // reset suggestions for the new question
    } else {
      handleFollowupSubmit();
    }
  };

  const handleSkip = () => {
    handleChange("");
    handleNext();
  };

  const fetchSuggestions = async (question: string) => {
    try {
      setError("");
      setSuggestions([]);
      const payload = {
        question,
        originalAnalysis,
        resume: manualResume || "",
      };
      const res = await fetch("/api/suggestAnswers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Error fetching suggestions");
        return;
      }
      const data = await res.json();
      setSuggestions(data.suggestions || []);
    } catch (err: any) {
      setError(err.message || "Error fetching suggestions");
    }
  };

  useEffect(() => {
    if (questions[currentIndex]) {
      fetchSuggestions(questions[currentIndex]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

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

  if (!questions || !questions.length) {
    return null;
  }

  return (
    <div className="w-full min-h-screen bg-white dark:bg-[#302D39] flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-3xl bg-white dark:bg-[#433F4D] rounded-md shadow-md p-8">
        {heading && (
          <h1 className="text-3xl font-bold text-black dark:text-gray-100 mb-1">
            {heading}
          </h1>
        )}
        {subheading && (
          <h2 className="text-lg text-gray-500 dark:text-gray-300 mb-6">
            {subheading}
          </h2>
        )}
        <p className="mb-2 text-sm text-gray-600 dark:text-gray-200">
          Question {currentIndex + 1} of {questions.length}
        </p>
        {/* Fade-in container for question and answer */}
        <div key={currentIndex} className="animate-fadeInUp">
          <p className="mb-4 text-base text-gray-800 dark:text-gray-100">
            {questions[currentIndex]}
          </p>
          <Textarea
            placeholder="Type your response here..."
            value={responses[currentIndex]}
            onChange={(e) => handleChange(e.target.value)}
            className="mb-4 w-full dark:bg-[#3B3744] dark:border-gray-600 dark:text-gray-100"
          />
          {/* Suggestions container with a dynamic key to force re-mount */}
          {suggestions.length > 0 && (
            <div key={JSON.stringify(suggestions)} className="mb-6 animate-fadeInUp">
              <p className="text-sm text-gray-500 dark:text-gray-300 mb-2">
                Suggested Answers (click to use):
              </p>
              <div className="flex flex-col gap-2">
                {suggestions.map((sug, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleChange(sug)}
                    className="text-left bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 px-3 py-1 rounded"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleSkip}
            className="border-brandBlue text-brandBlue dark:border-gray-200 dark:text-gray-200"
          >
            Skip
          </Button>
          {currentIndex < questions.length - 1 ? (
            <Button onClick={handleNext} className="bg-brandBlue text-white hover:bg-brandBlueHover">
              Next
            </Button>
          ) : (
            <Button onClick={handleFollowupSubmit} disabled={submitting} className="bg-brandBlue text-white hover:bg-brandBlueHover">
              {submitting ? "Submitting..." : "Submit to AI Analysis"}
            </Button>
          )}
        </div>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
}