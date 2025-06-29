"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, ThumbsUp } from "lucide-react";
import type { ApiThread } from "@/types/forum";
import { formatDistanceToNow } from "date-fns";
import { useTheme } from "@/context/theme-context"; // Import useTheme
import { cn } from "@/lib/utils"; // Import cn

interface ThreadListProps {
  threads: ApiThread[];
  onThreadClick: (thread: ApiThread) => void;
}

// Updated helper function to get badge class and text for dark mode
const getTypeBadgeProps = (type: ApiThread['type'], darkMode: boolean) => {
  switch (type) {
    case "announcement":
      return {
        text: "Announcement",
        className: darkMode
          ? "bg-amber-900/60 text-amber-300 border-amber-700/70 hover:bg-amber-800/70 text-xs px-2 py-0.5"
          : "bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200 text-xs px-2 py-0.5",
      };
    case "resource":
      return {
        text: "Resource",
        className: darkMode
          ? "bg-emerald-900/60 text-emerald-300 border-emerald-700/70 hover:bg-emerald-800/70 text-xs px-2 py-0.5"
          : "bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200 text-xs px-2 py-0.5",
      };
    case "discussion":
    default:
      return {
        text: "Discussion",
        className: darkMode
          ? "bg-blue-900/60 text-blue-300 border-blue-700/70 hover:bg-blue-800/70 text-xs px-2 py-0.5"
          : "bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200 text-xs px-2 py-0.5",
      };
  }
};

export function ThreadList({ threads, onThreadClick }: ThreadListProps) {
  const { darkMode } = useTheme(); // Get darkMode state

  if (!threads || threads.length === 0) {
    return (
      <p className={cn(
        "text-center py-8",
        darkMode ? "text-gray-500" : "text-gray-500" // No change needed if gray-500 works for both
      )}>
        No threads to display.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {threads.map((thread) => {
        const typeBadge = getTypeBadgeProps(thread.type, darkMode); // Pass darkMode
        const plainTextContent = thread.content.replace(/<[^>]*>/g, '');
        const previewContent = plainTextContent.substring(0, 90);

        return (
          <Card
            key={thread.id}
            className={cn(
              "transition-shadow cursor-pointer",
              darkMode
                ? "bg-gray-800 border-gray-700 hover:border-purple-600 hover:shadow-purple-900/30" // Dark mode card styles
                : "bg-white border-gray-200 hover:shadow-lg" // Light mode card styles
            )}
            onClick={() => onThreadClick(thread)}
          >
            <CardHeader className="pb-2">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1">
                <CardTitle className={cn(
                  "text-lg font-semibold",
                  darkMode ? "text-purple-400" : "text-purple-700" // Title color
                )}>
                  {thread.title}
                </CardTitle>
                <Badge variant="outline" className={typeBadge.className}>
                  {typeBadge.text}
                </Badge>
              </div>
              <div className={cn(
                "flex items-center text-xs mt-1",
                darkMode ? "text-gray-400" : "text-gray-500" // Author info text color
              )}>
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarImage src={thread.author.profile_pic_url || undefined} alt={thread.author.username} />
                  <AvatarFallback>{thread.author.username ? thread.author.username.substring(0, 1).toUpperCase() : 'U'}</AvatarFallback>
                </Avatar>
                <span className={cn(darkMode ? "text-gray-300" : "")}>{thread.author.username || 'Unknown User'}</span>
                <span className="mx-1">·</span>
                <span>{formatDistanceToNow(new Date(thread.created_at), { addSuffix: true })}</span>
              </div>
            </CardHeader>
            <CardContent className={cn(
              "text-sm pt-0 pb-3",
              darkMode ? "text-gray-300" : "text-gray-700" // Preview content text color
            )}>
              <p className="line-clamp-2">
                {previewContent}{plainTextContent.length > 90 ? "..." : ""}
              </p>
            </CardContent>
            <CardFooter className={cn(
              "flex justify-between items-center text-xs pt-0",
              darkMode ? "text-gray-400" : "text-gray-500" // Footer text color
            )}>
              <div className="flex items-center gap-3">
                <span className="flex items-center">
                  <ThumbsUp className="h-3.5 w-3.5 mr-1" /> {thread.upvote_count}
                </span>
                <span className="flex items-center">
                  <MessageSquare className="h-3.5 w-3.5 mr-1" /> {thread.comment_count}
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {thread.tags.slice(0, 3).map((tag) => (
                  <Badge
                    key={tag.id}
                    variant="secondary"
                    className={cn(
                      "text-xs",
                      darkMode
                        ? "bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600" // Dark mode tag badge
                        : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200" // Explicit light mode for consistency
                    )}
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}