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
            "transition-colors font-medium rounded-[var(--radius)] border",
            "hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50",
            minimal ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm",
            {
              'bg-secondary text-secondary-foreground border-border': minimal,
              'bg-accent text-accent-foreground border-accent/50': !minimal,
              'hover:bg-accent/90': !minimal,
              'hover:bg-secondary/80': minimal,
            }
          )}
          style={{
            '--radius': '9999px', // Make it fully rounded for pill shape
          } as React.CSSProperties}
        >
          {hashtag}
        </button>
      ))}
    </div>
  );
}