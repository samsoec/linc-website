import {Metadata} from "next";
import {getPageBySlug} from "@/app/[lang]/utils/get-page-by-slug";
import {FALLBACK_SEO} from "@/app/[lang]/utils/constants";
import componentResolver from "../utils/component-resolver";
import type { PageSection } from "@/types/strapi";


type Props = {
    params: Promise<{
        lang: string,
        slug: string
    }>
}


export async function generateMetadata({params}: Props): Promise<Metadata> {
    const { slug, lang } = await params;
    const page = await getPageBySlug(slug, lang);

    if (!page.data[0]?.seo) return FALLBACK_SEO;
    const metadata = page.data[0].seo

    return {
        title: metadata.metaTitle,
        description: metadata.metaDescription
    }
}


export default async function PageRoute({params}: Props) {
    const { slug, lang } = await params;
    const page = await getPageBySlug(slug, lang);
    if (page.data.length === 0) return null;
    const contentSections = page.data[0].contentSections;
    return contentSections.map((section: PageSection, index: number) => componentResolver(section, index));
}
