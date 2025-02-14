"use client";

import { useEffect, useState } from "react";

interface TimedProgressBarProps {
  loading: boolean;
  onComplete?: () => void; 
}

export default function TimedProgressBar({ loading, onComplete }: TimedProgressBarProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    let timeout: NodeJS.Timeout | null = null;

    if (loading) {
      setProgress(0);
      
      // Increase progress ~1.67% every 100ms => ~6s to reach 100%
      interval = setInterval(() => {
        setProgress((prev) => {
          const next = prev + 1.67;
          return next >= 100 ? 100 : next;
        });
      }, 100);

      // After 6s, ensure progress is 100 and optionally call onComplete
      timeout = setTimeout(() => {
        setProgress(100);
        if (onComplete) onComplete();
      }, 6000);
    } else {
      setProgress(0);
    }

    return () => {
      if (interval) clearInterval(interval);
      if (timeout) clearTimeout(timeout);
    };
  }, [loading, onComplete]);

  if (!loading) return null;

  return (
    <div className="mt-4 space-y-2">
      <div className="relative w-full h-2 bg-gray-200 rounded overflow-hidden">
        <div
          className="h-full bg-blue-500 animate-pulse"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-sm text-gray-700">Analyzing resume, please wait...</p>
    </div>
  );
}