"use client";

import { useState } from "react";

// shadcn/ui components: adjust these import paths
// if your project structure differs
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function Home() {
  const [email, setEmail] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !file) {
      setError("Please provide your email and a resume file.");
      return;
    }
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("email", email);
    formData.append("resume", file);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        setError(errData.error || "Error processing resume");
        setLoading(false);
        return;
      }

      const data = await res.json();
      setAnalysis(data);
    } catch (err) {
      setError("Error processing request");
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="mx-auto max-w-xl">
        <CardHeader>
          <CardTitle>Resume Skill Analyzer</CardTitle>
          <CardDescription>Analyze your resume using AI</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="resume">Upload Resume (PDF or DOCX)</Label>
              <Input
                id="resume"
                type="file"
                accept=".pdf,.docx,.doc"
                onChange={(e) => {
                  const selectedFile = e.target.files?.[0];
                  setFile(selectedFile || null);
                }}
                required
                className="mt-1"
              />
            </div>

            <Button type="submit">Analyze Resume</Button>
          </form>

          {loading && <p className="mt-4">Analyzing resume, please wait...</p>}
          {error && <p className="mt-4 text-red-500">{error}</p>}

          {analysis ? (
            <div className="mt-8">
              <h2 className="text-lg font-bold mb-2">Analysis Results</h2>

              {/* If we have analysisResults, show skill categories */}
              {analysis.analysisResults ? (
                Object.keys(analysis.analysisResults).map((category) => (
                  <div key={category} className="mb-4">
                    <h3 className="font-semibold mb-2">{category}</h3>
                    <div className="flex flex-wrap gap-4">
                      {Object.entries(
                        analysis.analysisResults[category] as Record<string, number>
                      ).map(([skill, score]) => (
                        <div key={skill} className="w-40">
                          <p className="text-sm mb-1">{skill}</p>
                          {/* Use shadcn's Progress component */}
                          <Progress value={(score / 10) * 100} className="w-full" />
                          <p className="text-xs mt-1 text-center">{score}/10</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                // Otherwise, fallback to a plain snippet
                <div>
                  <h3 className="font-semibold mb-2">Resume Text Preview</h3>
                  <p>{analysis.resumeTextSnippet}</p>
                </div>
              )}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}