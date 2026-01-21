import { fetchAPI } from "@/app/[lang]/utils/fetch-api";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FALLBACK_SEO, SITE_URL, ORGANIZATION_INFO } from "../../utils/constants";
import { getStrapiMedia } from "../../utils/api-helpers";
import { i18n } from "../../../../../i18n-config";
import NavbarThemeSetter from "../../components/NavbarThemeSetter";
import { PageSection } from "@/types/generated";
import componentResolver from "../../utils/component-resolver";
import HeroService from "../../components/HeroService";

async function getServiceBySlug(slug: string, lang: string) {
  const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
  const path = `/services`;
  const urlParamsObject = {
    filters: { slug },
    locale: lang,
  };
  const options = { headers: { Authorization: `Bearer ${token}` } };
  const response = await fetchAPI(path, urlParamsObject, options);
  return response;
}

async function getMetaData(slug: string, lang: string) {
  const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
  const path = `/services`;
  const urlParamsObject = {
    filters: { slug },
    locale: lang,
    populate: {
      seo: { populate: "*" },
      picture: { fields: ["url", "alternativeText"] },
    },
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

  if (!meta || meta.length === 0) {
    return FALLBACK_SEO;
  }

  const service = meta[0];
  const pageUrl = `${SITE_URL}/${lang}/service/${slug}`;

  // Use SEO fields if available, otherwise fall back to service fields
  const title = service.seo?.metaTitle || `${service.name} - Services`;
  const description =
    service.seo?.metaDescription ||
    service.description ||
    `Learn more about our ${service.name} service at LINC`;

  // Use SEO shareImage, or service picture, or fallback
  const ogImage = service.seo?.shareImage?.url
    ? getStrapiMedia(service.seo.shareImage.url)
    : service.picture?.url
      ? getStrapiMedia(service.picture.url)
      : `${SITE_URL}/og-image.png`;

  return {
    title,
    description,
    alternates: {
      canonical: pageUrl,
      languages: Object.fromEntries(
        i18n.locales.map((locale) => [locale, `${SITE_URL}/${locale}/service/${slug}`])
      ),
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: ORGANIZATION_INFO.name,
      locale: lang === "id" ? "id_ID" : "en_US",
      type: "website",
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function ServiceRoute({
  params,
}: {
  params: Promise<{ slug: string; lang: string }>;
}) {
  const { slug, lang } = await params;
  const data = await getServiceBySlug(slug, lang);
  if (data.data.length === 0) notFound();
  const contentSections = data.data[0].sections;
  return (
    <>
      <NavbarThemeSetter theme="white" />
      <HeroService data={data.data[0]} />
      {contentSections?.map((section: PageSection, index: number) =>
        componentResolver(section, index)
      )}
    </>
  );
}

export async function generateStaticParams() {
  const { i18n } = await import("../../../../../i18n-config");
  const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
  const path = `/services`;
  const options = { headers: { Authorization: `Bearer ${token}` } };

  const allParams: { lang: string; slug: string }[] = [];

  for (const locale of i18n.locales) {
    const serviceResponse = await fetchAPI(path, { fields: ["slug"], locale }, options);
    const localeParams = serviceResponse.data.map((service: { slug: string }) => ({
      lang: locale,
      slug: service.slug,
    }));
    allParams.push(...localeParams);
  }

  return allParams;
}
