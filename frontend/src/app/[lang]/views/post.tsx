import { formatDate } from "@/app/[lang]/utils/api-helpers";
import componentResolver from "../utils/component-resolver";
import type { Article, ArticleBlock, HeroSimpleSection } from "@/types/generated";
import HeroSimple from "../components/HeroSimple";
import SearchBar from "../components/SearchBar";
import HighlightedPosts from "../components/HighlightedPosts";

export default function Post({ data }: { data: Article }) {
  const { title, publishedAt, cover, category } = data;

  // Build description with category and date
  const categoryName = category?.name || "";
  const dateStr = publishedAt ? formatDate(publishedAt) : "";
  const description = [categoryName, dateStr].filter(Boolean).join(" · ");

  // Create hero data for HeroSimple
  const heroData: HeroSimpleSection = {
    id: 0,
    __component: "sections.hero-simple",
    title,
    description,
    isPictureBlank: false,
    picture: cover,
    mobilePicture: cover,
    hasSearch: false,
  };

  return (
    <article>
      {/* Hero Section */}
      <HeroSimple data={heroData} />

      {/* Content Layout */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Main Content */}
          <div className="lg:col-span-2">
            <div className="prose prose-lg max-w-none">
              {data.blocks.map((section: ArticleBlock, index: number) =>
                componentResolver(section, index)
              )}
            </div>
          </div>

          {/* Right Side - Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Search Bar */}
              <SearchBar size="small" />

              {/* Highlighted Posts */}
              <HighlightedPosts />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
