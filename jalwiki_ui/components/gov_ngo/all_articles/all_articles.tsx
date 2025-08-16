"use client"

import Link from "next/link"

interface Article {
  id: number
  title: string
  category: string
  slug: string
  description: string
}

const relatedArticlesData: Article[] = [
  { 
    id: 1, 
    title: "Water Conservation Techniques for Farmers", 
    category: "Agriculture", 
    slug: "water-conservation-techniques-farmers",
    description: "Practical methods and modern approaches that farmers can adopt to save water, improve crop yield, and ensure sustainable farming practices." 
  },
  { 
    id: 2, 
    title: "Rainwater Harvesting: A Comprehensive Guide", 
    category: "Conservation", 
    slug: "rainwater-harvesting-guide",
    description: "Step-by-step insights into setting up rainwater harvesting systems at homes, institutions, and communities to reduce dependency on groundwater." 
  },
  { 
    id: 3, 
    title: "India's Water Crisis: Challenges and Solutions", 
    category: "Policy", 
    slug: "india-water-crisis",
    description: "An analysis of the ongoing water crisis in India, covering root causes, government policies, and long-term strategies for sustainability." 
  },
  { 
    id: 4, 
    title: "Groundwater Depletion in Rural Areas", 
    category: "Research", 
    slug: "groundwater-depletion-rural",
    description: "Research findings on the alarming drop in groundwater levels across rural India and its direct impact on agriculture and livelihoods." 
  },
  { 
    id: 5, 
    title: "Community-Led Water Management Success Stories", 
    category: "Case Studies", 
    slug: "community-water-management",
    description: "Inspiring case studies where communities came together to revive water bodies, manage usage, and create long-lasting impact." 
  },
]

export default function AllArticlesPage() {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-purple-700 dark:text-purple-300">
        All Articles
      </h1>

      <div className="space-y-6">
        {relatedArticlesData.map((article) => (
          <Link
            key={article.id}
            href={`/gov_ngo/all_articles/${article.slug}`}
            className="block p-6 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-gray-800 transition-all duration-200 shadow-sm"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">
              {article.title}
            </h2>
            <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
              {article.category}
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-400 mt-2 line-clamp-3">
              {article.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
