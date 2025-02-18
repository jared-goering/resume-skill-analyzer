"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { skillDefinitions } from "@/utils/skillDefinitions"; // adjust path as needed
import { Info, CaretUp, CaretDown } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

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

// Map each category to a border color (original bright color)
const categoryBorderColorMap: Record<string, string> = {
    "Professional Skills": "#2AC5A9",
    "Innovation Skills": "#4E22B9",
    "Digital Skills": "#FF4B4B",
    "Leadership Skills": "#FF6A00",
  };
  
  // Map each category to its lighter interior fill color
  const categoryFillColorMap: Record<string, string> = {
    "Professional Skills": "#EAF9F6",
    "Innovation Skills": "#EDE9F8",
    "Digital Skills": "#FFEDED",
    "Leadership Skills": "#FFF0E5",
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
  // Global collapsed state for the entire card
  const [collapsed, setCollapsed] = useState(false);

  if (!analysisResults) {
    return (
        <Card className="w-full max-w-xl rounded-md 
        shadow-[0_6px_15px_rgba(0,0,0,0.05)] 
        border-none">
        <CardHeader>
          <CardTitle>Detailed Skill Breakdown</CardTitle>
          <CardDescription>Your skill profile, organized into four essential domains.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>No detailed breakdown available yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-xl rounded-md 
    shadow-[0_6px_15px_rgba(0,0,0,0.05)] 
    border-none ">
      <CardHeader className="relative">
        <CardTitle>Detailed Skill Breakdown</CardTitle>
        <CardDescription>
          Your skill profile, organized into four essential domains.
        </CardDescription>
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 p-2"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <CaretDown size={20} /> : <CaretUp size={20} />}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.keys(analysisResults).map((category) => {
            const skills = analysisResults[category];
            const average = getAverage(skills);
            const categoryDefinition = categoryDefinitions[category] || "No definition available.";
            const borderColor = categoryBorderColorMap[category] || "#000";
            const fillColor = categoryFillColorMap[category] || "#eee";

            return (
              <Card key={category} className="mb-4 rounded-md shadow-none border w-full">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <CardTitle>{category}</CardTitle>
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

                  {collapsed && (
                    <div className="relative mt-2 w-full h-2 rounded-full bg-gray-200">
                      {/* This inner div gets the border & dynamic width */}
                      <div
                        className="absolute top-0 left-0 h-2 rounded-full overflow-hidden"
                        style={{
                          width: `${(average / 10) * 100}%`,
                          border: `1px solid ${borderColor}`,
                        }}
                      >
                        <div
                          className="h-full w-full"
                          style={{
                            backgroundColor: fillColor,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </CardHeader>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    collapsed ? "max-h-0" : "max-h-[1000px]"
                  }`}
                >
                  {!collapsed && (
                    <CardContent>
                      <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4">
                        {Object.entries(skills).map(([skill, score]) => {
                          const skillDefinition = skillDefinitions[skill] || "No definition available.";

                          return (
                            <Card
                              key={skill}
                              className="shadow-none border w-full rounded-md"
                            >
                              <CardContent className="p-2 relative">
                                <div className="min-h-[2.5rem] pr-4">
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

                                {/* Same border/fill logic at the skill level */}
                                <div className="relative w-full h-2 rounded-full bg-gray-200">
                                  <div
                                    className="absolute top-0 left-0 h-2 rounded-full overflow-hidden"
                                    style={{
                                      width: `${(score / 10) * 100}%`,
                                      border: `1px solid ${borderColor}`,
                                    }}
                                  >
                                    <div
                                      className="h-full w-full"
                                      style={{
                                        backgroundColor: fillColor,
                                      }}
                                    />
                                  </div>
                                </div>
                                <p className="text-xs mt-1 text-center text-black">
                                  {score}/10
                                </p>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    </CardContent>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}