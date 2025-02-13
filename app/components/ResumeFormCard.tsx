// components/ResumeFormCard.tsx
"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export type Mode = "upload" | "questions";

export interface QnAData {
  role: string;
  responsibilities: string;
  keySkills: string;
  projects: string;
  accomplishments: string;
  technicalTools: string;
  proficientTools: string;
  communicationTeamwork: string;
  trainingCertifications: string;
  strengthsOpportunities: string;
}

interface ResumeFormCardProps {
  mode: Mode;
  setMode: (mode: Mode) => void;
  email: string;
  setEmail: (email: string) => void;
  file: File | null;
  setFile: (file: File | null) => void;
  qna: QnAData;
  setQna: (qna: QnAData) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  loading: boolean;
  error: string;
}

export default function ResumeFormCard({
  mode,
  setMode,
  email,
  setEmail,
  file,
  setFile,
  qna,
  setQna,
  onSubmit,
  loading,
  error,
}: ResumeFormCardProps) {
  return (
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

        <form onSubmit={onSubmit} className="space-y-4">
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
    {/* If we have a file in state, show its name below */}
    {file && (
      <p className="mt-2 text-sm text-gray-700">
        Uploaded file: <span className="font-medium">{file.name}</span>
      </p>
    )}
  </div>
          ) : (
            <>
              <div>
                <Label>Role in the Last 18 Months</Label>
                <Input
                  type="text"
                  value={qna.role}
                  onChange={(e) => setQna({ ...qna, role: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Main Responsibilities</Label>
                <Input
                  type="text"
                  value={qna.responsibilities}
                  onChange={(e) => setQna({ ...qna, responsibilities: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Key Skills Utilized</Label>
                <Input
                  type="text"
                  value={qna.keySkills}
                  onChange={(e) => setQna({ ...qna, keySkills: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Key Projects/Initiatives</Label>
                <Input
                  type="text"
                  value={qna.projects}
                  onChange={(e) => setQna({ ...qna, projects: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Significant Accomplishments</Label>
                <Input
                  type="text"
                  value={qna.accomplishments}
                  onChange={(e) => setQna({ ...qna, accomplishments: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Technical Tools/Platforms Worked With</Label>
                <Input
                  type="text"
                  value={qna.technicalTools}
                  onChange={(e) => setQna({ ...qna, technicalTools: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Tools You Are Most Proficient In</Label>
                <Input
                  type="text"
                  value={qna.proficientTools}
                  onChange={(e) => setQna({ ...qna, proficientTools: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Communication and Teamwork Skills</Label>
                <Input
                  type="text"
                  value={qna.communicationTeamwork}
                  onChange={(e) =>
                    setQna({ ...qna, communicationTeamwork: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label>Recent Training or Certifications</Label>
                <Input
                  type="text"
                  value={qna.trainingCertifications}
                  onChange={(e) =>
                    setQna({ ...qna, trainingCertifications: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label>Strongest Skills & Improvement Opportunities</Label>
                <Input
                  type="text"
                  value={qna.strengthsOpportunities}
                  onChange={(e) =>
                    setQna({ ...qna, strengthsOpportunities: e.target.value })
                  }
                  required
                />
              </div>
            </>
          )}

          <Button type="submit">✨ Analyze Resume</Button>
        </form>

        {loading && <p className="mt-4">Analyzing resume, please wait...</p>}
        {error && <p className="mt-4 text-red-500">{error}</p>}
      </CardContent>
    </Card>
  );
}
