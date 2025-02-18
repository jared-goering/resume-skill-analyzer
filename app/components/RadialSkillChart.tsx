"use client";

import * as React from "react";
import { QuadrantChartBase } from "./QuadrantChartBase"; // light mode SVG
import { DarkQuadrantChart } from "./DarkQuadrantChart"; // dark mode SVG

type SkillCategories = {
  "Professional Skills": Record<string, number>;
  "Innovation Skills": Record<string, number>;
  "Digital Skills": Record<string, number>;
  "Leadership Skills": Record<string, number>;
};

interface RadialSkillChartProps {
  analysisResults: SkillCategories;
  darkMode: boolean; // New prop
}

/**
 * Displays a quadrant chart plus a "current level" circle whose position
 * is weighted by each quadrant's average skill.
 */
export function RadialSkillChart({ analysisResults, darkMode }: RadialSkillChartProps) {
  // 1) Compute the average skill (1..10) for each quadrant.
  const proAvg = getAverage(analysisResults["Professional Skills"]);
  const innoAvg = getAverage(analysisResults["Innovation Skills"]);
  const digiAvg = getAverage(analysisResults["Digital Skills"]);
  const leadAvg = getAverage(analysisResults["Leadership Skills"]);

  // 2) Compute the weighted center using a baseline container size of 400px.
  const containerSize = 400;
  const center = containerSize / 2;
  const radiusScale = 300;
  const circleRadius = 75;
  const { x, y } = getWeightedCenter(proAvg, innoAvg, digiAvg, leadAvg);

  const circleLeftPx = center + x * radiusScale - circleRadius / 2;
  const circleTopPx = center + y * radiusScale - circleRadius / 2;

  // 3) Convert pixel values to percentages.
  const circleLeftPercent = (circleLeftPx / containerSize) * 100;
  const circleTopPercent = (circleTopPx / containerSize) * 100;
  const circleDiameterPercent = (circleRadius / containerSize) * 100;

  return (
    <div className="relative w-full max-w-[400px] aspect-square mx-auto">
      {/* Conditionally render the appropriate SVG based on darkMode */}
      {darkMode ? (
        <DarkQuadrantChart className="w-full h-full" />
      ) : (
        <QuadrantChartBase className="w-full h-full" />
      )}

      {/* "Current Level" circle */}
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
          {darkMode ? (
            <>
              {/* Outer ring for dark mode */}
              <div className="absolute inset-0 rounded-full border border-[#F087FF] bg-[#2D2D2D] opacity-60 z-10 drop-shadow-md" />
              {/* Inner ring with text for dark mode */}
              <div className="absolute inset-1.5 rounded-full border border-[#F087FF] bg-[#2D2D2D] opacity-80 z-20 flex items-center justify-center">
                <span className="text-white font-semibold text-xs text-center whitespace-nowrap">
                  Current<br />Level
                </span>
              </div>
            </>
          ) : (
            <>
              {/* Outer ring for light mode */}
              <div className="absolute inset-0 rounded-full border border-[#F087FF] bg-white opacity-60 z-10 drop-shadow-md" />
              {/* Inner ring with text for light mode */}
              <div className="absolute inset-1.5 rounded-full border border-[#F087FF] bg-white opacity-80 z-20 flex items-center justify-center">
                <span className="text-[#F087FF] font-semibold text-xs text-center whitespace-nowrap">
                  Current<br />Level
                </span>
              </div>
            </>
          )}
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
  return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
}

/**
 * Computes the weighted center using each quadrant's average skill.
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