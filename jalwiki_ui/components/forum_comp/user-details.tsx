// E:/Project/miniProject/JalWiKi/jalwiki_ui/components/forum_comp/user-details.tsx
"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Bookmark, Trophy, Edit, Users, User as UserIcon } from "lucide-react";
import { fetchUserProfile } from "@/lib/userService";
import type { ApiUser } from "@/types/auth";
// Theme is now handled by CSS variables
import { cn } from "@/lib/utils";

const getCurrentUserId = (): number | null => {
  if (typeof window !== 'undefined') {
    const userIdStr = localStorage.getItem('userId');
    return userIdStr ? parseInt(userIdStr, 10) : null;
  }
  return null;
};

export function UserDetails() {
  // Theme is now handled by CSS variables
  const [user, setUser] = useState<ApiUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUserProfile = async () => {
      const userId = getCurrentUserId();
      if (userId) {
        try {
          setIsLoading(true);
          const userData = await fetchUserProfile(userId);
          setUser(userData);
          setError(null);
        } catch (err) {
          console.error("Failed to load user profile:", err);
          setError("Could not load profile.");
          setUser(null);
        } finally {
          setIsLoading(false);
        }
      } else {
        setError("Not logged in.");
        setIsLoading(false);
        setUser(null);
      }
    };

    loadUserProfile();
  }, []);

  const userBio = "Water conservation enthusiast";
  const stats = {
    threads: 12,
    comments: 48,
    upvotes: 156,
  };

  if (isLoading) {
    return (
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-foreground">Your Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center text-center py-8">
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error && !user) {
    return (
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-foreground">Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center text-center py-4">
            <Avatar className="h-20 w-20 border-2 border-border mb-4">
              <AvatarFallback className="bg-muted text-muted-foreground">
                <UserIcon size={40} className="text-muted-foreground/50"/>
              </AvatarFallback>
            </Avatar>
            <p className="text-sm text-muted-foreground">
              {error === "Not logged in." ? "Please log in to view your profile." : "Could not load profile."}
            </p>
            {error === "Not logged in." && (
              <Button
                onClick={() => window.location.href = '/auth'}
                className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Login
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-foreground">Your Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center text-center">
            <Avatar className="h-20 w-20 border-2 border-primary/20">
              <AvatarImage src={user?.profile_pic || undefined} alt={user?.username || "User"} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {user?.username ? user.username.substring(0, 2).toUpperCase() : "CU"}
              </AvatarFallback>
            </Avatar>

            <h3 className="mt-4 text-lg font-semibold text-foreground">
              {user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : user?.username || "Current User"}
            </h3>
            <p className="text-sm mb-4 text-muted-foreground">{userBio}</p>

            <div className="grid grid-cols-3 w-full gap-2 text-center mb-4">
              <div>
                <span className="text-lg font-semibold text-foreground">{stats.threads}</span>
                <span className="block text-xs text-muted-foreground">Threads</span>
              </div>
              <div>
                <span className="text-lg font-semibold text-foreground">{stats.comments}</span>
                <span className="block text-xs text-muted-foreground">Comments</span>
              </div>
              <div>
                <span className="text-lg font-semibold text-foreground">{stats.upvotes}</span>
                <span className="block text-xs text-muted-foreground">Upvotes</span>
              </div>
            </div>

            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {user && (
        <>
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-foreground">Quick Access</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { label: "Notifications", icon: Bell, href: "/forum/notifications" },
                { label: "Saved Threads", icon: Bookmark, href: "/forum/saved" },
                { label: "Leaderboard", icon: Trophy, href: "/forum/leaderboard" },
                { label: "Members", icon: Users, href: "/forum/members" },
              ].map((item) => (
                <Button
                  key={item.label}
                  variant="ghost"
                  className="w-full justify-start text-foreground/80 hover:text-foreground hover:bg-accent/50"
                  onClick={() => window.location.href = item.href}
                >
                  <item.icon className="mr-2 h-4 w-4 text-primary" />
                  {item.label}
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-foreground">Top Contributors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Avatar className="h-8 w-8 border border-border">
                    <AvatarImage src={`/placeholder.svg?height=32&width=32&text=U${i}`} alt={`User ${i}`} />
                    <AvatarFallback className="bg-primary/10 text-primary">U{i}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate text-foreground">Top User {i}</p>
                    <p className="text-xs text-muted-foreground">{120 - i * 20} contributions</p>
                  </div>
                  <Trophy className="h-4 w-4 text-amber-400" />
                </div>
              ))}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}