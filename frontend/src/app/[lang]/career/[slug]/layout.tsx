import { fetchAPI } from "@/app/[lang]/utils/fetch-api";
import { NavbarThemeProvider } from "../../contexts/NavbarThemeContext";

export interface RouteParams {
  slug: string;
}

export default async function LayoutRoute({ children }: { children: React.ReactNode }) {
  return <NavbarThemeProvider>{children}</NavbarThemeProvider>;
}

export async function generateStaticParams() {
  const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
  const path = `/jobs`;
  const options = { headers: { Authorization: `Bearer ${token}` } };
  const jobResponse = await fetchAPI(path, { fields: ["slug"] }, options);

  return jobResponse.data.map((job: { slug: string }) => ({ slug: job.slug }));
}
