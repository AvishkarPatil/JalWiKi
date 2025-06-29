"use client"; // Add this as we'll be using a hook

import { useTheme } from "@/context/theme-context"; // Import useTheme
import { cn } from "@/lib/utils"; // Import cn

interface HashtagSectionProps {
  minimal?: boolean;
}

const hashtags = [
  "#SaveWater",
  "#SmartIrrigation",
  "#EveryDropCounts",
  "#WaterConservation",
  "#SustainableWater",
  "#WaterWisdom",
];

export function HashtagSection({ minimal = false }: HashtagSectionProps) {
  const { darkMode } = useTheme(); // Get darkMode state

  return (
    <div className="flex flex-wrap justify-center gap-3">
      {hashtags.map((hashtag, index) => (
        <button
          key={index}
          className={cn(
            "rounded-full transition-colors font-medium",
            minimal
              ? "px-3 py-1.5 text-xs"
              : "px-4 py-2 text-sm",
            minimal
              ? darkMode
                ? "bg-gray-700 hover:bg-gray-600 text-gray-200 border border-gray-600" // Minimal Dark
                : "bg-gray-100 hover:bg-gray-200 text-gray-700" // Minimal Light
              : darkMode
              ? "bg-purple-800/50 hover:bg-purple-700/60 text-purple-300 border border-purple-700/70" // Default Dark
              : "bg-purple-100 hover:bg-purple-200 text-purple-700" // Default Light
          )}
        >
          {hashtag}
        </button>
      ))}
    </div>
  );
}