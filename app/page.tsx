"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadialSkillChart } from "./components/RadialSkillChart";

export default function Home() {
  const [mode, setMode] = useState<"upload" | "questions">("upload");

  // Basic form states
  const [email, setEmail] = useState("");
  const [file, setFile] = useState<File | null>(null);

  // Q&A states
  const [role, setRole] = useState("");
  const [responsibilities, setResponsibilities] = useState("");
  const [keySkills, setKeySkills] = useState("");
  const [projects, setProjects] = useState("");
  const [accomplishments, setAccomplishments] = useState("");
  const [technicalTools, setTechnicalTools] = useState("");
  const [proficientTools, setProficientTools] = useState("");
  const [communicationTeamwork, setCommunicationTeamwork] = useState("");
  const [trainingCertifications, setTrainingCertifications] = useState("");
  const [strengthsOpportunities, setStrengthsOpportunities] = useState("");

  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const titleColorMap: Record<string, string> = {
    "Professional Skills": "text-[#A4F5A6]",
    "Innovation Skills": "text-[#B3A1FF]",
    "Digital Skills":     "text-[#F2A3B3]",
    "Leadership Skills":  "text-[#F8D57E]",
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
    if (
      mode === "questions" &&
      (!role ||
        !responsibilities ||
        !keySkills ||
        !projects ||
        !accomplishments ||
        !technicalTools ||
        !proficientTools ||
        !communicationTeamwork ||
        !trainingCertifications ||
        !strengthsOpportunities)
    ) {
      setError("Please fill out all the questions.");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("email", email);

    if (mode === "upload") {
      // Attach the file if using "Upload" mode
      formData.append("resume", file!);
    } else {
      // Combine the Q&A fields into a single text block
      const manualResumeText = `
Role in the Last 18 Months: ${role}
Main Responsibilities: ${responsibilities}
Key Skills Utilized: ${keySkills}
Key Projects/Initiatives: ${projects}
Significant Accomplishments: ${accomplishments}
Technical Tools/Platforms Worked With: ${technicalTools}
Tools You Are Most Proficient In: ${proficientTools}
Communication and Teamwork Skills: ${communicationTeamwork}
Training or Certifications: ${trainingCertifications}
Strongest Skills & Improvement Opportunities: ${strengthsOpportunities}
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


  // Helper function to compute the average of a skill category
function getAverage(skills: Record<string, number>): number {
  const vals = Object.values(skills);
  if (!vals.length) return 0;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

  // If there's no analysis, render only the upload/questions card centered on the page
  if (!analysis) {
    return (
<div className="container mx-auto flex justify-center py-8">
<Card className="w-full max-w-xl">
          <CardHeader>
            <CardTitle>Resume Skill Analyzer</CardTitle>
            <CardDescription>Analyze your resume using AI</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Mode toggle */}
            <div className="flex gap-4 mb-4">
              <Button
                type="button"
                variant={mode === "upload" ? "default" : "outline"}
                onClick={() => setMode("upload")}
              >
                Upload Resume
              </Button>
              <Button
                type="button"
                variant={mode === "questions" ? "default" : "outline"}
                onClick={() => setMode("questions")}
              >
                Answer Questions
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {mode === "upload" ? (
                <div>
                  <Label>Upload Resume (PDF or DOCX)</Label>
                  <Input
                    type="file"
                    accept=".pdf,.docx,.doc"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                    required
                  />
                </div>
              ) : (
                <>
                  <div>
                    <Label>Role in the Last 18 Months</Label>
                    <Input
                      type="text"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label>Main Responsibilities</Label>
                    <Input
                      type="text"
                      value={responsibilities}
                      onChange={(e) => setResponsibilities(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label>Key Skills Utilized</Label>
                    <Input
                      type="text"
                      value={keySkills}
                      onChange={(e) => setKeySkills(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label>Key Projects/Initiatives</Label>
                    <Input
                      type="text"
                      value={projects}
                      onChange={(e) => setProjects(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label>Significant Accomplishments</Label>
                    <Input
                      type="text"
                      value={accomplishments}
                      onChange={(e) => setAccomplishments(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label>Technical Tools/Platforms Worked With</Label>
                    <Input
                      type="text"
                      value={technicalTools}
                      onChange={(e) => setTechnicalTools(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label>Tools You Are Most Proficient In</Label>
                    <Input
                      type="text"
                      value={proficientTools}
                      onChange={(e) => setProficientTools(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label>Communication and Teamwork Skills</Label>
                    <Input
                      type="text"
                      value={communicationTeamwork}
                      onChange={(e) => setCommunicationTeamwork(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label>Recent Training or Certifications</Label>
                    <Input
                      type="text"
                      value={trainingCertifications}
                      onChange={(e) => setTrainingCertifications(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label>Strongest Skills & Improvement Opportunities</Label>
                    <Input
                      type="text"
                      value={strengthsOpportunities}
                      onChange={(e) => setStrengthsOpportunities(e.target.value)}
                      required
                    />
                  </div>
                </>
              )}

              <Button type="submit">Analyze Resume</Button>
            </form>

            {loading && <p className="mt-4">Analyzing resume, please wait...</p>}
            {error && <p className="mt-4 text-red-500">{error}</p>}
          </CardContent>
        </Card>
      </div>
    );
  }

  // If analysis is available, display a three-column grid
  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-3 gap-6 items-start">
      {/* Column 1: Upload/Questions Card */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Resume Skill Analyzer</CardTitle>
            <CardDescription>Analyze your resume using AI</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Mode toggle */}
            <div className="flex gap-4 mb-4">
              <Button
                type="button"
                variant={mode === "upload" ? "default" : "outline"}
                onClick={() => setMode("upload")}
              >
                Upload Resume
              </Button>
              <Button
                type="button"
                variant={mode === "questions" ? "default" : "outline"}
                onClick={() => setMode("questions")}
              >
                Answer Questions
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {mode === "upload" ? (
                <div>
                  <Label>Upload Resume (PDF or DOCX)</Label>
                  <Input
                    type="file"
                    accept=".pdf,.docx,.doc"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                    required
                  />
                </div>
              ) : (
                <>
                  <div>
                    <Label>Role in the Last 18 Months</Label>
                    <Input
                      type="text"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label>Main Responsibilities</Label>
                    <Input
                      type="text"
                      value={responsibilities}
                      onChange={(e) => setResponsibilities(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label>Key Skills Utilized</Label>
                    <Input
                      type="text"
                      value={keySkills}
                      onChange={(e) => setKeySkills(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label>Key Projects/Initiatives</Label>
                    <Input
                      type="text"
                      value={projects}
                      onChange={(e) => setProjects(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label>Significant Accomplishments</Label>
                    <Input
                      type="text"
                      value={accomplishments}
                      onChange={(e) => setAccomplishments(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label>Technical Tools/Platforms Worked With</Label>
                    <Input
                      type="text"
                      value={technicalTools}
                      onChange={(e) => setTechnicalTools(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label>Tools You Are Most Proficient In</Label>
                    <Input
                      type="text"
                      value={proficientTools}
                      onChange={(e) => setProficientTools(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label>Communication and Teamwork Skills</Label>
                    <Input
                      type="text"
                      value={communicationTeamwork}
                      onChange={(e) => setCommunicationTeamwork(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label>Recent Training or Certifications</Label>
                    <Input
                      type="text"
                      value={trainingCertifications}
                      onChange={(e) => setTrainingCertifications(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label>Strongest Skills & Improvement Opportunities</Label>
                    <Input
                      type="text"
                      value={strengthsOpportunities}
                      onChange={(e) => setStrengthsOpportunities(e.target.value)}
                      required
                    />
                  </div>
                </>
              )}

              <Button type="submit">Analyze Resume</Button>
            </form>

            {loading && <p className="mt-4">Analyzing resume, please wait...</p>}
            {error && <p className="mt-4 text-red-500">{error}</p>}
          </CardContent>
        </Card>

        {/* Column 2: Radial Chart Card */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Skills Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {analysis?.analysisResults ? (
              <RadialSkillChart analysisResults={analysis.analysisResults} />
            ) : (
              <p>No analysis available yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Column 3: Detailed Skill Breakdown Card with inner cards */}
        {/* Column 3: Detailed Skill Breakdown Card with inner cards */}
<Card className="col-span-1">
  <CardHeader>
    <CardTitle>Detailed Skill Breakdown</CardTitle>
  </CardHeader>
  <CardContent>
    {analysis?.analysisResults ? (
      <div className="space-y-4">
        {Object.keys(analysis.analysisResults).map((category) => {
          const average = getAverage(
            analysis.analysisResults[category] as Record<string, number>
          );
          return (
            <Card key={category} className="mb-4">
              <CardHeader>
                <CardTitle className={titleColorMap[category] || ""}>
                  {category}
                </CardTitle>
                {/* Display the average underneath the title */}
                <p className={`text-sm ${titleColorMap[category] || ""}`}>
    Average: {average.toFixed(1)}/10
  </p>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  {Object.entries(
                    analysis.analysisResults[category] as Record<string, number>
                  ).map(([skill, score]) => (
                    <div key={skill} className="w-40">
                      <p className="text-sm mb-1">{skill}</p>
                      <Progress value={(score / 10) * 100} className="w-full" />
                      <p className="text-xs mt-1 text-center">{score}/10</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    ) : (
      <p>No detailed breakdown available yet.</p>
    )}
  </CardContent>
</Card>

      </div>
    </div>
  );
}
