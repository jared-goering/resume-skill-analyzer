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
 * Displays a 300x300 quadrant chart (from Figma),
 * plus a single "current level" circle whose position
 * is weighted by each quadrant's average skill.
 */
export function RadialSkillChart({ analysisResults }: RadialSkillChartProps) {
  // 1) Compute the average skill (1..10) for each quadrant
  const proAvg = getAverage(analysisResults["Professional Skills"]);
  const innoAvg = getAverage(analysisResults["Innovation Skills"]);
  const digiAvg = getAverage(analysisResults["Digital Skills"]);
  const leadAvg = getAverage(analysisResults["Leadership Skills"]);

  // 2) Convert those averages into a single position
  //    We'll define each quadrant's "center" in an abstract -1..+1 coordinate system,
  //    then scale to 300px container. Adjust or tweak these coordinates if you like.
  const { x, y } = getWeightedCenter(proAvg, innoAvg, digiAvg, leadAvg);

  // 3) Our container is 300x300, so the center is (150, 150).
  //    We'll shift the circle by +/- x,y from the center, scaled by e.g. ~100 px
  const containerSize = 400;
  const center = containerSize / 2;
  const radiusScale = 300; // how far out from center a "10" might push

  // Weighted center from -1..+1 => actual pixel offset
  const circleRadius = 56; // circle size in px
  const circleLeft = center + x * radiusScale - circleRadius / 2;
  const circleTop = center + y * radiusScale - circleRadius / 2;

  return (
    <div className="relative w-[400px] h-[400px] mx-auto">
      {/* 4) Render your Figma-based quadrants */}
      <QuadrantChartBase />

      {/* 5) Absolutely-positioned "Current Level" circle */}
      <div
  className="absolute flex items-center justify-center bg-white opacity-50 border border-gray-300 text-xs text-center rounded-full shadow"
  style={{
    width: circleRadius,
    height: circleRadius,
    left: circleLeft,
    top: circleTop,
  }}
>
  <span className="text-black font-semibold">Current Level</span>
</div>
    </div>
  );
}

/**
 * Simple average of sub-skill scores
 */
function getAverage(skills: Record<string, number>): number {
  const vals = Object.values(skills);
  if (!vals.length) return 0;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

/**
 * Weighted center function:
 * - We'll treat each quadrant as a "vector" in a 2D plane
 * - Multiply that vector by the quadrant's average skill
 * - Sum them up, divide by total skill => final (x,y)
 *
 * The quadrant vectors used here:
 *   Pro  => (-1, -1) top-left
 *   Inno => (+1, -1) top-right
 *   Digi => (-1, +1) bottom-left
 *   Lead => (+1, +1) bottom-right
 *
 * You can tweak these vectors if you want different geometry.
 */
function getWeightedCenter(pro: number, inno: number, digi: number, lead: number) {
  // 1) Decide on an exponent factor, say 1.5 or 2
  const exponent = 2;

  // 2) Raise each skill to that power
  const p = pro ** exponent;
  const i = inno ** exponent;
  const d = digi ** exponent;
  const l = lead ** exponent;

  // 3) Weighted sum as before
  const sum = p + i + d + l;
  if (sum === 0) return { x: 0, y: 0 };

  // Quadrant vectors
  const proVec = { x: -1, y: -1 };
  const innoVec = { x: +1, y: -1 };
  const digiVec = { x: -1, y: +1 };
  const leadVec = { x: +1, y: +1 };

  // Weighted average
  const x = (proVec.x * p + innoVec.x * i + digiVec.x * d + leadVec.x * l) / sum;
  const y = (proVec.y * p + innoVec.y * i + digiVec.y * d + leadVec.y * l) / sum;

  return { x, y };
}