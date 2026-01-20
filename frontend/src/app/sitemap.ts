import { MetadataRoute } from "next";
import { i18n } from "../../i18n-config";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://lincgrp.com";

async function fetchFromStrapi(path: string, params = {}) {
  const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";

  const queryString = new URLSearchParams(
    Object.entries(params).map(([key, value]) => [key, String(value)])
  ).toString();

  const url = `${baseUrl}/api${path}${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    next: { revalidate: 3600 }, // Revalidate sitemap every hour
  });

  if (!response.ok) {
    console.error(`Failed to fetch ${path}:`, response.statusText);
    return { data: [] };
  }

  return response.json();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Add static routes for each locale
  for (const locale of i18n.locales) {
    // Home page
    sitemapEntries.push({
      url: `${SITE_URL}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
      alternates: {
        languages: Object.fromEntries(i18n.locales.map((l) => [l, `${SITE_URL}/${l}`])),
      },
    });
  }

  // Fetch all pages
  for (const locale of i18n.locales) {
    try {
      const pagesResponse = await fetchFromStrapi("/pages", {
        "fields[0]": "slug",
        "fields[1]": "updatedAt",
        locale,
      });

      for (const page of pagesResponse.data || []) {
        if (page.slug === "home") continue; // Skip home, already added

        sitemapEntries.push({
          url: `${SITE_URL}/${locale}/${page.slug}`,
          lastModified: page.updatedAt ? new Date(page.updatedAt) : new Date(),
          changeFrequency: "weekly",
          priority: 0.8,
          alternates: {
            languages: Object.fromEntries(
              i18n.locales.map((l) => [l, `${SITE_URL}/${l}/${page.slug}`])
            ),
          },
        });
      }
    } catch (error) {
      console.error(`Error fetching pages for ${locale}:`, error);
    }
  }

  // Fetch all articles/blog posts
  for (const locale of i18n.locales) {
    try {
      const articlesResponse = await fetchFromStrapi("/articles", {
        "fields[0]": "slug",
        "fields[1]": "updatedAt",
        locale,
      });

      for (const article of articlesResponse.data || []) {
        sitemapEntries.push({
          url: `${SITE_URL}/${locale}/blog/${article.slug}`,
          lastModified: article.updatedAt ? new Date(article.updatedAt) : new Date(),
          changeFrequency: "monthly",
          priority: 0.6,
          alternates: {
            languages: Object.fromEntries(
              i18n.locales.map((l) => [l, `${SITE_URL}/${l}/blog/${article.slug}`])
            ),
          },
        });
      }
    } catch (error) {
      console.error(`Error fetching articles for ${locale}:`, error);
    }
  }

  // Fetch all services
  for (const locale of i18n.locales) {
    try {
      const servicesResponse = await fetchFromStrapi("/services", {
        "fields[0]": "slug",
        "fields[1]": "updatedAt",
        locale,
      });

      for (const service of servicesResponse.data || []) {
        sitemapEntries.push({
          url: `${SITE_URL}/${locale}/service/${service.slug}`,
          lastModified: service.updatedAt ? new Date(service.updatedAt) : new Date(),
          changeFrequency: "monthly",
          priority: 0.7,
          alternates: {
            languages: Object.fromEntries(
              i18n.locales.map((l) => [l, `${SITE_URL}/${l}/service/${service.slug}`])
            ),
          },
        });
      }
    } catch (error) {
      console.error(`Error fetching services for ${locale}:`, error);
    }
  }

  // Fetch all jobs
  for (const locale of i18n.locales) {
    try {
      const jobsResponse = await fetchFromStrapi("/jobs", {
        "fields[0]": "slug",
        "fields[1]": "updatedAt",
        locale,
      });

      for (const job of jobsResponse.data || []) {
        sitemapEntries.push({
          url: `${SITE_URL}/${locale}/career/${job.slug}`,
          lastModified: job.updatedAt ? new Date(job.updatedAt) : new Date(),
          changeFrequency: "weekly",
          priority: 0.6,
          alternates: {
            languages: Object.fromEntries(
              i18n.locales.map((l) => [l, `${SITE_URL}/${l}/career/${job.slug}`])
            ),
          },
        });
      }
    } catch (error) {
      console.error(`Error fetching jobs for ${locale}:`, error);
    }
  }

  return sitemapEntries;
}
