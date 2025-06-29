import type { Thread } from "@/types/forum"

export const sampleThreads: Thread[] = [
  {
    id: "thread-1",
    title: "Innovative Rainwater Harvesting Techniques for Urban Areas",
    content:
      "I've been experimenting with a new rainwater harvesting system in my apartment building that has reduced our water consumption by 30%. The system collects rainwater from the roof and filters it for non-potable uses like toilet flushing and garden irrigation. I'd love to share my design and hear about other urban water conservation solutions!",
    author: {
      id: "user-1",
      name: "Emily Chen",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    createdAt: "2024-04-28T14:30:00Z",
    upvotes: 42,
    commentCount: 18,
    tags: ["rainwater", "urban", "conservation", "diy"],
    type: "discussion",
  },
  {
    id: "thread-2",
    title: "Water Conservation Challenge: 30 Days to Reduce Your Footprint",
    content:
      "I'm launching a 30-day water conservation challenge starting next week! Each day will feature a different water-saving tip or activity. By the end of the month, participants should see a significant reduction in their water usage. Who's in?",
    author: {
      id: "user-2",
      name: "Marcus Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    createdAt: "2024-04-27T09:15:00Z",
    upvotes: 35,
    commentCount: 24,
    tags: ["challenge", "conservation", "community"],
    type: "announcement",
  },
  {
    id: "thread-3",
    title: "Comprehensive Guide to Drought-Resistant Landscaping",
    content:
      "After three years of research and experimentation, I've compiled a comprehensive guide to drought-resistant landscaping for various climate zones. The guide includes plant recommendations, soil preparation techniques, and irrigation strategies that minimize water usage while maintaining beautiful outdoor spaces.",
    author: {
      id: "user-3",
      name: "Sophia Martinez",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    createdAt: "2024-04-26T16:45:00Z",
    upvotes: 78,
    commentCount: 32,
    tags: ["landscaping", "drought", "plants", "guide"],
    type: "resource",
  },
  {
    id: "thread-4",
    title: "Water Policy Reform: What Changes Would Make the Biggest Impact?",
    content:
      "I've been studying water policies across different regions, and I'm curious about what policy changes you think would have the most significant impact on water conservation. Should we focus on pricing structures, usage restrictions, incentives for efficient technologies, or something else entirely?",
    author: {
      id: "user-4",
      name: "David Wilson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    createdAt: "2024-04-25T11:20:00Z",
    upvotes: 29,
    commentCount: 45,
    tags: ["policy", "governance", "reform"],
    type: "discussion",
  },
  {
    id: "thread-5",
    title: "Smart Water Monitoring Devices: Reviews and Recommendations",
    content:
      "I've tested several smart water monitoring devices over the past year. These devices can help you track your water usage in real-time and identify leaks or inefficiencies. I'll share my experiences with different products and would love to hear your recommendations as well.",
    author: {
      id: "user-5",
      name: "Aisha Patel",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    createdAt: "2024-04-24T13:50:00Z",
    upvotes: 53,
    commentCount: 27,
    tags: ["technology", "smart-home", "monitoring"],
    type: "resource",
  },
]
