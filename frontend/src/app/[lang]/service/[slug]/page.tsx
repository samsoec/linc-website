import { fetchAPI } from "@/app/[lang]/utils/fetch-api";
import type { Metadata } from "next";
import { FALLBACK_SEO } from "../../utils/constants";
import NavbarThemeSetter from "../../components/NavbarThemeSetter";
import { PageSection } from "@/types/generated";
import componentResolver from "../../utils/component-resolver";
import HeroService from "../../components/HeroService";

async function getServiceBySlug(slug: string) {
  const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
  const path = `/services`;
  const urlParamsObject = {
    filters: { slug },
  };
  const options = { headers: { Authorization: `Bearer ${token}` } };
  const response = await fetchAPI(path, urlParamsObject, options);
  return response;
}

async function getMetaData(slug: string) {
  const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
  const path = `/services`;
  const urlParamsObject = {
    filters: { slug },
    fields: ["name", "description"],
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
    title: `${meta[0].name} - Services`,
    description: meta[0].description || `Learn more about our ${meta[0].name} service at LINC`,
  };
}

export default async function ServiceRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getServiceBySlug(slug);
  if (data.data.length === 0) return <h2>Service not found</h2>;
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
  const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
  const path = `/services`;
  const options = { headers: { Authorization: `Bearer ${token}` } };
  const serviceResponse = await fetchAPI(path, { fields: ["slug"] }, options);

  return serviceResponse.data.map((service: { slug: string }) => ({ slug: service.slug }));
}
