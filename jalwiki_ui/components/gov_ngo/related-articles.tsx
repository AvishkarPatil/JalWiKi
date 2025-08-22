"use client"

import Link from 'next/link'
import { ChevronRightIcon, ArrowRightIcon } from '@heroicons/react/24/outline'

interface Article {
  id: number
  title: string
  category: string
  slug: string
}

interface RelatedArticlesProps {
  articles: Article[]
}

export default function RelatedArticles({ articles }: RelatedArticlesProps) {
  const articlesInTicker = articles.slice(0, 5);

  if (!articles || articles.length === 0) {
    return (
      <p className="text-sm text-center text-muted-foreground py-4">
        No related articles to display.
      </p>
    );
  }

  const scrollableTickerItems = articlesInTicker.length > 0
    ? [...articlesInTicker, ...articlesInTicker]
    : [];

  const animationDuration = articlesInTicker.length > 0 ? articlesInTicker.length * 5 : 10;

  return (
    <div className="w-full">
      {articlesInTicker.length > 0 ? (
        <div className="h-64 overflow-hidden relative group">
          <ul
            className="absolute top-0 left-0 w-full animate-scroll-up group-hover:pause-animation"
            style={{
              animationDuration: `${animationDuration}s`,
            }}
          >
            {scrollableTickerItems.map((article, index) => (
              <li
                key={`${article.id}-${index}`}
                className="mb-3 last:mb-0 border-b border-border"
              >
                <Link
                  href="#"
                  className="block p-3 rounded-lg border border-transparent hover:border-primary/50 hover:bg-accent/50 transition-all duration-200"
                >
                  <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-tight truncate">
                    {article.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center">
                     <ArrowRightIcon className="h-3 w-3 mr-1 text-primary" />
                    {article.category}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : (
         <p className="text-sm text-center text-muted-foreground py-4">
           No related articles available for the ticker.
         </p>
      )}

      {articles.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <Link
            href="#"
            className="flex items-center justify-center w-full text-sm font-medium text-primary hover:text-primary/80 py-2.5 px-3 rounded-lg hover:bg-accent transition-colors duration-150"
          >
            <span>View all articles</span>
            <ChevronRightIcon className="h-4 w-4 ml-1.5" />
          </Link>
        </div>
      )}
    </div>
  );
}