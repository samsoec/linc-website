import { Metadata } from "next";
import { getPageBySlug } from "@/app/[lang]/utils/get-page-by-slug";
import { FALLBACK_SEO } from "@/app/[lang]/utils/constants";
import componentResolver from "../utils/component-resolver";
import type { PageSection } from "@/types/generated";
import { fetchAPI } from "@/app/[lang]/utils/fetch-api";
import { i18n } from "../../../../i18n-config";

type Props = {
  params: Promise<{
    lang: string;
    slug: string[];
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, lang } = await params;
  const slugString = slug.join("/");
  const page = await getPageBySlug(slugString, lang);

  if (!page.data[0]?.seo) return FALLBACK_SEO;
  const metadata = page.data[0].seo;

  return {
    title: metadata.metaTitle,
    description: metadata.metaDescription,
  };
}

export default async function PageRoute({ params }: Props) {
  const { slug, lang } = await params;
  const slugString = slug.join("/");
  const page = await getPageBySlug(slugString, lang);
  if (page.data.length === 0) return null;
  const contentSections = page.data[0].contentSections;
  console.log("Content Sections:", contentSections);
  return contentSections.map((section: PageSection, index: number) =>
    componentResolver(section, index)
  );
}

export async function generateStaticParams() {
  const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
  const path = `/pages`;
  const options = { headers: { Authorization: `Bearer ${token}` } };

  // Fetch all pages from Strapi for all locales
  const allParams: { lang: string; slug: string[] }[] = [];

  for (const locale of i18n.locales) {
    const pageResponse = await fetchAPI(
      path,
      {
        fields: ["slug"],
        locale: locale,
      },
      options
    );

    // Filter out 'home' and 'blog' pages as they have their own routes
    const filteredPages = pageResponse.data.filter(
      (page: { slug: string }) => page.slug !== "home" && page.slug !== "blog"
    );

    const localeParams = filteredPages.map((page: { slug: string }) => ({
      lang: locale,
      slug: [page.slug], // Convert to array for catch-all route
    }));

    allParams.push(...localeParams);
  }

  return allParams;
}
