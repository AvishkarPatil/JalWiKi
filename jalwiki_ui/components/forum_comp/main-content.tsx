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
  const [threads, setThreads] = useState<ApiThread[]>(initialThreads);
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


  // Define button styles using design system variables
  const getFilterButtonClasses = (tabName: ThreadType | "all") => {
    const isActive = activeTab === tabName;
    return cn(
      "rounded-full px-4 py-2 text-sm transition-colors duration-150",
      isActive 
        ? "bg-primary text-primary-foreground hover:bg-primary/90" 
        : "border border-border text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
    );
  };


  if (fetchError) {
    return <p className="text-center py-8 text-destructive">Error: {fetchError}</p>;
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
              className={getFilterButtonClasses("all")}
            >
              <Filter className="mr-2 h-4 w-4" /> All
            </Button>
            <Button
              variant={activeTab === "discussion" ? "default" : "outline"}
              onClick={() => setActiveTab("discussion")}
              className={getFilterButtonClasses("discussion")}
            >
              <MessageSquare className="mr-2 h-4 w-4" /> Discussions
            </Button>
            <Button
              variant={activeTab === "resource" ? "default" : "outline"}
              onClick={() => setActiveTab("resource")}
              className={getFilterButtonClasses("resource")}
            >
              <FileText className="mr-2 h-4 w-4" /> Resources
            </Button>
            <Button
              variant={activeTab === "announcement" ? "default" : "outline"}
              onClick={() => setActiveTab("announcement")}
              className={getFilterButtonClasses("announcement")}
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
              className="ml-auto px-3 py-2 text-sm text-muted-foreground hover:text-accent-foreground hover:bg-accent/50"
              title={`Sort by: ${sortOption.replace("-", " ")}`}
            >
              <ArrowUpDown className="h-4 w-4 mr-1" /> Sort: {sortOption.replace("-", " ")}
            </Button>
          </div>
        </div>
        {filteredThreads.length > 0 ? (
          <ThreadList threads={filteredThreads} onThreadClick={handleThreadClick} />
        ) : (
          <p className="text-center py-8 text-muted-foreground">
            No threads match your current filters.
          </p>
        )}
      </>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-foreground">
          Explore Forums
        </h1>
        {!isCreatingThread && !selectedThread && (
            <Button
              onClick={handleCreateThread}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
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