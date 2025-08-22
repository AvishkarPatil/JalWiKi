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

  if (isLoadingAuth || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="max-w-5xl mx-auto py-10 sm:py-12 px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-10 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-primary">
            Water Efficiency Recommendation System
          </h1>
          <p className="max-w-3xl mx-auto text-sm sm:text-base text-muted-foreground">
            Personalized strategies for efficient water use and impactful conservation.
          </p>
        </header>

        <WaterEfficiencyForm />
      </div>
      <Toaster />
    </main>
  );
}