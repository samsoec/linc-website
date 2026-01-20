"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import LocaleLink from "./LocaleLink";
import { getStrapiMedia, formatDate } from "../utils/api-helpers";
import { fetchAPI } from "../utils/fetch-api";
import type { Article, BlogContentSection, Category } from "@/types/generated";
import Loader from "./Loader";
import Button from "./Button";
import HighlightedPosts from "./HighlightedPosts";
import ChipTabs from "./ChipTabs";
import { useDictionary } from "@/contexts/DictionaryContext";

// =============================================================================
// ARTICLE CARD COMPONENT
// =============================================================================

interface ArticleCardProps {
  article: Article;
  variant?: "default" | "compact";
}

function ArticleCard({ article, variant = "default" }: ArticleCardProps) {
  const { lang } = useDictionary();
  const imageUrl = getStrapiMedia(article.cover?.url || null);
  const category = article.category;
  const articleUrl = `/blog/${article.slug}`;

  if (variant === "compact") {
    return (
      <LocaleLink href={articleUrl} className="group flex gap-4 border border-gray-100 rounded-lg">
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
            {article.publishedAt && <span>{formatDate(article.publishedAt, lang)}</span>}
          </div>
        </div>
      </LocaleLink>
    );
  }

  return (
    <LocaleLink
      href={articleUrl}
      className="group flex flex-col sm:flex-row md:gap-4 border border-gray-100 rounded-lg"
    >
      <div className="relative aspect-[4/3] w-full sm:aspect-auto sm:h-32 sm:w-48 flex-shrink-0 overflow-hidden rounded-lg">
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
      <div className="flex flex-col justify-center p-4 md:py-1">
        {category && (
          <span className="text-xs font-medium text-accent tracking-wide mb-1">
            {category.name}
          </span>
        )}
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-accent transition-colors">
          {article.title}
        </h3>
        {article.publishedAt && (
          <span className="mt-2 text-sm text-gray-500">
            {formatDate(article.publishedAt, lang)}
          </span>
        )}
      </div>
    </LocaleLink>
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
  const { t } = useDictionary();

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

  const allCategory = { name: t("filters.allCategories"), slug: "", id: 0, documentId: "" };

  return (
    <ChipTabs<(typeof categories)[0]>
      items={[allCategory, ...categories]}
      activeIndex={
        activeCategory ? categories.findIndex((cat) => cat.slug === activeCategory) + 1 : 0
      }
      onSelect={(index) => {
        const category = index === 0 ? null : categories[index - 1];
        handleCategoryChange(category ? category.slug : null);
      }}
      getLabel={(item) => item.name || item.slug}
    />
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
  const { lang, t } = useDictionary();
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
            locale: lang,
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
  }, [currentPage, categorySlug, searchQuery, pageSize, lang]);

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
        {t("search.showing")} <span className="font-semibold">{total}</span> {t("search.results")}
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
            <div key={article.id}>
              <ArticleCard article={article} />
            </div>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="text-gray-500">{t("articles.notFound")}</p>
        </div>
      )}

      {hasMore && (
        <div className="pt-4 flex justify-center">
          <Button as="button" type="primary" color="accent" onClick={handleLoadMore}>
            {t("actions.showMore")}
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
      {/* Category Tabs */}
      <div className="mb-8">
        {isLoadingCategories ? (
          <div className="h-10 bg-gray-100 rounded-full animate-pulse" />
        ) : (
          <CategoryTabs categories={categories} activeCategory={activeCategory} />
        )}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Articles List */}
          <Suspense fallback={<Loader />}>
            <ArticleList pageSize={pageSize} />
          </Suspense>
        </div>
        {/* Sidebar */}
        <div className="lg:col-span-1 border-l border-gray-100">
          <div className="sticky top-24">
            <HighlightedPosts data={data.highlight} />
          </div>
        </div>
      </div>
    </div>
  );
}
