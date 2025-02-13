"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { skillDefinitions } from "@/utils/skillDefinitions"; // adjust path as needed
import { Info } from "@phosphor-icons/react";

/** Category-level definitions (example). Adjust as you see fit. */
const categoryDefinitions: Record<string, string> = {
  "Professional Skills":
    "Core competencies like communication, time management, and planning that underpin professional effectiveness.",
  "Innovation Skills":
    "Abilities that foster creativity, risk-taking, and novel problem-solving in fast-paced environments.",
  "Digital Skills":
    "Technical proficiencies, tools, and platforms required in modern, data-driven workplaces.",
  "Leadership Skills":
    "Managing, inspiring, and guiding teams or organizations toward shared goals and positive cultures.",
};

/** Maps category to a background color for the progress bar. */
const categoryBgColorMap: Record<string, string> = {
  "Professional Skills": "bg-[#A4F5A6]",
  "Innovation Skills": "bg-[#B3A1FF]",
  "Digital Skills": "bg-[#F2A3B3]",
  "Leadership Skills": "bg-[#F8D57E]",
};

function getAverage(skills: Record<string, number>): number {
  const vals = Object.values(skills);
  if (!vals.length) return 0;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

interface DetailedBreakdownCardProps {
  analysisResults: Record<string, Record<string, number>> | null;
}

export default function DetailedBreakdownCard({ analysisResults }: DetailedBreakdownCardProps) {
  if (!analysisResults) {
    return (
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>Detailed Skill Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <p>No detailed breakdown available yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>Detailed Skill Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.keys(analysisResults).map((category) => {
            const skills = analysisResults[category];
            const average = getAverage(skills);
            const categoryDefinition = categoryDefinitions[category] || "No definition available.";
            return (
              <Card key={category} className="mb-4 shadow-none border w-full ">
                <CardHeader>
                  {/* Title row with tooltip icon */}
                  <div className="flex items-center gap-2">
                    <CardTitle className="whitespace-nowrap">{category}</CardTitle>
                    <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info size={16} className="cursor-pointer" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">{categoryDefinition}</p>
                      </TooltipContent>
                    </Tooltip>
                    </TooltipProvider>
                  </div>
                  <p>Average: {average.toFixed(1)}/10</p>
                </CardHeader>
                <CardContent>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4">
                {Object.entries(skills).map(([skill, score]) => {
                      const skillDefinition = skillDefinitions[skill] || "No definition available.";
                      return (
                        <Card key={skill} className="shadow-none border w-full">
                          <CardContent className="p-2 relative">
                            {/* Skill title with tooltip */}
                            <div className="min-h-[2.5rem] whitespace-normal break-words pr-4">
                              <p className="text-sm mb-1">{skill}</p>
                            </div>

                            <div className="absolute top-1 right-1">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Info size={16} className="cursor-pointer" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-xs">{skillDefinition}</p>
                                </TooltipContent>
                              </Tooltip>
                              </TooltipProvider>
                            </div>

                            {/* Progress bar */}
                            <div className="w-full h-2 rounded-full bg-gray-200">
                              <div
                                className={`h-full rounded-full ${
                                  categoryBgColorMap[category] || "bg-gray-300"
                                }`}
                                style={{ width: `${(score / 10) * 100}%` }}
                              />
                            </div>
                            <p className="text-xs mt-1 text-center text-black">{score}/10</p>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}