// components/SkillOverviewCard.tsx
"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { RadialSkillChart } from "./RadialSkillChart";

type SkillCategories = {
  'Professional Skills': any;
  'Innovation Skills': any;
  'Digital Skills': any;
  'Leadership Skills': any;
};

interface SkillOverviewCardProps {
  analysisResults: SkillCategories | null;
}

export default function SkillOverviewCard({ analysisResults }: SkillOverviewCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills Overview</CardTitle>
        <CardDescription>Track your skill synergy in each quadrant and discover where to focus your growth.</CardDescription>
      </CardHeader>
      <CardContent>
        {analysisResults ? (
          <RadialSkillChart analysisResults={analysisResults} />
        ) : (
          <p>No analysis available yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
