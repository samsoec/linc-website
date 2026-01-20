"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatDate } from "../utils/api-helpers";
import { fetchAPI } from "../utils/fetch-api";
import type { Article, HighlightedArticle } from "@/types/generated";
import { useDictionary } from "@/contexts/DictionaryContext";

interface HighlightedPostsProps {
  data?: HighlightedArticle;
}

export default function HighlightedPosts({ data }: HighlightedPostsProps = {}) {
  const { lang } = useDictionary();
  const [articles, setArticles] = useState<Article[]>([]);
  const [title, setTitle] = useState<string>(data?.title || "Highlighted Post");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchHighlightedArticles() {
      try {
        const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
        const options = { headers: { Authorization: `Bearer ${token}` } };

        const response = await fetchAPI(
          "/highlighted-article",
          {
            populate: {
              articles: {
                populate: {
                  cover: { fields: ["url", "alternativeText"] },
                  category: { fields: ["name", "slug"] },
                },
              },
            },
          },
          options
        );

        // Get the highlighted article data
        const highlightedData = response.data?.articles || [];
        setArticles(highlightedData);

        // Use title from API if not provided via props
        if (!data?.title && response.data?.title) {
          setTitle(response.data.title);
        }
      } catch (error) {
        console.error("Error fetching highlighted articles:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchHighlightedArticles();
  }, [data?.title]);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="h-6 bg-gray-200 rounded w-32 mb-6 animate-pulse" />
        <div className="divide-y divide-gray-100">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 py-4">
              <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 bg-gray-200 rounded w-24 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!articles || articles.length === 0) {
    return null;
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">{title}</h2>

      <div className="divide-y divide-gray-100">
        {articles.map((article, index) => {
          const category = article.category;
          const articleUrl = `/blog/${article.slug}`;

          return (
            <Link key={article.id} href={articleUrl} className="group flex gap-4 items-start py-4">
              <span className="flex-shrink-0 text-lg font-semibold text-accent w-6">
                {index + 1}
              </span>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-accent transition-colors">
                  {article.title}
                </h3>
                <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                  {category && (
                    <>
                      <span className="text-accent">{category.name}</span>
                      <span>·</span>
                    </>
                  )}
                  {article.publishedAt && <span>{formatDate(article.publishedAt, lang)}</span>}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
