"use client";

import { useState, useEffect } from "react";
import ResumeFormCard, { Mode, QnAData } from "./components/ResumeFormCard";
import SkillOverviewCard from "./components/SkillOverviewCard";
import DetailedBreakdownCard from "./components/DetailedBreakdownCard";
import FollowupQuestionsCard from "./components/FollowupQuestionsCard";
import ChatBotCard from "./components/ChatBotCard";
import Image from "next/image";

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);  // <-- NEW: store dark mode state
  const [mode, setMode] = useState<Mode>("upload");
  const [email, setEmail] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [qna, setQna] = useState<QnAData>({
    role: "",
    responsibilities: "",
    keySkills: "",
    projects: "",
    accomplishments: "",
    technicalTools: "",
    proficientTools: "",
    communicationTeamwork: "",
    trainingCertifications: "",
    strengthsOpportunities: "",
  });
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [manualResumeText, setManualResumeText] = useState("");

  // Whenever darkMode changes, add/remove the "dark" class from <html>
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Basic validation...
    if (!email) {
      setError("Please provide your email.");
      return;
    }
    if (mode === "upload" && !file) {
      setError("Please provide your resume file.");
      return;
    }
    if (mode === "questions") {
      for (const key in qna) {
        if (!(qna as any)[key]) {
          setError("Please fill out all the questions.");
          return;
        }
      }
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("email", email);

    if (mode === "upload") {
      formData.append("resume", file!);
    } else {
      const builtResume = `
Role: ${qna.role}
Responsibilities: ${qna.responsibilities}
Key Skills Utilized: ${qna.keySkills}
Key Projects/Initiatives: ${qna.projects}
Significant Accomplishments: ${qna.accomplishments}
Technical Tools/Platforms Worked With: ${qna.technicalTools}
Tools You Are Most Proficient In: ${qna.proficientTools}
Communication and Teamwork Skills: ${qna.communicationTeamwork}
Training or Certifications: ${qna.trainingCertifications}
Strongest Skills & Improvement Opportunities: ${qna.strengthsOpportunities}
      `;
      setManualResumeText(builtResume);
      formData.append("manualResume", builtResume);
    }

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

  // If no analysis is available, just show the form
  if (!analysis) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#302D39] py-8">
        <header className="flex items-center justify-between mb-8 px-4">
          {/* Logo */}
          <Image src="/skillsync logo full.png" alt="Logo" width={250} height={80} />
          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode((prev) => !prev)}
            className="bg-gray-200 dark:bg-gray-700 text-sm py-2 px-4 rounded-md"
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </header>
        <div className="mx-auto flex justify-center py-8">
          <ResumeFormCard
            mode={mode}
            setMode={setMode}
            email={email}
            setEmail={setEmail}
            file={file}
            setFile={setFile}
            qna={qna}
            setQna={setQna}
            onSubmit={handleSubmit}
            loading={loading}
            error={error}
          />
        </div>
      </div>
    );
  }

  // If analysis is ready, show the 3-column layout
  return (
    <div className="min-h-screen bg-white dark:bg-[#302D39] py-8">
      <header className="flex items-center justify-between mb-4 px-4">
        <Image src="/skillsync logo full.png" alt="Logo" width={200} height={80} />
        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode((prev) => !prev)}
          className="bg-gray-200 dark:bg-gray-700 text-sm py-2 px-4 rounded-md"
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </header>
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-3 gap-6 items-start">
          {/* Column 1: Resume Analyzer + Chatbot stacked */}
          <div className="flex flex-col gap-6">
            <ResumeFormCard
              mode={mode}
              setMode={setMode}
              email={email}
              setEmail={setEmail}
              file={file}
              setFile={setFile}
              qna={qna}
              setQna={setQna}
              onSubmit={handleSubmit}
              loading={loading}
              error={error}
            />
            <ChatBotCard
              email={email}
              analysisResults={JSON.stringify(analysis.analysisResults)}
            />
          </div>

          {/* Column 2: Skills Overview + Follow-up */}
          <div className="flex flex-col gap-6">
          <SkillOverviewCard analysisResults={analysis.analysisResults} darkMode={darkMode} />  
           <FollowupQuestionsCard
              questions={analysis.followupQuestions || []}
              email={email}
              file={file || undefined}
              manualResume={manualResumeText}
              originalAnalysis={JSON.stringify(analysis.analysisResults)}
              onUpdatedAnalysis={(updatedAnalysis) => {
                setAnalysis({ ...analysis, analysisResults: updatedAnalysis });
              }}
            />
          </div>

          {/* Column 3: Detailed Breakdown */}
          <DetailedBreakdownCard analysisResults={analysis.analysisResults} darkMode={darkMode} />
        </div>
      </div>
    </div>
  );
}