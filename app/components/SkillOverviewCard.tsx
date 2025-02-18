// components/SkillOverviewCard.tsx
"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { RadialSkillChart } from "./RadialSkillChart";

type SkillCategories = {
  "Professional Skills": any;
  "Innovation Skills": any;
  "Digital Skills": any;
  "Leadership Skills": any;
};

interface SkillOverviewCardProps {
  analysisResults: SkillCategories | null;
  darkMode: boolean; // Add darkMode prop here
}

export default function SkillOverviewCard({ analysisResults, darkMode }: SkillOverviewCardProps) {
    return (
    <Card 
      className="
        w-full max-w-xl 
        rounded-md 
        shadow-[0_6px_15px_rgba(0,0,0,0.05)] 
        border border-gray-200 
        bg-white 
        text-black 
        dark:border-none 
        dark:bg-gradient-to-b dark:from-[#433F4D] dark:to-[#302D39]
        dark:text-gray-100
      "
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Skills Overview</CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-300">
          Track your skill synergy in each quadrant and discover where to focus your growth.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {analysisResults ? (
          <RadialSkillChart analysisResults={analysisResults} darkMode={darkMode} />
        ) : (
          <p>No analysis available yet.</p>
        )}
      </CardContent>
    </Card>
  );
}