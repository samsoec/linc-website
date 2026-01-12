import { fetchAPI } from "@/app/[lang]/utils/fetch-api";

export interface RouteParams {
  slug: string;
  category?: string;
}

export default async function LayoutRoute({ children }: { children: React.ReactNode }) {
  return children;
}

export async function generateStaticParams() {
  const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
  const path = `/articles`;
  const options = { headers: { Authorization: `Bearer ${token}` } };
  const articleResponse = await fetchAPI(
    path,
    {
      populate: ["category"],
    },
    options
  );

  return articleResponse.data.map((article: { slug: string }) => ({ slug: article.slug }));
}
