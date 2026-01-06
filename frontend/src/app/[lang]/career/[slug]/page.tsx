import { fetchAPI } from "@/app/[lang]/utils/fetch-api";
import JobDetail from "@/app/[lang]/views/job";
import type { Metadata } from "next";
import { FALLBACK_SEO } from "../../utils/constants";
import NavbarThemeSetter from "../../components/NavbarThemeSetter";

async function getJobBySlug(slug: string) {
  const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
  const path = `/jobs`;
  const urlParamsObject = {
    filters: { slug },
    populate: {
      location: { fields: ["name"] },
      jobDivision: { fields: ["name", "slug"] },
    },
  };
  const options = { headers: { Authorization: `Bearer ${token}` } };
  const response = await fetchAPI(path, urlParamsObject, options);
  return response;
}

async function getMetaData(slug: string) {
  const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
  const path = `/jobs`;
  const urlParamsObject = {
    filters: { slug },
    fields: ["name"],
  };
  const options = { headers: { Authorization: `Bearer ${token}` } };
  const response = await fetchAPI(path, urlParamsObject, options);
  return response.data;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const meta = await getMetaData(slug);

  if (!meta || meta.length === 0) {
    return FALLBACK_SEO;
  }

  return {
    title: `${meta[0].name} - Careers`,
    description: `Apply for ${meta[0].name} position at LINC`,
  };
}

export default async function JobRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getJobBySlug(slug);
  if (data.data.length === 0) return <h2>Job not found</h2>;
  return <><NavbarThemeSetter theme="white" /><JobDetail data={data.data[0]} /></>;
}

export async function generateStaticParams() {
  const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
  const path = `/jobs`;
  const options = { headers: { Authorization: `Bearer ${token}` } };
  const jobResponse = await fetchAPI(path, { fields: ["slug"] }, options);

  return jobResponse.data.map((job: { slug: string }) => ({ slug: job.slug }));
}
