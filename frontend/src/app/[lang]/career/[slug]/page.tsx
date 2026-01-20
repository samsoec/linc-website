import { fetchAPI } from "@/app/[lang]/utils/fetch-api";
import JobDetail from "@/app/[lang]/views/job";
import type { Metadata } from "next";
import { FALLBACK_SEO } from "../../utils/constants";
import NavbarThemeSetter from "../../components/NavbarThemeSetter";

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
    fields: ["name"],
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

  return {
    title: `${meta[0].name} - Careers`,
    description: `Apply for ${meta[0].name} position at LINC`,
  };
}

export default async function JobRoute({ params }: { params: Promise<{ slug: string; lang: string }> }) {
  const { slug, lang } = await params;
  const data = await getJobBySlug(slug, lang);
  if (data.data.length === 0) return <h2>Job not found</h2>;
  return (
    <>
      <NavbarThemeSetter theme="white" />
      <JobDetail data={data.data[0]} />
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
