"use client";

import { useState, useEffect } from "react";
import { ThreadList } from "@/components/forum_comp/thread-list";
import { ThreadView } from "@/components/forum_comp/thread-view";
import { NewThreadForm } from "@/components/forum_comp/new-thread-form";
import { Button } from "@/components/ui/button";
import { PlusCircle, MessageSquare, FileText, Megaphone, ArrowUpDown, Filter } from "lucide-react";
import type { ApiThread, ThreadType } from "@/types/forum";
import { useTheme } from "@/context/theme-context"; // Import useTheme
import { cn } from "@/lib/utils"; // Import cn

interface MainContentProps {
  initialThreads: ApiThread[];
  fetchError: string | null;
  searchQuery: string;
}

export function MainContent({ initialThreads, fetchError, searchQuery }: MainContentProps) {
  const { darkMode } = useTheme(); // Get darkMode state
  const [activeTab, setActiveTab] = useState<ThreadType | "all">("all");
  const [sortOption, setSortOption] = useState("latest");
  const [threads, setThreads] = useState<ApiThread[]>(initialThreads || []);
  const [selectedThread, setSelectedThread] = useState<ApiThread | null>(null);
  const [isCreatingThread, setIsCreatingThread] = useState(false);
  const [filteredThreads, setFilteredThreads] = useState<ApiThread[]>(threads);

  useEffect(() => {
    setThreads(initialThreads);
  }, [initialThreads]);

  const handleThreadClick = (thread: ApiThread) => {
    setSelectedThread(thread);
    setIsCreatingThread(false);
  };

  const handleBackToList = () => {
    setSelectedThread(null);
  };

  const handleCreateThread = () => {
    setIsCreatingThread(true);
    setSelectedThread(null);
  };

  const handleThreadSubmitted = (newlyCreatedThread: ApiThread) => {
    const updatedThreads = [newlyCreatedThread, ...threads].sort(
        (a, b) => new Date(b.last_activity_at).getTime() - new Date(a.last_activity_at).getTime()
    );
    setThreads(updatedThreads);
    setIsCreatingThread(false);
    setActiveTab(newlyCreatedThread.type); // Switch to the type of the newly created thread
  };

  const handleCancelCreate = () => {
    setIsCreatingThread(false);
  };

  useEffect(() => {
    // Safety check: ensure threads is an array
    if (!Array.isArray(threads)) {
      console.warn('threads is not an array:', threads);
      return;
    }
    
    let tempFilteredThreads = [...threads];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      tempFilteredThreads = tempFilteredThreads.filter((thread) =>
        thread.title.toLowerCase().includes(query) ||
        thread.content.toLowerCase().includes(query) ||
        (thread.author?.username && thread.author.username.toLowerCase().includes(query)) ||
        thread.tags.some((tagObj) => tagObj.name.toLowerCase().includes(query))
      );
    }

    if (activeTab !== "all") {
      tempFilteredThreads = tempFilteredThreads.filter(thread => thread.type === activeTab);
    }

    const sorted = [...tempFilteredThreads].sort((a, b) => {
      if (sortOption === "latest") {
        return new Date(b.last_activity_at).getTime() - new Date(a.last_activity_at).getTime();
      }
      if (sortOption === "oldest") {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
      if (sortOption === "most-upvotes") {
        return b.upvote_count - a.upvote_count;
      }
      if (sortOption === "most-comments") {
        return b.comment_count - a.comment_count;
      }
      return 0;
    });

    setFilteredThreads(sorted);
  }, [threads, activeTab, sortOption, searchQuery]);


  // Define button styles for better readability
  const filterButtonBase = "rounded-full px-4 py-2 text-sm transition-colors duration-150";
  const filterButtonActiveLight = "text-white";
  const filterButtonActiveDark = "text-white"; // Often active buttons can share text color
  const filterButtonInactiveLight = "border-gray-300 text-gray-700 hover:bg-gray-100";
  const filterButtonInactiveDark = "border-gray-600 text-gray-300 hover:bg-gray-700/60";

  const getFilterButtonClasses = (
    tabName: ThreadType | "all",
    colorLight: string, // e.g., "bg-purple-600 hover:bg-purple-700"
    colorDark: string,  // e.g., "bg-purple-600 hover:bg-purple-700"
    hoverTextLight: string, // e.g., "hover:text-purple-700"
    hoverTextDark: string   // e.g., "hover:text-purple-400"
  ) => {
    const isActive = activeTab === tabName;
    if (isActive) {
      return cn(
        filterButtonBase,
        darkMode ? filterButtonActiveDark : filterButtonActiveLight,
        darkMode ? colorDark : colorLight
      );
    }
    return cn(
      filterButtonBase,
      darkMode ? filterButtonInactiveDark : filterButtonInactiveLight,
      darkMode ? hoverTextDark : hoverTextLight
    );
  };


  if (fetchError) {
    return <p className={cn(
        "text-center py-8",
        darkMode ? "text-red-400" : "text-red-500"
    )}>Error: {fetchError}</p>;
  }

  let contentToRender;
  if (selectedThread) {
    contentToRender = <ThreadView thread={selectedThread} onBack={handleBackToList} />;
  } else if (isCreatingThread) {
    contentToRender = <NewThreadForm onSubmitSuccess={handleThreadSubmitted} onCancel={handleCancelCreate} />;
  } else {
    contentToRender = (
      <>
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row flex-wrap items-center gap-2 mb-4">
            <Button
              variant={activeTab === "all" ? "default" : "outline"}
              onClick={() => setActiveTab("all")}
              className={getFilterButtonClasses(
                "all",
                "bg-purple-600 hover:bg-purple-700",
                "bg-purple-600 hover:bg-purple-700", // Active dark purple
                "hover:text-purple-700",
                "hover:text-purple-400"
              )}
            >
              <Filter className="mr-2 h-4 w-4" /> All
            </Button>
            <Button
              variant={activeTab === "discussion" ? "default" : "outline"}
              onClick={() => setActiveTab("discussion")}
              className={getFilterButtonClasses(
                "discussion",
                "bg-blue-500 hover:bg-blue-600",
                "bg-blue-600 hover:bg-blue-700", // Active dark blue
                "hover:text-blue-600",
                "hover:text-blue-400"
              )}
            >
              <MessageSquare className="mr-2 h-4 w-4" /> Discussions
            </Button>
            <Button
              variant={activeTab === "resource" ? "default" : "outline"}
              onClick={() => setActiveTab("resource")}
              className={getFilterButtonClasses(
                "resource",
                "bg-emerald-500 hover:bg-emerald-600",
                "bg-emerald-600 hover:bg-emerald-700", // Active dark emerald
                "hover:text-emerald-600",
                "hover:text-emerald-400"
              )}
            >
              <FileText className="mr-2 h-4 w-4" /> Resources
            </Button>
            <Button
              variant={activeTab === "announcement" ? "default" : "outline"}
              onClick={() => setActiveTab("announcement")}
              className={getFilterButtonClasses(
                "announcement",
                "bg-amber-500 hover:bg-amber-600",
                "bg-amber-600 hover:bg-amber-700", // Active dark amber
                "hover:text-amber-600",
                "hover:text-amber-400"
              )}
            >
              <Megaphone className="mr-2 h-4 w-4" /> Announcements
            </Button>

            <Button
              variant="ghost"
              onClick={() => {
                const options: ("latest" | "oldest" | "most-upvotes" | "most-comments")[] = ["latest", "oldest", "most-upvotes", "most-comments"];
                const currentIndex = options.indexOf(sortOption as any);
                const nextIndex = (currentIndex + 1) % options.length;
                setSortOption(options[nextIndex]);
              }}
              className={cn(
                "ml-auto px-3 py-2 text-sm",
                darkMode
                  ? "text-gray-400 hover:text-purple-400 hover:bg-gray-700/60"
                  : "text-gray-500 hover:text-purple-700"
              )}
              title={`Sort by: ${sortOption.replace("-", " ")}`}
            >
              <ArrowUpDown className="h-4 w-4 mr-1" /> Sort: {sortOption.replace("-", " ")}
            </Button>
          </div>
        </div>
        {filteredThreads.length > 0 ? (
          <ThreadList threads={filteredThreads} onThreadClick={handleThreadClick} />
        ) : (
          <p className={cn(
            "text-center py-8",
            darkMode ? "text-gray-400" : "text-gray-600"
          )}>
            No threads match your current filters.
          </p>
        )}
      </>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className={cn(
          "text-2xl font-bold",
          darkMode ? "text-purple-400" : "text-purple-800"
        )}>
          Explore Forums
        </h1>
        {!isCreatingThread && !selectedThread && (
            <Button
              onClick={handleCreateThread}
              className={cn(
                darkMode
                  ? "bg-purple-600 hover:bg-purple-700 text-white" // Dark mode purple button
                  : "bg-purple-600 hover:bg-purple-700 text-white" // Light mode purple button
              )}
            >
                <PlusCircle className="mr-2 h-4 w-4" />
                New Thread
            </Button>
        )}
      </div>
      {contentToRender}
    </div>
  );
}