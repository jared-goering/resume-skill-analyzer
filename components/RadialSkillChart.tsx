"use client";

import * as React from "react";
import QuadrantChartBase from "@/assets/QuadrantChartBase.svg"; 
// <-- This is the file you exported from Figma (option 2)

type SkillCategories = {
  "Professional Skills": Record<string, number>;
  "Innovation Skills": Record<string, number>;
  "Digital Skills": Record<string, number>;
  "Leadership Skills": Record<string, number>;
};

interface RadialSkillChartProps {
  analysisResults: SkillCategories;
}

/**
 * Example: Renders the static .svg from Figma,
 * plus calculates/overlays some text or info based on skill levels.
 */
export function RadialSkillChart({ analysisResults }: RadialSkillChartProps) {
  // 1. Calculate averages (1..10) per category
  const professionalAvg = getCategoryAverage(analysisResults["Professional Skills"]);
  const innovationAvg = getCategoryAverage(analysisResults["Innovation Skills"]);
  const digitalAvg = getCategoryAverage(analysisResults["Digital Skills"]);
  const leadershipAvg = getCategoryAverage(analysisResults["Leadership Skills"]);

  // 2. If your Figma SVG has separate arcs or IDs for each quadrant,
  //    you can dynamically fill them. For now, let's just display
  //    numeric scores near each quadrant.

  return (
    <div className="relative w-[300px] h-[300px] mx-auto">
      {/* Render the Figma-based SVG as a React component */}
      <QuadrantChartBase className="absolute top-0 left-0 w-full h-full" />
      
      {/* Example: We overlay the average values near each quadrant */}
      <div className="absolute top-6 left-6 text-sm font-semibold">
        Pro: {professionalAvg.toFixed(1)}
      </div>
      <div className="absolute top-6 right-6 text-sm font-semibold">
        Inno: {innovationAvg.toFixed(1)}
      </div>
      <div className="absolute bottom-6 right-6 text-sm font-semibold">
        Lead: {leadershipAvg.toFixed(1)}
      </div>
      <div className="absolute bottom-6 left-6 text-sm font-semibold">
        Digi: {digitalAvg.toFixed(1)}
      </div>
    </div>
  );
}

/**
 * Helper to compute average of the sub-skill scores in each category.
 */
function getCategoryAverage(skills: Record<string, number>): number {
  const vals = Object.values(skills);
  if (!vals.length) return 0;
  const sum = vals.reduce((a, b) => a + b, 0);
  return sum / vals.length;
}