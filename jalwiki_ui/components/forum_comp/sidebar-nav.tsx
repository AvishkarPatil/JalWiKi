"use client"

import Link from "next/link"
import { Home, PlusCircle, Bookmark, LayoutList, Droplets, Smile, TrendingUp } from "lucide-react"
import { useTheme } from "@/context/theme-context"; // Import useTheme
import { cn } from "@/lib/utils"; // Import cn

export function SidebarNav() {
  const { darkMode } = useTheme(); // Get darkMode state

  // Placeholder static stats - these would ideally come from an API or be configurable
  const projectStats = {
    waterSavedLiters: "1,250,000",
    happyPeople: "15,000+",
    projectsCompleted: "350"
  };

  const navLinkBase = "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors";
  const navLinkLight = "text-gray-700 hover:bg-gray-100 hover:text-purple-700";
  const navLinkDark = "text-gray-300 hover:bg-gray-700/60 hover:text-purple-400";
  const navIconLight = "text-purple-600";
  const navIconDark = "text-purple-400";

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Main Navigation */}
      <div className="space-y-1">
        <Link
          href="/forum"
          className={cn(navLinkBase, darkMode ? navLinkDark : navLinkLight)}
        >
          <Home className={cn("h-5 w-5", darkMode ? navIconDark : navIconLight)} />
          <span>All Forums</span>
        </Link>
        <Link
          href="/forum/new"
          className={cn(navLinkBase, darkMode ? navLinkDark : navLinkLight)}
        >
          <PlusCircle className={cn("h-5 w-5", darkMode ? navIconDark : navIconLight)} />
          <span>New Post</span>
        </Link>
        <Link
          href="/forum/my-threads"
          className={cn(navLinkBase, darkMode ? navLinkDark : navLinkLight)}
        >
          <LayoutList className={cn("h-5 w-5", darkMode ? navIconDark : navIconLight)} />
          <span>My Threads</span>
        </Link>
        <Link
          href="/forum/saved"
          className={cn(navLinkBase, darkMode ? navLinkDark : navLinkLight)}
        >
          <Bookmark className={cn("h-5 w-5", darkMode ? navIconDark : navIconLight)} />
          <span>Saved</span>
        </Link>
      </div>

      {/* Project Impact / Stats Section */}
      <div className={cn(
        "space-y-3 pt-4 border-t",
        darkMode ? "border-gray-700" : "border-gray-200"
      )}>
        <h3 className={cn(
          "px-3 text-xs font-semibold uppercase tracking-wider",
          darkMode ? "text-gray-500" : "text-gray-500" // gray-500 often works for both, or text-gray-400 for dark
        )}>
          Our Impact
        </h3>
        <div className={cn(
          "space-y-2 px-3 text-sm",
          darkMode ? "text-gray-400" : "text-gray-600"
        )}>
          <div className="flex items-center gap-2">
            <Droplets className={cn("h-5 w-5", darkMode ? "text-blue-400" : "text-blue-500")} />
            <div>
              <span className={cn("font-semibold", darkMode ? "text-gray-100" : "text-gray-800")}>{projectStats.waterSavedLiters}</span> Liters
              <p className={cn("text-xs", darkMode ? "text-gray-500" : "text-gray-500")}>Water Saved Globally</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Smile className={cn("h-5 w-5", darkMode ? "text-green-400" : "text-green-500")} />
            <div>
              <span className={cn("font-semibold", darkMode ? "text-gray-100" : "text-gray-800")}>{projectStats.happyPeople}</span> People
              <p className={cn("text-xs", darkMode ? "text-gray-500" : "text-gray-500")}>Impacted Positively</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className={cn("h-5 w-5", darkMode ? "text-indigo-400" : "text-indigo-500")} />
            <div>
              <span className={cn("font-semibold", darkMode ? "text-gray-100" : "text-gray-800")}>{projectStats.projectsCompleted}</span> Projects
              <p className={cn("text-xs", darkMode ? "text-gray-500" : "text-gray-500")}>Conservation Initiatives</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}