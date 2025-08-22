"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, ThumbsUp } from "lucide-react";
import type { ApiThread } from "@/types/forum";
import { formatDistanceToNow } from "date-fns";
// Theme is now handled by CSS variables
import { cn } from "@/lib/utils"; // Import cn

interface ThreadListProps {
  threads: ApiThread[];
  onThreadClick: (thread: ApiThread) => void;
}

// Updated helper function to get badge class and text for dark mode
const getTypeBadgeProps = (type: ApiThread['type']) => {
  switch (type) {
    case "announcement":
      return {
        text: "Announcement",
        className: "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200 dark:bg-amber-900/60 dark:text-amber-200 dark:border-amber-800 dark:hover:bg-amber-800/60 text-xs px-2 py-0.5",
      };
    case "resource":
      return {
        text: "Resource",
        className: "bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200 dark:bg-emerald-900/60 dark:text-emerald-200 dark:border-emerald-800 dark:hover:bg-emerald-800/60 text-xs px-2 py-0.5",
      };
    case "discussion":
    default:
      return {
        text: "Discussion",
        className: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200 dark:bg-blue-900/60 dark:text-blue-200 dark:border-blue-800 dark:hover:bg-blue-800/60 text-xs px-2 py-0.5",
      };
  }
};

export function ThreadList({ threads, onThreadClick }: ThreadListProps) {
  // Theme is now handled by CSS variables

  if (!threads || threads.length === 0) {
    return (
      <p className="text-center py-8 text-muted-foreground">
        No threads to display.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {threads.map((thread) => {
        const typeBadge = getTypeBadgeProps(thread.type); // Removed darkMode
        const plainTextContent = thread.content.replace(/<[^>]*>/g, '');
        const previewContent = plainTextContent.substring(0, 90);

        return (
          <Card
            key={thread.id}
            className={cn(
              "transition-shadow cursor-pointer bg-card text-card-foreground border-border",
              "hover:shadow-md hover:border-primary/50"
            )}
            onClick={() => onThreadClick(thread)}
          >
            <CardHeader className="pb-2">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1">
                <CardTitle className="text-lg font-semibold text-foreground">
                  {thread.title}
                </CardTitle>
                <Badge variant="outline" className={typeBadge.className}>
                  {typeBadge.text}
                </Badge>
              </div>
              <div className="flex items-center text-xs mt-1 text-muted-foreground">
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarImage src={thread.author.profile_pic_url || undefined} alt={thread.author.username} />
                  <AvatarFallback className="bg-muted text-muted-foreground">
                    {thread.author.username ? thread.author.username.substring(0, 1).toUpperCase() : 'U'}
                  </AvatarFallback>
                </Avatar>
                <span className="text-foreground">{thread.author.username || 'Unknown User'}</span>
                <span className="mx-1">·</span>
                <span>{formatDistanceToNow(new Date(thread.created_at), { addSuffix: true })}</span>
              </div>
            </CardHeader>
            <CardContent className="text-sm pt-0 pb-3 text-muted-foreground">
              <p className="line-clamp-2">
                {previewContent}{plainTextContent.length > 90 ? "..." : ""}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between items-center text-xs pt-0 text-muted-foreground">
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
                    className="text-xs bg-muted text-muted-foreground border-border hover:bg-accent/50"
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