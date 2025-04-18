"use client";

import { useState, useEffect } from "react";
import ResumeFormCard, { Mode, QnAData } from "./components/ResumeFormCard";
import SkillOverviewCard from "./components/SkillOverviewCard";
import DetailedBreakdownCard from "./components/DetailedBreakdownCard";
import FollowupQuestionsCard from "./components/FollowupQuestionsCard";
import ChatBotCard from "./components/ChatBotCard";
import Image from "next/image";

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
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

  // NEW: track if the user has finished follow-up questions
  const [followupsDone, setFollowupsDone] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Basic validation
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
      // Reset followupsDone in case user uploads a new resume
      setFollowupsDone(false);
    } catch (err) {
      setError("Error processing request");
    }

    setLoading(false);
  };

  // STEP 1: If no analysis yet, show form
  if (!analysis) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#302D39] py-8">
        <header className="flex items-center justify-between mb-8 px-4">
          <Image
            src="/skillsync logo full.png"
            alt="Logo"
            width={250}
            height={80}
            onClick={() => setDarkMode((prev) => !prev)}
            className="cursor-pointer"
          />
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

// STEP 2: If AI returned followupQuestions and user hasn't answered them yet, show ONLY follow-up card
if (
  analysis.followupQuestions &&
  analysis.followupQuestions.length > 0 &&
  !followupsDone
) {
  return (
    <div className="h-screen w-screen overflow-hidden bg-white dark:bg-[#302D39] flex flex-col">
      {/* Fixed header */}
      <header className="flex-shrink-0 p-4 flex items-center justify-between">
        <Image
          src="/skillsync logo full.png"
          alt="Logo"
          width={200}
          height={80}
          onClick={() => setDarkMode((prev) => !prev)}
          className="cursor-pointer"
        />
      </header>

      {/* Main content fills the rest of the screen */}
      <main className="flex-1 flex items-center justify-center">
        <FollowupQuestionsCard
          questions={analysis.followupQuestions || []}
          email={email}
          file={file || undefined}
          manualResume={manualResumeText}
          originalAnalysis={JSON.stringify(analysis.analysisResults)}
          onUpdatedAnalysis={(updatedAnalysis) => {
            setAnalysis({
              ...analysis,
              analysisResults: updatedAnalysis,
              followupQuestions: [],
            });
            setFollowupsDone(true);
          }}
        />
      </main>
    </div>
  );
}

  // STEP 3: Otherwise (analysis exists & followups done), show final 3-column layout
  return (
    <div className="min-h-screen bg-white dark:bg-[#302D39] py-8">
      <header className="flex items-center justify-between mb-4 px-4">
        <Image
          src="/skillsync logo full.png"
          alt="Logo"
          width={200}
          height={80}
          onClick={() => setDarkMode((prev) => !prev)}
          className="cursor-pointer"
        />
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

          {/* Column 2: Skills Overview */}
          <div className="flex flex-col gap-6">
            <SkillOverviewCard
              analysisResults={analysis.analysisResults}
              darkMode={darkMode}
            />
            {/* 
              If you want to allow the user to re-answer follow-ups,
              you can conditionally show FollowupQuestionsCard again,
              but typically you'd omit it here once followupsDone is true.
            */}
          </div>

          {/* Column 3: Detailed Breakdown */}
          <DetailedBreakdownCard
            analysisResults={analysis.analysisResults}
            darkMode={darkMode}
          />
        </div>
      </div>
    </div>
  );
}
