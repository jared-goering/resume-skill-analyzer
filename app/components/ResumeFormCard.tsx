// components/ResumeFormCard.tsx
"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import TimedProgressBar from "./TimedProgressBar";
import MyDropzone from "./MyDropzone"; 

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
        <Card
          /* 
             In light mode: white background
             In dark mode: brandDark-100 (a slightly lighter dark shade for cards)
          */
          className="
            w-full max-w-xl 
            rounded-md 
            shadow-[0_6px_15px_rgba(0,0,0,0.05)] 
            border 
            border-gray-200 
            dark:shadow-[0_6px_27px_0_rgba(35,35,35,0.37)]
            bg-white 
            text-black 
            dark:border-none 
            dark:bg-gradient-to-b dark:from-[#433F4D] dark:to-[#302D39]
            dark:text-gray-100
          "
        >
          {/* Card Header */}
          <CardHeader className="pb-2 ">
            <CardTitle className="text-xl">Resume Skill Analyzer</CardTitle>
    
            {/* Lighter text in light mode; medium gray in dark mode */}
            <CardDescription className="text-gray-600 dark:text-gray-300">
              Analyze your resume using AI
            </CardDescription>
          </CardHeader>
    
          {/* Card Content */}
          <CardContent className="pt-2">
            {/* Mode toggle buttons */}
            <div className="flex gap-4 mb-6">
                <Button
                    onClick={() => setMode("upload")}
                    className={`
                    border-1
                    border-brandBlue
                    /* always use brandBlue for border in dark mode */
                    dark:border-brandBlue
                    
                    /* if "upload" is the active mode, fill the button */
                    ${mode === "upload" 
                        ? "bg-brandBlue text-white dark:bg-brandBlue dark:text-black" 
                        /* if not active, show an outlined style */
                        : "bg-transparent text-brandBlue dark:bg-brandDark-100 dark:hover:bg-brandDark-200 dark:text-brandBlue"
                    }
                    `}
                >
                    Upload Resume
                </Button>

                <Button
                    onClick={() => setMode("questions")}
                    className={`
                        border-2
                        border-brandBlue
                        /* always use brandBlue for border in dark mode */
                        dark:border-brandBlue
                        
                        /* if "upload" is the active mode, fill the button */
                        ${mode === "questions" 
                            ? "bg-brandBlue text-white dark:bg-brandBlue dark:text-black" 
                            /* if not active, show an outlined style */
                            : "bg-transparent text-brandBlue dark:bg-brandDark-100 dark:hover:bg-brandDark-200 dark:text-brandBlue"
                        }
                        `}
                >
                    Answer Questions
                </Button>
                </div>
            {/* Form */}
            <form onSubmit={onSubmit} className="space-y-4">
              {/* Email Field */}
              <div>
                <Label htmlFor="email" className="mb-2 block text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="
                    dark:border-brandGray-200
                    dark:text-gray-100
                  "
                />
              </div>
    
              {mode === "upload" ? (
                <div>
                  <Label className="mb-2 block text-sm font-medium">
                    Upload Resume (PDF or DOCX)
                  </Label>
                  <MyDropzone file={file} setFile={setFile} />
                  {file && (
                    <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                      {/* e.g., Uploaded file: {file.name} */}
                    </p>
                  )}
                </div>
              ) : (
            // Questions Mode
            <>
              <div>
                <Label className="mb-2 block text-sm font-medium ">
                  Role in the Last 18 Months
                </Label>
                <Input
                  type="text"
                  value={qna.role}
                  className="dark:border-brandGray-200"
                  onChange={(e) => setQna({ ...qna, role: e.target.value })}
                />
              </div>
              <div>
                <Label className="mb-2 block text-sm font-medium">
                  Main Responsibilities
                </Label>
                <Input
                  type="text"
                  value={qna.responsibilities}
                  className="dark:border-brandGray-200"
                  onChange={(e) => setQna({ ...qna, responsibilities: e.target.value })}
                />
              </div>
              <div>
                <Label className="mb-2 block text-sm font-medium">
                  Key Skills Utilized
                </Label>
                <Input
                  type="text"
                  value={qna.keySkills}
                  onChange={(e) => setQna({ ...qna, keySkills: e.target.value })}
                  className="dark:border-brandGray-200"

                />
              </div>
              <div>
                <Label className="mb-2 block text-sm font-medium">
                  Key Projects/Initiatives
                </Label>
                <Input
                  type="text"
                  value={qna.projects}
                  onChange={(e) => setQna({ ...qna, projects: e.target.value })}
                  className="dark:border-brandGray-200"

                />
              </div>
              <div>
                <Label className="mb-2 block text-sm font-medium">
                  Significant Accomplishments
                </Label>
                <Input
                  type="text"
                  value={qna.accomplishments}
                  onChange={(e) => setQna({ ...qna, accomplishments: e.target.value })}
                  className="dark:border-brandGray-200"

                />
              </div>
              <div>
                <Label className="mb-2 block text-sm font-medium">
                  Technical Tools/Platforms Worked With
                </Label>
                <Input
                  type="text"
                  value={qna.technicalTools}
                  onChange={(e) => setQna({ ...qna, technicalTools: e.target.value })}
                  className="dark:border-brandGray-200"

                />
              </div>
              <div>
                <Label className="mb-2 block text-sm font-medium">
                  Tools You Are Most Proficient In
                </Label>
                <Input
                  type="text"
                  value={qna.proficientTools}
                  onChange={(e) => setQna({ ...qna, proficientTools: e.target.value })}
                  className="dark:border-brandGray-200"

                />
              </div>
              <div>
                <Label className="mb-2 block text-sm font-medium">
                  Communication and Teamwork Skills
                </Label>
                <Input
                  type="text"
                  value={qna.communicationTeamwork}
                  onChange={(e) => setQna({ ...qna, communicationTeamwork: e.target.value })}
                  className="dark:border-brandGray-200"

                />
              </div>
              <div>
                <Label className="mb-2 block text-sm font-medium">
                  Recent Training or Certifications
                </Label>
                <Input
                  type="text"
                  value={qna.trainingCertifications}
                  onChange={(e) => setQna({ ...qna, trainingCertifications: e.target.value })}
                  className="dark:border-brandGray-200"

                />
              </div>
              <div>
                <Label className="mb-2 block text-sm font-medium">
                  Strongest Skills &amp; Improvement Opportunities
                </Label>
                <Input
                  type="text"
                  value={qna.strengthsOpportunities}
                  onChange={(e) => setQna({ ...qna, strengthsOpportunities: e.target.value })}
                  className="dark:border-brandGray-200"

                />
              </div>
            </>
          )}

          {/* Submit Button */}
           {/* Submit Button with "shimmer" effect */}
           <Button
            type="submit"
            className="
              relative mt-4 overflow-hidden font-medium 
              text-white py-2 px-4 rounded 
              group 
              hover:text-yellow-400
              bg-indigo-600 dark:bg-brandDark-200
            "
          >
            <span
              className="
                absolute inset-0 
                bg-[linear-gradient(to_right,rgba(255,255,255,0)_0%,rgba(255,255,255,0.4)_20%,rgba(255,255,255,0)_40%)]
                bg-[length:200%_100%]
                opacity-0
                group-hover:opacity-50
                group-hover:animate-[shimmer_1.5s_infinite_linear]
              "
            />
            <span className="relative z-10">✨ Analyze Resume</span>
          </Button>
        </form>

        {/* Progress bar + Error messaging */}
        {loading && <TimedProgressBar loading={loading} />}
        {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}
      </CardContent>
    </Card>
  );
}