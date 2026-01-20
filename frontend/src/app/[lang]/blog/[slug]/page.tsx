import { fetchAPI } from "@/app/[lang]/utils/fetch-api";
import Post from "@/app/[lang]/views/post";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FALLBACK_SEO, SITE_URL, ORGANIZATION_INFO } from "../../utils/constants";
import { getStrapiMedia } from "../../utils/api-helpers";
import { i18n } from "../../../../../i18n-config";
import { ArticleSchema, BreadcrumbSchema } from "../../components/StructuredData";

async function getPostBySlug(slug: string, lang: string) {
  const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
  const path = `/articles`;
  const urlParamsObject = {
    filters: { slug },
    locale: lang,
    populate: {
      cover: { fields: ["url"] },
      authorsBio: { populate: "*" },
      category: { fields: ["name"] },
      blocks: {
        populate: {
          __component: "*",
          files: "*",
          file: "*",
          url: "*",
          body: "*",
          title: "*",
          author: "*",
        },
      },
    },
  };
  const options = { headers: { Authorization: `Bearer ${token}` } };
  const response = await fetchAPI(path, urlParamsObject, options);
  return response;
}

async function getMetaData(slug: string, lang: string) {
  const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
  const path = `/articles`;
  const urlParamsObject = {
    filters: { slug },
    locale: lang,
    populate: { seo: { populate: "*" }, cover: { fields: ["url", "alternativeText"] } },
  };
  const options = { headers: { Authorization: `Bearer ${token}` } };
  const response = await fetchAPI(path, urlParamsObject, options);
  return response.data;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; lang: string }>;
}): Promise<Metadata> {
  const { slug, lang } = await params;
  const meta = await getMetaData(slug, lang);

  if (!meta || meta.length === 0) return FALLBACK_SEO;

  const article = meta[0];
  const metadata = article.seo || FALLBACK_SEO;
  const pageUrl = `${SITE_URL}/${lang}/blog/${slug}`;

  // Use SEO shareImage, or article cover, or fallback
  const ogImage = metadata.shareImage?.url
    ? getStrapiMedia(metadata.shareImage.url)
    : article.cover?.url
      ? getStrapiMedia(article.cover.url)
      : `${SITE_URL}/og-image.jpg`;

  return {
    title: metadata.metaTitle,
    description: metadata.metaDescription,
    alternates: {
      canonical: pageUrl,
      languages: Object.fromEntries(
        i18n.locales.map((locale) => [locale, `${SITE_URL}/${locale}/blog/${slug}`])
      ),
    },
    openGraph: {
      title: metadata.metaTitle,
      description: metadata.metaDescription,
      url: pageUrl,
      siteName: ORGANIZATION_INFO.name,
      locale: lang === "id" ? "id_ID" : "en_US",
      type: "article",
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

export default async function PostRoute({
  params,
}: {
  params: Promise<{ slug: string; lang: string }>;
}) {
  const { slug, lang } = await params;
  const data = await getPostBySlug(slug, lang);
  if (data.data.length === 0) notFound();

  const article = data.data[0];
  const pageUrl = `${SITE_URL}/${lang}/blog/${slug}`;
  const ogImage = article.cover?.url
    ? getStrapiMedia(article.cover.url)
    : `${SITE_URL}/og-image.jpg`;

  return (
    <>
      <ArticleSchema
        title={article.title}
        description={article.description}
        url={pageUrl}
        image={ogImage || undefined}
        datePublished={article.publishedAt}
        dateModified={article.updatedAt}
        authorName={article.authorsBio?.name}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: `${SITE_URL}/${lang}` },
          { name: "Blog", url: `${SITE_URL}/${lang}/blog` },
          { name: article.title, url: pageUrl },
        ]}
      />
      <Post data={article} lang={lang} />
    </>
  );
}

export async function generateStaticParams() {
  const { i18n } = await import("../../../../../i18n-config");
  const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
  const path = `/articles`;
  const options = { headers: { Authorization: `Bearer ${token}` } };

  const allParams: { lang: string; slug: string; category: string }[] = [];

  for (const locale of i18n.locales) {
    const articleResponse = await fetchAPI(
      path,
      {
        populate: ["category"],
        locale,
      },
      options
    );

    const localeParams = articleResponse.data.map(
      (article: {
        slug: string;
        category: {
          slug: string;
        };
      }) => ({ lang: locale, slug: article.slug, category: article.category.slug })
    );
    allParams.push(...localeParams);
  }

  return allParams;
}
