"use client"

import Link from "next/link"
import { Home, PlusCircle, Bookmark, LayoutList, Droplets, Smile, TrendingUp } from "lucide-react"
// Theme is now handled by CSS variables
import { cn } from "@/lib/utils"; // Import cn

export function SidebarNav() {
  // Theme is now handled by CSS variables

  // Placeholder static stats - these would ideally come from an API or be configurable
  const projectStats = {
    waterSavedLiters: "1,250,000",
    happyPeople: "15,000+",
    projectsCompleted: "350"
  };

  const navLinkBase = cn(
    "flex items-center gap-3 rounded-[var(--radius)] px-3 py-2 text-sm font-medium transition-colors",
    "text-foreground hover:bg-accent hover:text-accent-foreground"
  );
  const navIconClass = "text-primary";

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Main Navigation */}
      <div className="space-y-1">
        <Link
          href="/forum"
          className={navLinkBase}
        >
          <Home className={cn("h-5 w-5", navIconClass)} />
          <span>All Forums</span>
        </Link>
        <Link
          href="/forum/new"
          className={navLinkBase}
        >
          <PlusCircle className={cn("h-5 w-5", navIconClass)} />
          <span>New Post</span>
        </Link>
        <Link
          href="/forum/my-threads"
          className={navLinkBase}
        >
          <LayoutList className={cn("h-5 w-5", navIconClass)} />
          <span>My Threads</span>
        </Link>
        <Link
          href="/forum/saved"
          className={navLinkBase}
        >
          <Bookmark className={cn("h-5 w-5", navIconClass)} />
          <span>Saved</span>
        </Link>
      </div>

      {/* Project Impact / Stats Section */}
      <div className="space-y-3 pt-4 border-t border-border">
        <h3 className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Our Impact
        </h3>
        <div className="space-y-2 px-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Droplets className="h-5 w-5 text-blue-500" />
            <div>
              <span className="font-semibold text-foreground">{projectStats.waterSavedLiters}</span> Liters
              <p className="text-xs text-muted-foreground/80">Water Saved Globally</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Smile className="h-5 w-5 text-green-500" />
            <div>
              <span className="font-semibold text-foreground">{projectStats.happyPeople}</span> People
              <p className="text-xs text-muted-foreground/80">Impacted Positively</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-indigo-500" />
            <div>
              <span className="font-semibold text-foreground">{projectStats.projectsCompleted}</span> Projects
              <p className="text-xs text-muted-foreground/80">Conservation Initiatives</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}