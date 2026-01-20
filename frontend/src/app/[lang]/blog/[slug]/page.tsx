import { fetchAPI } from "@/app/[lang]/utils/fetch-api";
import Post from "@/app/[lang]/views/post";
import type { Metadata } from "next";
import { FALLBACK_SEO } from "../../utils/constants";

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
    populate: { seo: { populate: "*" } },
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

  const metadata = meta[0].seo || FALLBACK_SEO;

  return {
    title: metadata.metaTitle,
    description: metadata.metaDescription,
  };
}

export default async function PostRoute({
  params,
}: {
  params: Promise<{ slug: string; lang: string }>;
}) {
  const { slug, lang } = await params;
  const data = await getPostBySlug(slug, lang);
  if (data.data.length === 0) return <h2>no post found</h2>;
  return <Post data={data.data[0]} lang={lang} />;
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
