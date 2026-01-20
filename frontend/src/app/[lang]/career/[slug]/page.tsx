import { fetchAPI } from "@/app/[lang]/utils/fetch-api";
import JobDetail from "@/app/[lang]/views/job";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FALLBACK_SEO, SITE_URL, ORGANIZATION_INFO } from "../../utils/constants";
import { i18n } from "../../../../../i18n-config";
import NavbarThemeSetter from "../../components/NavbarThemeSetter";
import { JobPostingSchema, BreadcrumbSchema } from "../../components/StructuredData";

async function getJobBySlug(slug: string, lang: string) {
  const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
  const path = `/jobs`;
  const urlParamsObject = {
    filters: { slug },
    locale: lang,
    populate: {
      location: { fields: ["name"] },
      jobDivision: { fields: ["name", "slug"] },
    },
  };
  const options = { headers: { Authorization: `Bearer ${token}` } };
  const response = await fetchAPI(path, urlParamsObject, options);
  return response;
}

async function getMetaData(slug: string, lang: string) {
  const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
  const path = `/jobs`;
  const urlParamsObject = {
    filters: { slug },
    locale: lang,
    populate: {
      seo: { populate: "*" },
      location: { fields: ["name"] },
      jobDivision: { fields: ["name"] },
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

  const job = meta[0];
  const pageUrl = `${SITE_URL}/${lang}/career/${slug}`;

  // Use SEO fields if available, otherwise generate from job fields
  const title = job.seo?.metaTitle || `${job.name} - Careers`;
  const description =
    job.seo?.metaDescription ||
    `Apply for ${job.name} position${job.location?.name ? ` in ${job.location.name}` : ""} at LINC Group`;

  const ogImage = job.seo?.shareImage?.url || `${SITE_URL}/og-image.jpg`;

  return {
    title,
    description,
    alternates: {
      canonical: pageUrl,
      languages: Object.fromEntries(
        i18n.locales.map((locale) => [locale, `${SITE_URL}/${locale}/career/${slug}`])
      ),
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: ORGANIZATION_INFO.name,
      locale: lang === "id" ? "id_ID" : "en_US",
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function JobRoute({
  params,
}: {
  params: Promise<{ slug: string; lang: string }>;
}) {
  const { slug, lang } = await params;
  const data = await getJobBySlug(slug, lang);
  if (data.data.length === 0) notFound();

  const job = data.data[0];
  const pageUrl = `${SITE_URL}/${lang}/career/${slug}`;

  return (
    <>
      <JobPostingSchema
        title={job.name}
        description={`Apply for ${job.name} position at LINC Group`}
        url={pageUrl}
        datePosted={job.publishedAt}
        validThrough={job.dueDate}
        locationName={job.location?.name}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: `${SITE_URL}/${lang}` },
          { name: "Career", url: `${SITE_URL}/${lang}/career` },
          { name: job.name, url: pageUrl },
        ]}
      />
      <NavbarThemeSetter theme="white" />
      <JobDetail data={job} />
    </>
  );
}

export async function generateStaticParams() {
  const { i18n } = await import("../../../../../i18n-config");
  const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
  const path = `/jobs`;
  const options = { headers: { Authorization: `Bearer ${token}` } };

  const allParams: { lang: string; slug: string }[] = [];

  for (const locale of i18n.locales) {
    const jobResponse = await fetchAPI(path, { fields: ["slug"], locale }, options);
    const localeParams = jobResponse.data.map((job: { slug: string }) => ({
      lang: locale,
      slug: job.slug,
    }));
    allParams.push(...localeParams);
  }

  return allParams;
}
