import type { Metadata } from "next";
import "./globals.css";
import { getStrapiMedia, getStrapiURL } from "./utils/api-helpers";
import { fetchAPI } from "./utils/fetch-api";

import { i18n, Locale } from "../../../i18n-config";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { FALLBACK_SEO } from "@/app/[lang]/utils/constants";
import type { Global, StrapiResponse } from "@/types/generated";

async function getGlobal(lang: string): Promise<StrapiResponse<Global> | null> {
  const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

  if (!token) throw new Error("The Strapi API Token environment variable is not set.");

  const path = `/global`;
  const options = { headers: { Authorization: `Bearer ${token}` } };

  const urlParamsObject = {
    populate: [
      "metadata",
      "favicon",
      "navbar.links.children",
      "navbar.button",
      "navbar.navbarLogo.logoImg",
      "footer.footerLogo.logoImg",
      "footer.holdingLogo.logoImg",
      "footer.menuLinks",
      "footer.aboutLinks",
      "footer.socialLinks",
      "footer.categories",
      "footer.services",
    ],
    locale: lang,
  };
  return await fetchAPI(path, urlParamsObject, options);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;

  if (!i18n.locales.includes(lang as Locale)) {
    return FALLBACK_SEO;
  }

  const meta = await getGlobal(lang);

  if (!meta?.data) return FALLBACK_SEO;

  const { metadata, favicon } = meta.data;
  const { url } = favicon;

  return {
    title: metadata.metaTitle,
    description: metadata.metaDescription,
    icons: {
      icon: [new URL(url, getStrapiURL())],
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  readonly children: React.ReactNode;
  readonly params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  // Validate locale to prevent invalid requests (e.g., favicon.ico being treated as a locale)
  if (!i18n.locales.includes(lang as Locale)) {
    return (
      <html lang="en">
        <body>{children}</body>
      </html>
    );
  }

  const global = await getGlobal(lang);
  // TODO: CREATE A CUSTOM ERROR PAGE
  if (!global?.data) {
    return (
      <html lang={lang}>
        <body>
          <main className="dark:bg-black dark:text-gray-100 min-h-screen">{children}</main>
        </body>
      </html>
    );
  }

  const { navbar, footer } = global.data;

  const navbarLogoUrl = getStrapiMedia(navbar.navbarLogo.logoImg.url);

  const footerLogoUrl = getStrapiMedia(footer.footerLogo.logoImg.url);
  const holdingLogoUrl = footer.holdingLogo?.logoImg?.url
    ? getStrapiMedia(footer.holdingLogo.logoImg.url)
    : null;

  return (
    <html lang={lang}>
      <body>
        <Navbar
          links={navbar.links}
          logoUrl={navbarLogoUrl}
          logoText={navbar.navbarLogo.logoText ?? null}
          button={navbar.button}
          enableSearch={navbar.enableSearch}
          enableI18n={navbar.enableI18n}
        />

        <main className="dark:bg-black dark:text-gray-100 min-h-screen">{children}</main>

        <Footer
          logoUrl={footerLogoUrl}
          logoText={footer.footerLogo.logoText ?? null}
          holdingLogoUrl={holdingLogoUrl}
          menuLinks={footer.menuLinks ?? []}
          aboutLinks={footer.aboutLinks ?? []}
          services={footer.services ?? []}
          categoryLinks={footer.categories ?? []}
          socialLinks={footer.socialLinks ?? []}
          about={footer.about}
          copyright={footer.copyright}
        />
      </body>
    </html>
  );
}

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}
