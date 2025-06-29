import type { UserStory } from "@/types/forum"

export const sampleUserStories: UserStory[] = [
  {
    id: "story-1",
    title: "How I Cut My Water Bill in Half",
    content:
      "By implementing simple changes like fixing leaks, installing low-flow fixtures, and collecting shower water for plants, I reduced my monthly water bill from $80 to $40.",
    author: {
      id: "user-9",
      name: "Michael Brown",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    createdAt: "2024-04-20T10:15:00Z",
  },
  {
    id: "story-2",
    title: "My Greywater System Success",
    content:
      "I installed a greywater system that diverts water from my washing machine to my garden. It was easier than I expected and now waters my vegetable garden automatically!",
    author: {
      id: "user-10",
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    createdAt: "2024-04-18T14:30:00Z",
  },
  {
    id: "story-3",
    title: "Community Rainwater Project",
    content:
      "Our neighborhood association pooled resources to build a shared rainwater collection system for our community garden. It now supplies 90% of our irrigation needs.",
    author: {
      id: "user-11",
      name: "Daniel Kim",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    createdAt: "2024-04-15T09:45:00Z",
  },
  {
    id: "story-4",
    title: "School Water Conservation Program",
    content:
      "As a teacher, I started a water conservation program at my school. Students monitor usage, implement saving strategies, and have reduced the school's water consumption by 25%.",
    author: {
      id: "user-12",
      name: "Jennifer Garcia",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    createdAt: "2024-04-12T16:20:00Z",
  },
]
