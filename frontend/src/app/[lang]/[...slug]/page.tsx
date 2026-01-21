import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPageBySlug } from "@/app/[lang]/utils/get-page-by-slug";
import { FALLBACK_SEO, SITE_URL, ORGANIZATION_INFO } from "@/app/[lang]/utils/constants";
import componentResolver from "../utils/component-resolver";
import type { PageSection } from "@/types/generated";
import { fetchAPI } from "@/app/[lang]/utils/fetch-api";
import { i18n } from "../../../../i18n-config";
import { getStrapiMedia } from "../utils/api-helpers";

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
  const pageUrl = `${SITE_URL}/${lang}/${slugString}`;

  const ogImage = metadata.shareImage?.url
    ? getStrapiMedia(metadata.shareImage.url)
    : `${SITE_URL}/og-image.png`;

  return {
    title: metadata.metaTitle,
    description: metadata.metaDescription,
    alternates: {
      canonical: pageUrl,
      languages: Object.fromEntries(
        i18n.locales.map((locale) => [locale, `${SITE_URL}/${locale}/${slugString}`])
      ),
    },
    openGraph: {
      title: metadata.metaTitle,
      description: metadata.metaDescription,
      url: pageUrl,
      siteName: ORGANIZATION_INFO.name,
      locale: lang === "id" ? "id_ID" : "en_US",
      type: "website",
      images: ogImage
        ? [{ url: ogImage, width: 1200, height: 630, alt: metadata.metaTitle }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: metadata.metaTitle,
      description: metadata.metaDescription,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function PageRoute({ params }: Props) {
  const { slug, lang } = await params;
  const slugString = slug.join("/");
  const page = await getPageBySlug(slugString, lang);
  if (page.data.length === 0) notFound();
  const contentSections = page.data[0].contentSections;
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
