import { fetchAPI } from "@/app/[lang]/utils/fetch-api";
import type { Metadata } from "next";
import { FALLBACK_SEO } from "../../utils/constants";
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
    fields: ["name", "description"],
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
    title: `${meta[0].name} - Services`,
    description: meta[0].description || `Learn more about our ${meta[0].name} service at LINC`,
  };
}

export default async function ServiceRoute({ params }: { params: Promise<{ slug: string; lang: string }> }) {
  const { slug, lang } = await params;
  const data = await getServiceBySlug(slug, lang);
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
