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
  "Innovation Skills": "#7339FF",
  "Digital Skills": "#FF4B4B",
  "Leadership Skills": "#FF6A00",
};

// Map each category to its lighter interior fill color for light mode
const categoryFillColorMap: Record<string, string> = {
  "Professional Skills": "#EAF9F6",
  "Innovation Skills": "#EDE9F8",
  "Digital Skills": "#FFEDED",
  "Leadership Skills": "#FFF0E5",
};

// Map each category to a fill color for dark mode (you can choose different values)
const categoryDarkFillColorMap: Record<string, string> = {
    "Professional Skills": "#2AC5A980", // 50% opacity
    "Innovation Skills": "#4E22B980",
    "Digital Skills": "#FF4B4B80",
    "Leadership Skills": "#FF6A0080",
  };

function getAverage(skills: Record<string, number>): number {
  const vals = Object.values(skills);
  if (!vals.length) return 0;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

interface DetailedBreakdownCardProps {
  analysisResults: Record<string, Record<string, number>> | null;
  darkMode: boolean;
}

export default function DetailedBreakdownCard({ analysisResults, darkMode }: DetailedBreakdownCardProps) {
  // Global collapsed state for the entire card
  const [collapsed, setCollapsed] = useState(false);

  // Shared style for the top-level card (same approach as ResumeFormCard/SkillOverviewCard)
  const topLevelCardStyles = `
    w-full max-w-xl 
    rounded-md 
    shadow-[0_6px_15px_rgba(0,0,0,0.05)] 
    border border-gray-200 
    bg-white 
    text-black 
    dark:border-none 
    dark:bg-gradient-to-b dark:from-[#433F4D] dark:to-[#302D39]
    dark:text-gray-100
  `;

  // If there's no analysis, show a placeholder card.
  if (!analysisResults) {
    return (
      <Card className={topLevelCardStyles}>
        <CardHeader>
          <CardTitle>Detailed Skill Breakdown</CardTitle>
          <CardDescription>
            Your skill profile, organized into four essential domains.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>No detailed breakdown available yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={topLevelCardStyles}>
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
            // Choose fill color based on darkMode state
            const fillColor = darkMode
              ? categoryDarkFillColorMap[category] || "#444"
              : categoryFillColorMap[category] || "#eee";

            return (
              // Category-Level Card
              <Card
                key={category}
                className="
                  mb-4 
                  rounded-md 
                  shadow-none 
                  border 
                  border-gray-200 
                  dark:border-gray-600 
                  bg-transparent
                  text-inherit
                  w-full
                "
              >
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
                    <div className="relative mt-2 w-full h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                      {/* Inner progress bar with dynamic width & category border */}
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
                          const skillDefinition =
                            skillDefinitions[skill] || "No definition available.";

                          return (
                            // Individual Skill Card
                            <Card
                              key={skill}
                              className="
                                shadow-none 
                                border 
                                border-gray-200 
                                dark:border-gray-600 
                                bg-white 
                                dark:bg-[#3B3744]
                                text-black 
                                dark:text-gray-100
                                rounded-md 
                                w-full
                              "
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

                                {/* Skill progress bar */}
                                <div className="relative w-full h-2 rounded-full bg-gray-200 dark:bg-gray-700">
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
                                <p className="text-xs mt-1 text-center">
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