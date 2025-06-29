"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { WaterEfficiencyForm } from "@/components/water_ai/water-efficiency-form";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/theme-context";
import { useAuth } from "@/context/auth-context";

export default function WaterAiPage() {
  const { darkMode } = useTheme();
  const { user, loading: isLoadingAuth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoadingAuth) {
      return;
    }
    if (!user) {
      router.replace("/auth?redirect=/waterai");
    }
  }, [user, isLoadingAuth, router]);

  if (isLoadingAuth) {
    return (
      <div className={cn("flex min-h-screen items-center justify-center p-4", darkMode ? "bg-gray-950" : "bg-gray-100")}>
        <Loader2 className="h-16 w-16 animate-spin text-purple-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className={cn("flex min-h-screen items-center justify-center p-4", darkMode ? "bg-gray-950" : "bg-gray-100")}>
        <Loader2 className="h-16 w-16 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <main
      className={cn(
        "min-h-screen transition-colors duration-300",
        darkMode
          ? "bg-gray-950 text-gray-200"
          : "bg-gray-50 text-gray-900"
      )}
    >
      <div className="max-w-5xl mx-auto py-10 sm:py-12 px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-10 sm:mb-12">
          <h1
            className={cn(
              "text-3xl sm:text-4xl font-bold mb-3",
              darkMode ? "text-purple-400" : "text-purple-700"
            )}
          >
            Water Efficiency Recommendation System
          </h1>
          <p
            className={cn(
              "max-w-3xl mx-auto text-sm sm:text-base",
              darkMode ? "text-gray-400" : "text-gray-600"
            )}
          >
            Personalized strategies for efficient water use and impactful conservation.
          </p>
        </header>

        <WaterEfficiencyForm />
      </div>
      <Toaster />
    </main>
  );
}