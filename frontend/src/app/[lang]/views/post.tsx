import { formatDate } from "@/app/[lang]/utils/api-helpers";
import componentResolver from "../utils/component-resolver";
import type { Article, ArticleBlock, StrapiMedia } from "@/types/generated";
import HeroSimple from "../components/HeroSimple";
import SearchBar from "../components/SearchBar";
import HighlightedPosts from "../components/HighlightedPosts";
import Banner from "../components/Banner";
import NavbarThemeSetter from "../components/NavbarThemeSetter";

export default function Post({ data }: { data: Article }) {
  const { title, publishedAt, cover, category } = data;

  // Build description with category and date
  const categoryName = category?.name || "";
  const dateStr = publishedAt ? formatDate(publishedAt) : "";
  const description = [categoryName, dateStr].filter(Boolean).join(" · ");

  const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL 
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` 
    : `${process.env.NEXT_PUBLIC_HOSTNAME}`;

  const blankPicture: StrapiMedia = {
    id: 0,
    documentId: '',
    url: `${baseUrl}/background-default.jpg`,
    alternativeText: 'Blank Picture',
  };

  return (
    <article>
      {/* Set Navbar theme to white for this page */}
      <NavbarThemeSetter theme={!cover ? 'white' : 'default'} />
      
      {/* Hero Section */}
      <HeroSimple data={{
        id: 0,
        __component: "sections.hero-simple",
        title,
        description,
        isPictureBlank: !cover,
        picture: cover || blankPicture,
      }} />

      {/* Content Layout */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Main Content */}
          <div className="lg:col-span-2">
            <div className="prose prose-lg max-w-none">
              {data.blocks?.map((section: ArticleBlock, index: number) =>
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

      {/* Banner */}
      <Banner data={{
        id: 0,
        __component: "sections.banner",
        heading: "Let’s Connect with LINC and Manage Your Supply Chain",
        buttons: [
          {
            id: 0,
            __component: "links.button-link",
            text: "Contact Us",
            url: "/contact-us",
            type: "primary",
          }
        ],
        videoButton: {
          id: 0,
          __component: "links.button",
          text: "Watch our Video",
          type: "tertiary",
        }
      }} />
    </article>
  );
}
