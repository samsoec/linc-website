"use client";

import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import { useDictionary } from "@/contexts/DictionaryContext";
import { i18n } from "../../../../i18n-config";

interface LocaleLinkProps extends Omit<LinkProps, "href"> {
  href: string;
  children?: React.ReactNode;
  className?: string;
  [key: string]: unknown;
}

/**
 * LocaleLink wrapper component that automatically prefixes href with current locale
 * Usage: <LocaleLink href="/about">About</LocaleLink>
 * Result: /en/about or /id/about depending on current locale
 */
export default function LocaleLink({ href, children, ...props }: LocaleLinkProps) {
  const { lang } = useDictionary();
  const pathname = usePathname();

  // Get locale from context first, fallback to pathname, then default locale
  const currentLocale = lang || pathname.split("/")[1] || i18n.defaultLocale;

  // Don't prefix if href already starts with a locale or is external
  const isExternal = href.startsWith("http://") || href.startsWith("https://");
  const hasLocale = i18n.locales.some((locale) => href.startsWith(`/${locale}/`));
  const isRoot = href === "/";

  let localizedHref = href;

  if (!isExternal && !hasLocale) {
    // Handle root path
    if (isRoot) {
      localizedHref = `/${currentLocale}`;
    } else {
      // Ensure href starts with /
      const cleanHref = href.startsWith("/") ? href : `/${href}`;
      localizedHref = `/${currentLocale}${cleanHref}`;
    }
  }

  return (
    <Link href={localizedHref} {...props}>
      {children}
    </Link>
  );
}
