import { fetchAPI } from "@/app/[lang]/utils/fetch-api";

export interface RouteParams {
  slug: string;
  category?: string;
}

export default async function LayoutRoute({ children }: { children: React.ReactNode }) {
  return children;
}

export async function generateStaticParams() {
  const { i18n } = await import("../../../../../i18n-config");
  const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
  const path = `/articles`;
  const options = { headers: { Authorization: `Bearer ${token}` } };

  const allParams: { lang: string; slug: string }[] = [];

  for (const locale of i18n.locales) {
    const articleResponse = await fetchAPI(
      path,
      {
        populate: ["category"],
        locale,
      },
      options
    );

    const localeParams = articleResponse.data.map((article: { slug: string }) => ({
      lang: locale,
      slug: article.slug,
    }));
    allParams.push(...localeParams);
  }

  return allParams;
}
