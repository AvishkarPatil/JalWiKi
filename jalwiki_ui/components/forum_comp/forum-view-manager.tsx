"use client";

import { useState } from "react";
import { SearchBar } from "@/components/forum_comp/search-bar";
import { MainContent } from "@/components/forum_comp/main-content";
import type { ApiThread } from "@/types/forum";

interface ForumViewManagerProps {
  initialThreads: ApiThread[];
  fetchError: string | null;
}

export function ForumViewManager({ initialThreads, fetchError }: ForumViewManagerProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    // Root div
    <div>
      {/* Div wrapping SearchBar */}
      <div className="mb-6"> {/* Add some margin below the search bar */}
        <SearchBar onSearch={setSearchQuery} />
      </div>
      {/* MainContent component */}
      <MainContent
        initialThreads={initialThreads}
        fetchError={fetchError}
        searchQuery={searchQuery}
      />
    </div>
  );
}