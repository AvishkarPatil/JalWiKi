import type { Comment } from "@/types/forum"

export const sampleComments: Comment[] = [
  {
    id: "comment-1",
    threadId: "thread-1",
    author: {
      id: "user-6",
      name: "Robert Taylor",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content:
      "This is fascinating! I've been thinking about implementing something similar in my building. Could you share more details about the filtration system you're using?",
    createdAt: "2024-04-28T15:45:00Z",
    upvotes: 12,
    replies: [
      {
        id: "reply-1",
        threadId: "thread-1",
        author: {
          id: "user-1",
          name: "Emily Chen",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        content:
          "I'm using a three-stage filtration system: a debris filter to catch leaves and large particles, a sand filter for smaller sediments, and a carbon filter for chemical contaminants. The whole setup cost about $500 and took a weekend to install.",
        createdAt: "2024-04-28T16:20:00Z",
        upvotes: 8,
      },
      {
        id: "reply-2",
        threadId: "thread-1",
        author: {
          id: "user-6",
          name: "Robert Taylor",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        content:
          "That's more affordable than I expected! Do you have any recommendations for specific brands or models?",
        createdAt: "2024-04-28T16:45:00Z",
        upvotes: 3,
      },
    ],
  },
  {
    id: "comment-2",
    threadId: "thread-1",
    author: {
      id: "user-7",
      name: "Lisa Wong",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content:
      "I implemented a similar system last year and it's been amazing. One tip: make sure to clean the filters regularly, especially after heavy rainfall. I learned that the hard way when my system got clogged and overflowed!",
    createdAt: "2024-04-28T17:10:00Z",
    upvotes: 15,
    replies: [],
  },
  {
    id: "comment-3",
    threadId: "thread-1",
    author: {
      id: "user-8",
      name: "James Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content:
      "Have you considered adding a UV sterilization stage? It might allow you to use the water for more purposes, though it would add to the cost and complexity.",
    createdAt: "2024-04-28T18:30:00Z",
    upvotes: 7,
    replies: [],
  },
]
