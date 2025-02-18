"use client";

import { useState } from "react";
import ResumeFormCard, { Mode, QnAData } from "./components/ResumeFormCard";
import SkillOverviewCard from "./components/SkillOverviewCard";
import DetailedBreakdownCard from "./components/DetailedBreakdownCard";
import FollowupQuestionsCard from "./components/FollowupQuestionsCard";
import ChatBotCard from "./components/ChatBotCard"
import Image from "next/image"; // optional, if you want to use Next.js Image component



export default function Home() {
  // Modes: "upload" or "questions"
  const [mode, setMode] = useState<Mode>("upload");

  // Basic form state
  const [email, setEmail] = useState("");
  const [file, setFile] = useState<File | null>(null);

  // Grouped Q&A state
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
    } catch (err) {
      setError("Error processing request");
    }

    setLoading(false);
  };

  // If no analysis is available, show only the form centered on the page.
  if (!analysis) {
    return (
      <div className="min-h-screen bg-[#FFFFFF] py-8">
        {/* Header with Logo */}
        <header className="flex items-center justify-center mb-8">
          {/* Using Next.js Image component */}
          <Image src="/skillsync logo full.png" alt="Logo" width={250} height={80} />
          {/* Or using a simple <img> tag:
          <img src="/logo.png" alt="Logo" className="h-16 w-auto" />
          */}
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

  // If analysis exists, show a three-column layout.
  return (
    <div className="min-h-screen py-8">
      {/* Header with Logo */}
      <header className="flex items-center justify-center mb-4">
        <Image src="/skillsync logo full.png" alt="Logo" width={200} height={80} />
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
          <ChatBotCard email={email} 
          analysisResults={JSON.stringify(analysis.analysisResults)}/>
        </div>


          {/* Column 2: Skills Overview and Follow-up Questions */}
          <div className="flex flex-col gap-6">
            <SkillOverviewCard analysisResults={analysis.analysisResults} />
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

          {/* Column 3: Detailed Skill Breakdown */}
          <DetailedBreakdownCard analysisResults={analysis.analysisResults} />
        </div>
      </div>
    </div>
  );
}
