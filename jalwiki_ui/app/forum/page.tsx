"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { ForumLayout } from "@/components/forum_comp/forum-layout";
import { ForumViewManager } from "@/components/forum_comp/forum-view-manager";
import { fetchForumThreads } from "@/lib/forumService";
import type { ApiThread } from "@/types/forum";
import { useAuth } from "@/context/auth-context";
import { useTheme } from "@/context/theme-context";
import { cn } from "@/lib/utils";

export default function ForumHomePage() {
  const { darkMode } = useTheme();
  const { user, loading: isLoadingAuth } = useAuth();
  const router = useRouter();

  const [threads, setThreads] = useState<ApiThread[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    if (isLoadingAuth) {
      return;
    }
    if (!user) {
      router.replace("/auth?redirect=/forum");
    }
  }, [user, isLoadingAuth, router]);

  useEffect(() => {
    if (!isLoadingAuth && user) {
      async function loadThreads() {
        setIsLoadingData(true);
        try {
          const fetchedThreads = await fetchForumThreads();
          setThreads(fetchedThreads);
          setError(null);
        } catch (err: any) {
          console.error("Failed to fetch forum threads:", err);
          setError(err.detail || err.message || "Could not load threads. Please try again later.");
          setThreads([]);
        } finally {
          setIsLoadingData(false);
        }
      }
      loadThreads();
    } else if (!isLoadingAuth && !user) {
      setIsLoadingData(false);
    }
  }, [user, isLoadingAuth]);

  if (isLoadingAuth) {
    return (
      <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center p-4 bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center p-4 bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <ForumLayout>
      {isLoadingData && !error && (
         <div className="flex min-h-[calc(100vh-20rem)] items-center justify-center p-4 bg-background">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
         </div>
      )}
      {!isLoadingData && (
        <ForumViewManager initialThreads={threads} fetchError={error} />
      )}
    </ForumLayout>
  );
}