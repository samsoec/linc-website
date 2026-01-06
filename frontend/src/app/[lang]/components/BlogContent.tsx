"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getStrapiMedia, formatDate } from "../utils/api-helpers";
import { fetchAPI } from "../utils/fetch-api";
import type { Article, BlogContentSection, Category } from "@/types/generated";
import Loader from "./Loader";
import Button from "./Button";
import HighlightedPosts from "./HighlightedPosts";

// =============================================================================
// ARTICLE CARD COMPONENT
// =============================================================================

interface ArticleCardProps {
  article: Article;
  variant?: "default" | "compact";
}

function ArticleCard({ article, variant = "default" }: ArticleCardProps) {
  const imageUrl = getStrapiMedia(article.cover?.url || null);
  const category = article.category;
  const articleUrl = `/blog/${article.slug}`;

  if (variant === "compact") {
    return (
      <Link href={articleUrl} className="group flex gap-4">
        <div className="relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-100">
              <span className="text-gray-400">No image</span>
            </div>
          )}
        </div>
        <div className="flex flex-col justify-center">
          <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-accent transition-colors">
            {article.title}
          </h4>
          <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
            {category && <span>{category.name}</span>}
            {category && article.publishedAt && <span>·</span>}
            {article.publishedAt && <span>{formatDate(article.publishedAt)}</span>}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={articleUrl} className="group flex gap-4 sm:gap-6">
      <div className="relative h-24 w-32 sm:h-32 sm:w-48 flex-shrink-0 overflow-hidden rounded-lg">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100">
            <span className="text-gray-400">No image</span>
          </div>
        )}
      </div>
      <div className="flex flex-col justify-center py-1">
        {category && (
          <span className="text-xs font-medium text-accent uppercase tracking-wide mb-1">
            {category.name}
          </span>
        )}
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-accent transition-colors">
          {article.title}
        </h3>
        {article.publishedAt && (
          <span className="mt-2 text-sm text-gray-500">{formatDate(article.publishedAt)}</span>
        )}
      </div>
    </Link>
  );
}

// =============================================================================
// CATEGORY TABS COMPONENT
// =============================================================================

interface CategoryTabsProps {
  categories: Category[];
  activeCategory?: string;
}

function CategoryTabs({ categories, activeCategory }: CategoryTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleCategoryChange = (categorySlug: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (categorySlug) {
      params.set("category", categorySlug);
    } else {
      params.delete("category");
    }

    params.delete("page");
    router.push(`?${params.toString()}`);
  };

  const isActive = (slug: string | null) => {
    if (slug === null) {
      return !activeCategory;
    }
    return activeCategory === slug;
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={() => handleCategoryChange(null)}
        className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
          isActive(null) ? "bg-accent text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        All Categories
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => handleCategoryChange(category.slug)}
          className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
            isActive(category.slug)
              ? "bg-accent text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}

// =============================================================================
// ARTICLE LIST COMPONENT
// =============================================================================

interface ArticleListProps {
  pageSize: number;
}

function ArticleList({ pageSize }: ArticleListProps) {
  const searchParams = useSearchParams();
  const [articles, setArticles] = useState<Article[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const categorySlug = searchParams.get("category") || undefined;
  const searchQuery = searchParams.get("q") || undefined;

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
    setArticles([]);
  }, [categorySlug, searchQuery]);

  useEffect(() => {
    async function fetchArticles() {
      setIsLoading(true);
      try {
        const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
        const options = { headers: { Authorization: `Bearer ${token}` } };

        const filters: Record<string, unknown> = {};

        if (categorySlug) {
          filters.category = { slug: { $eq: categorySlug } };
        }

        if (searchQuery) {
          filters.$or = [
            { title: { $containsi: searchQuery } },
            { description: { $containsi: searchQuery } },
          ];
        }

        const response = await fetchAPI(
          "/articles",
          {
            sort: { publishedAt: "desc" },
            populate: {
              cover: { fields: ["url", "alternativeText"] },
              category: { fields: ["name", "slug"] },
              authorsBio: { fields: ["name"] },
            },
            filters,
            pagination: {
              page: currentPage,
              pageSize,
            },
          },
          options
        );

        // Append articles if loading more, replace if first page
        if (currentPage === 1) {
          setArticles(response.data || []);
        } else {
          setArticles((prev) => [...prev, ...(response.data || [])]);
        }
        setTotal(response.meta?.pagination?.total || 0);
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchArticles();
  }, [currentPage, categorySlug, searchQuery, pageSize]);

  const hasMore = articles.length < total;

  const handleLoadMore = () => {
    setCurrentPage((prev) => prev + 1);
  };

  if (isLoading) {
    return (
      <div className="py-12 flex justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-600">
        Showing <span className="font-semibold">{total}</span> results
        {searchQuery && (
          <>
            {" "}
            for &quot;<span className="font-semibold">{searchQuery}</span>&quot;
          </>
        )}
      </p>

      {articles.length > 0 ? (
        <div className="space-y-6">
          {articles.map((article) => (
            <div key={article.id} className="pb-6 border-b border-gray-100 last:border-0">
              <ArticleCard article={article} />
            </div>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="text-gray-500">No articles found</p>
        </div>
      )}

      {hasMore && (
        <div className="pt-4 flex justify-center">
          <Button as="button" type="primary" color="accent" onClick={handleLoadMore}>
            Show More
          </Button>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// BLOG CONTENT SECTION (MAIN COMPONENT)
// =============================================================================

interface BlogContentProps {
  data: BlogContentSection;
}

export default function BlogContent({ data }: BlogContentProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const searchParams = useSearchParams();

  const pageSize = 10;
  const activeCategory = searchParams.get("category") || undefined;

  useEffect(() => {
    async function fetchCategories() {
      try {
        const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
        const options = { headers: { Authorization: `Bearer ${token}` } };

        const response = await fetchAPI(
          "/categories",
          {
            sort: { name: "asc" },
            populate: "*",
          },
          options
        );

        setCategories(response.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoadingCategories(false);
      }
    }

    fetchCategories();
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Category Tabs */}
          <div className="mb-8">
            {isLoadingCategories ? (
              <div className="h-10 bg-gray-100 rounded-full animate-pulse" />
            ) : (
              <CategoryTabs categories={categories} activeCategory={activeCategory} />
            )}
          </div>

          {/* Articles List */}
          <Suspense fallback={<Loader />}>
            <ArticleList pageSize={pageSize} />
          </Suspense>
        </div>
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <HighlightedPosts data={data.highlight} />
          </div>
        </div>
      </div>
    </div>
  );
}
