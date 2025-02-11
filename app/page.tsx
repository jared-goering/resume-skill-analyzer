// app/page.tsx (or pages/index.tsx)
"use client";

import { useState } from "react";
import ResumeFormCard, { Mode, QnAData } from "./components/ResumeFormCard";
import SkillOverviewCard from "./components/SkillOverviewCard";
import DetailedBreakdownCard from "./components/DetailedBreakdownCard";

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
      // Combine the Q&A fields into a single text block
      const manualResumeText = `
Role in the Last 18 Months: ${qna.role}
Main Responsibilities: ${qna.responsibilities}
Key Skills Utilized: ${qna.keySkills}
Key Projects/Initiatives: ${qna.projects}
Significant Accomplishments: ${qna.accomplishments}
Technical Tools/Platforms Worked With: ${qna.technicalTools}
Tools You Are Most Proficient In: ${qna.proficientTools}
Communication and Teamwork Skills: ${qna.communicationTeamwork}
Training or Certifications: ${qna.trainingCertifications}
Strongest Skills & Improvement Opportunities: ${qna.strengthsOpportunities}
      `;
      formData.append("manualResume", manualResumeText);
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
    );
  }

  // If analysis exists, show a three-column layout.
  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-3 gap-6 items-start">
        {/* Column 1: The Resume Form */}
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

        {/* Column 2: Skills Overview (Radial Chart) */}
        <SkillOverviewCard analysisResults={analysis.analysisResults} />

        {/* Column 3: Detailed Skill Breakdown */}
        <DetailedBreakdownCard analysisResults={analysis.analysisResults} />
      </div>
    </div>
  );
}
