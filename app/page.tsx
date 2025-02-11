"use client";

import { useState } from "react";

// Import your shadcn/ui components
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadialSkillChart } from "./components/RadialSkillChart";

export default function Home() {
  // Mode toggle: "upload" or "questions"
  const [mode, setMode] = useState<"upload" | "questions">("upload");

  const [email, setEmail] = useState("");
  const [file, setFile] = useState<File | null>(null);

  // State for manual input mode
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

  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [error, setError] = useState("");

  const analysisResults = {
    "Professional Skills": { Communication: 8, TimeManagement: 7 },
    "Innovation Skills": { Creativity: 9, "Risk Taking": 6 },
    "Digital Skills": { "Data Visualization": 7 },
    "Leadership Skills": { "Strategic Thinking": 8 },
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please provide your email.");
      return;
    }
    if (mode === "upload" && !file) {
      setError("Please provide your resume file.");
      return;
    }
    if (mode === "questions" && (!role || !responsibilities || !keySkills || !projects || !accomplishments || !technicalTools || !proficientTools || !communicationTeamwork || !trainingCertifications || !strengthsOpportunities)) {
      setError("Please answer all the questions.");
      return;
    }
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("email", email);

    if (mode === "upload") {
      formData.append("resume", file!);
    } else {
      // Combine the manual answers into a resume-like text block
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

  return (
    <div className="container mx-auto py-8">
      <Card className="mx-auto max-w-xl">
        <CardHeader>
          <CardTitle>Resume Skill Analyzer</CardTitle>
          <CardDescription>Analyze your resume using AI</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Mode toggle buttons */}
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

            {mode === "upload" ? (
              <div>
                <Label htmlFor="resume">Upload Resume (PDF or DOCX)</Label>
                <Input
                  id="resume"
                  type="file"
                  accept=".pdf,.docx,.doc"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  required
                  className="mt-1"
                />
              </div>
            ) : (
              <>
                <div>
                  <Label htmlFor="role">Role in the Last 18 Months</Label>
                  <Input
                    id="role"
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="responsibilities">Main Responsibilities</Label>
                  <Input
                    id="responsibilities"
                    type="text"
                    value={responsibilities}
                    onChange={(e) => setResponsibilities(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="keySkills">Key Skills Utilized</Label>
                  <Input
                    id="keySkills"
                    type="text"
                    value={keySkills}
                    onChange={(e) => setKeySkills(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="projects">Key Projects/Initiatives</Label>
                  <Input
                    id="projects"
                    type="text"
                    value={projects}
                    onChange={(e) => setProjects(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="accomplishments">Most Significant Accomplishments</Label>
                  <Input
                    id="accomplishments"
                    type="text"
                    value={accomplishments}
                    onChange={(e) => setAccomplishments(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="technicalTools">Technical Tools/Platforms Worked With</Label>
                  <Input
                    id="technicalTools"
                    type="text"
                    value={technicalTools}
                    onChange={(e) => setTechnicalTools(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="proficientTools">Tools You Are Most Proficient In</Label>
                  <Input
                    id="proficientTools"
                    type="text"
                    value={proficientTools}
                    onChange={(e) => setProficientTools(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="communicationTeamwork">Communication and Teamwork Skills</Label>
                  <Input
                    id="communicationTeamwork"
                    type="text"
                    value={communicationTeamwork}
                    onChange={(e) => setCommunicationTeamwork(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="trainingCertifications">Recent Training or Certifications</Label>
                  <Input
                    id="trainingCertifications"
                    type="text"
                    value={trainingCertifications}
                    onChange={(e) => setTrainingCertifications(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="strengthsOpportunities">Strongest Skills and Improvement Opportunities</Label>
                  <Input
                    id="strengthsOpportunities"
                    type="text"
                    value={strengthsOpportunities}
                    onChange={(e) => setStrengthsOpportunities(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
              </>
            )}

            <Button type="submit">Analyze Resume</Button>
          </form>

          {loading && <p className="mt-4">Analyzing resume, please wait...</p>}
          {error && <p className="mt-4 text-red-500">{error}</p>}

          {analysis && analysis.analysisResults ? (
  <div className="mt-8">
    <h2 className="text-lg font-bold mb-2">Analysis Results</h2>

    {/* Show the radial chart ONCE, before listing sub-skills */}
    <div className="mb-8">
      <h1 className="text-2xl font-bold mb-4">Skills Overview</h1>
      <RadialSkillChart analysisResults={analysis.analysisResults} />
    </div>

    {/* Now list each category’s sub-skills */}
    {Object.keys(analysis.analysisResults).map((category) => (
      <div key={category} className="mb-4">
        <h3 className="font-semibold mb-2">{category}</h3>
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
      </div>
    ))}
  </div>
) : (
  <div>
    <h3 className="font-semibold mb-2">Resume Text Preview</h3>
    <p>{analysis?.resumeTextSnippet}</p>
  </div>
)}
        </CardContent>
      </Card>
    </div>
  );
}