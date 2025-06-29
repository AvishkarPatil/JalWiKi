// E:/Project/miniProject/JalWiKi/jalwiki_ui/components/forum_comp/user-details.tsx
"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Bookmark, Trophy, Edit, Users, User as UserIcon } from "lucide-react";
import { fetchUserProfile } from "@/lib/userService";
import type { ApiUser } from "@/types/auth";
import { useTheme } from "@/context/theme-context";
import { cn } from "@/lib/utils";

const getCurrentUserId = (): number | null => {
  if (typeof window !== 'undefined') {
    const userIdStr = localStorage.getItem('userId');
    return userIdStr ? parseInt(userIdStr, 10) : null;
  }
  return null;
};

export function UserDetails() {
  const { darkMode } = useTheme();
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
      <Card className={cn(darkMode ? "bg-gray-800 border-gray-700" : "border-gray-200")}>
        <CardHeader className="pb-3">
          <CardTitle className={cn("text-lg font-semibold", darkMode ? "text-gray-100" : "text-gray-900")}>Your Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center text-center py-8">
            <p className={cn(darkMode ? "text-gray-400" : "text-gray-500")}>Loading profile...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error && !user) {
     return (
      <Card className={cn(darkMode ? "bg-gray-800 border-gray-700" : "border-gray-200")}>
        <CardHeader className="pb-3">
          <CardTitle className={cn("text-lg font-semibold", darkMode ? "text-gray-100" : "text-gray-900")}>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center text-center py-4">
            <Avatar className={cn("h-20 w-20 border-2 mb-4", darkMode ? "border-gray-600" : "border-gray-200")}>
              <AvatarFallback className={cn(darkMode ? "bg-gray-700 text-gray-500" : "bg-gray-100 text-gray-500")}>
                <UserIcon size={40}/>
              </AvatarFallback>
            </Avatar>
            <p className={cn("text-sm", darkMode ? "text-gray-300" : "text-gray-600")}>
              {error === "Not logged in." ? "Please log in to view your profile." : "Could not load profile."}
            </p>
            {error === "Not logged in." && (
                <Button
                  onClick={() => window.location.href = '/auth'}
                  className={cn(
                    "mt-4 text-white",
                    darkMode ? "bg-purple-600 hover:bg-purple-700" : "bg-purple-600 hover:bg-purple-700"
                  )}
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
      <Card className={cn(darkMode ? "bg-gray-800 border-gray-700" : "border-gray-200")}>
        <CardHeader className="pb-3">
          <CardTitle className={cn("text-lg font-semibold", darkMode ? "text-gray-100" : "text-gray-900")}>Your Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center text-center">
            <Avatar className={cn("h-20 w-20 border-2", darkMode ? "border-purple-500/60" : "border-purple-100")}>
              {/* Corrected line below */}
              <AvatarImage src={user?.profile_pic || undefined} alt={user?.username || "User"} />
              <AvatarFallback className={cn(darkMode ? "bg-purple-700/40 text-purple-300" : "bg-purple-100 text-purple-700")}>
                {user?.username ? user.username.substring(0, 2).toUpperCase() : "CU"}
              </AvatarFallback>
            </Avatar>

            <h3 className={cn("mt-4 text-lg font-semibold", darkMode ? "text-gray-100" : "text-gray-900")}>
              {user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : user?.username || "Current User"}
            </h3>
            <p className={cn("text-sm mb-4", darkMode ? "text-gray-400" : "text-gray-500")}>{userBio}</p>

            <div className="grid grid-cols-3 w-full gap-2 text-center mb-4">
              <div>
                <span className={cn("text-lg font-semibold", darkMode ? "text-gray-100" : "text-gray-900")}>{stats.threads}</span>
                <span className={cn("block text-xs", darkMode ? "text-gray-400" : "text-gray-500")}>Threads</span>
              </div>
              <div>
                <span className={cn("text-lg font-semibold", darkMode ? "text-gray-100" : "text-gray-900")}>{stats.comments}</span>
                <span className={cn("block text-xs", darkMode ? "text-gray-400" : "text-gray-500")}>Comments</span>
              </div>
              <div>
                <span className={cn("text-lg font-semibold", darkMode ? "text-gray-100" : "text-gray-900")}>{stats.upvotes}</span>
                <span className={cn("block text-xs", darkMode ? "text-gray-400" : "text-gray-500")}>Upvotes</span>
              </div>
            </div>

            <Button className={cn(
              "w-full text-white",
              darkMode ? "bg-purple-600 hover:bg-purple-700" : "bg-purple-600 hover:bg-purple-700"
            )}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {user && (
        <>
          <Card className={cn(darkMode ? "bg-gray-800 border-gray-700" : "border-gray-200")}>
            <CardHeader className="pb-3">
              <CardTitle className={cn("text-sm font-semibold", darkMode ? "text-gray-200" : "text-gray-900")}>Quick Access</CardTitle>
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
                  className={cn(
                    "w-full justify-start",
                    darkMode
                      ? "text-gray-300 hover:bg-gray-700/60 hover:text-purple-400"
                      : "text-gray-700 hover:bg-gray-100 hover:text-purple-700"
                  )}
                  onClick={() => window.location.href = item.href} // Or use Next.js Link for client-side nav
                >
                  <item.icon className={cn("mr-2 h-4 w-4", darkMode ? "text-purple-400" : "text-purple-600")} />
                  {item.label}
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card className={cn(darkMode ? "bg-gray-800 border-gray-700" : "border-gray-200")}>
            <CardHeader className="pb-3">
              <CardTitle className={cn("text-sm font-semibold", darkMode ? "text-gray-200" : "text-gray-900")}>Top Contributors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Avatar className={cn("h-8 w-8 border", darkMode ? "border-gray-600" : "border-gray-200")}>
                    <AvatarImage src={`/placeholder.svg?height=32&width=32&text=U${i}`} alt={`User ${i}`} />
                    <AvatarFallback className={cn(darkMode ? "bg-purple-700/30 text-purple-300" : "bg-purple-100 text-purple-700")}>U{i}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className={cn("text-sm font-medium truncate", darkMode ? "text-gray-100" : "text-gray-900")}>Top User {i}</p>
                    <p className={cn("text-xs", darkMode ? "text-gray-400" : "text-gray-500")}>{120 - i * 20} contributions</p>
                  </div>
                  <Trophy className={cn("h-4 w-4", darkMode ? "text-amber-400" : "text-amber-400")} />
                </div>
              ))}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}