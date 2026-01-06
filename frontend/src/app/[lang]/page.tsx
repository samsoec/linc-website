import LangRedirect from "./components/LangRedirect";
import componentResolver from "./utils/component-resolver";
import { getPageBySlug } from "@/app/[lang]/utils/get-page-by-slug";
import type { PageSection } from "@/types/generated";

export default async function RootRoute({ params }: { params: Promise<{ lang: string }> }) {
  try {
    const { lang } = await params;
    const page = await getPageBySlug("home", lang);
    if (page.error && page.error.status == 401)
      throw new Error(
        "Missing or invalid credentials. Have you created an access token using the Strapi admin panel? http://localhost:1337/admin/"
      );

    if (page.data.length == 0 && lang !== "en") return <LangRedirect />;
    if (page.data.length === 0) return null;
    const contentSections = page.data[0].contentSections;
    // console.log("Page contentSections:", contentSections);
    return contentSections.map((section: PageSection, index: number) =>
      componentResolver(section, index)
    );
  } catch (error: unknown) {
    console.error("Page error:", error);
    return <div>Error loading page. Please check your credentials.</div>;
  }
}
