"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const titleColorMap: Record<string, string> = {
  "Professional Skills": "text-[#A4F5A6]",
  "Innovation Skills": "text-[#B3A1FF]",
  "Digital Skills": "text-[#F2A3B3]",
  "Leadership Skills": "text-[#F8D57E]",
};

// Instead of generating the bg- class dynamically, we declare them explicitly.
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
  return (
    <Card>
      <CardHeader>
        <CardTitle>Detailed Skill Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        {analysisResults ? (
          <div className="space-y-4">
            {Object.keys(analysisResults).map((category) => {
              const skills = analysisResults[category];
              const average = getAverage(skills);
              return (
                <Card key={category} className="mb-4">
                  <CardHeader>
                    <CardTitle>{category}</CardTitle>
                    <p>
                      Average: {average.toFixed(1)}/10
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-4">
                      {Object.entries(skills).map(([skill, score]) => (
                        <div key={skill} className="w-40">
                          <p className="text-sm mb-1">{skill}</p>
                          {/* Custom progress bar */}
                          <div className="w-full h-2 rounded-full bg-gray-200">
                            <div
                              className={`h-full rounded-full ${categoryBgColorMap[category] || "bg-gray-300"}`}
                              style={{ width: `${(score / 10) * 100}%` }}
                            />
                          </div>
                          <p className="text-xs mt-1 text-center text-black">
                            {score}/10
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <p>No detailed breakdown available yet.</p>
        )}
      </CardContent>
    </Card>
  );
}