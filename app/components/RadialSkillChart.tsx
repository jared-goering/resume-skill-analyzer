"use client";

import * as React from "react";
import { QuadrantChartBase } from "./QuadrantChartBase"; // your inline Figma SVG

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
 * Displays a quadrant chart plus a single "current level" circle whose position
 * is weighted by each quadrant's average skill. The container and positions scale responsively.
 */
export function RadialSkillChart({ analysisResults }: RadialSkillChartProps) {
  // 1) Compute the average skill (1..10) for each quadrant.
  const proAvg = getAverage(analysisResults["Professional Skills"]);
  const innoAvg = getAverage(analysisResults["Innovation Skills"]);
  const digiAvg = getAverage(analysisResults["Digital Skills"]);
  const leadAvg = getAverage(analysisResults["Leadership Skills"]);

  // 2) Compute the weighted center using a baseline container size of 400px.
  const containerSize = 400; // baseline size in pixels for our calculations
  const center = containerSize / 2;
  const radiusScale = 300; // how far a "10" might push out in pixels
  const circleRadius = 75; // circle size in pixels
  const { x, y } = getWeightedCenter(proAvg, innoAvg, digiAvg, leadAvg);

  // Calculate the circle's position in pixels (based on a 400px container).
  const circleLeftPx = center + x * radiusScale - circleRadius / 2;
  const circleTopPx = center + y * radiusScale - circleRadius / 2;

  // 3) Convert pixel values to percentages relative to the baseline container size.
  const circleLeftPercent = (circleLeftPx / containerSize) * 100;
  const circleTopPercent = (circleTopPx / containerSize) * 100;
  const circleDiameterPercent = (circleRadius / containerSize) * 100;

  return (
    // The container is fluid: full width, with a max-width of 400px and a square aspect ratio.
    <div className="relative w-full max-w-[400px] aspect-square mx-auto">
      <QuadrantChartBase className="w-full h-full" />

      {/* "Current Level" circle positioned using percentages */}
     {/* "Current Level" multi-ring wrapper */}
     <div
  className="absolute"
  style={{
    width: `${circleDiameterPercent}%`,
    height: `${circleDiameterPercent}%`,
    left: `${circleLeftPercent}%`,
    top: `${circleTopPercent}%`,
  }}
>
  <div className="relative w-full h-full">
    {/* Semi-transparent background */}
    <div className="absolute inset-0 ounded-full z-0" />
    
    {/* Outer ring */}
    <div className="absolute inset-0 rounded-full border border-[#F087FF] bg-white opacity-60 z-10" />

    {/* Inner ring with centered text */}
    <div className="absolute inset-1.5 rounded-full border border-[#F087FF] bg-white opacity-80 z-20 
                flex items-center justify-center">
  <span className="text-[#F087FF] font-semibold text-xs text-center whitespace-nowrap">
    Current<br />Level
  </span>
</div>
  </div>
</div>
    </div>
  );
}

/**
 * Computes the average of skill scores.
 */
function getAverage(skills: Record<string, number>): number {
  const vals = Object.values(skills);
  if (!vals.length) return 0;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

/**
 * Computes the weighted center using each quadrant's average skill.
 *
 * The quadrant vectors used are:
 *   Professional Skills: (-1, -1) top-left
 *   Innovation Skills:   (+1, -1) top-right
 *   Digital Skills:      (-1, +1) bottom-left
 *   Leadership Skills:   (+1, +1) bottom-right
 */
function getWeightedCenter(pro: number, inno: number, digi: number, lead: number) {
  const exponent = 2;
  const p = pro ** exponent;
  const i = inno ** exponent;
  const d = digi ** exponent;
  const l = lead ** exponent;
  const sum = p + i + d + l;
  if (sum === 0) return { x: 0, y: 0 };

  const proVec = { x: -1, y: -1 };
  const innoVec = { x: 1, y: -1 };
  const digiVec = { x: -1, y: 1 };
  const leadVec = { x: 1, y: 1 };

  const x = (proVec.x * p + innoVec.x * i + digiVec.x * d + leadVec.x * l) / sum;
  const y = (proVec.y * p + innoVec.y * i + digiVec.y * d + leadVec.y * l) / sum;
  return { x, y };
}