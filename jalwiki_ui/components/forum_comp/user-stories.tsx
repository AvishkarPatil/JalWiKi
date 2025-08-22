"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { PlusCircle } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { sampleUserStories } from "@/data/sample-user-stories"
import { cn } from "@/lib/utils"

export function UserStories() {
  const [stories, setStories] = useState(sampleUserStories)

  return (
    <Card className="bg-card text-card-foreground border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center justify-between">
          <span className="text-foreground">User Stories</span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-primary hover:text-primary/80"
          >
            <PlusCircle className="h-5 w-5" />
            <span className="sr-only">Add story</span>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {stories.map((story) => (
          <div key={story.id} className="flex gap-3 group">
            <Avatar className="h-8 w-8 border border-border">
              <AvatarImage src={story.author.avatar || "/placeholder.svg"} alt={story.author.name} />
              <AvatarFallback className="bg-muted text-muted-foreground">
                {story.author.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-foreground truncate">
                {story.title}
              </h3>
              <div className="flex items-center text-xs text-muted-foreground">
                <span>{story.author.name}</span>
                <span className="mx-1">•</span>
                <span>{formatDistanceToNow(new Date(story.createdAt), { addSuffix: true })}</span>
              </div>
              <Button 
                variant="link" 
                size="sm" 
                className="h-auto p-0 text-primary hover:text-primary/80 hover:no-underline"
              >
                Read More
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
