/**
 * Blog Page
 *
 * Fully CMS-configurable page that fetches configuration from Strapi using getPageBySlug('blog').
 * All sections including BlogContent are configured through the CMS.
 *
 * To configure in Strapi:
 * 1. Create a Page with slug "blog"
 * 2. Add sections (HeroSimple, BlogContent, Banner, etc.)
 * 3. For BlogContent section:
 *    - Set pageSize for pagination (default: 10)
 *    - Select highlightedArticles to show in sidebar
 *
 * The BlogContent section handles:
 * - Article listing with client-side pagination
 * - Category filtering via URL params (?category=slug)
 * - Search functionality via URL params (?q=keyword)
 * - Highlighted articles sidebar (from CMS selection)
 */

import { Suspense } from "react";
import type { PageSection } from "@/types/generated";
import componentResolver from "../utils/component-resolver";
import { getPageBySlug } from "@/app/[lang]/utils/get-page-by-slug";
import Loader from "../components/Loader";

interface PageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{
    q?: string;
    category?: string;
    page?: string;
  }>;
}

export default async function BlogPage({ params }: PageProps) {
  const { lang } = await params;

  try {
    // Fetch the blog page configuration from Strapi
    const page = await getPageBySlug("blog", lang);

    if (page.error && page.error.status === 401) {
      throw new Error(
        "Missing or invalid credentials. Have you created an access token using the Strapi admin panel?"
      );
    }

    console.log("Blog Page data:", page); // Debug log

    // If no page found, show error
    if (page.data.length === 0) {
      return (
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-semibold text-gray-900">Blog Page Not Configured</h1>
          <p className="text-gray-600 mt-4">
            Please create a page with slug &quot;blog&quot; in Strapi and add a BlogContent section.
          </p>
        </div>
      );
    }

    const contentSections = page.data[0]?.contentSections || [];

    return (
      <Suspense fallback={<Loader />}>
        <div>
          {/* Render all CMS sections including BlogContent */}
          {contentSections.map((section: PageSection, index: number) =>
            componentResolver(section, index)
          )}
        </div>
      </Suspense>
    );
  } catch (error: unknown) {
    console.error("Blog page error:", error);
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-semibold text-red-600">Error loading blog page</h1>
        <p className="text-gray-600 mt-4">Please check your configuration.</p>
        {error instanceof Error && <p className="text-sm text-gray-500 mt-2">{error.message}</p>}
      </div>
    );
  }
}
