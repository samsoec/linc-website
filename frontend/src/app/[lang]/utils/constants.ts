export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://lincgrp.com";

export const FALLBACK_SEO = {
  title: "Linc Group",
  description: "Your Integrated Supply Chain Partner",
};

export const DEFAULT_OG_IMAGE = "/og-image.jpg"; // Place a default OG image in /public

export const ORGANIZATION_INFO = {
  name: "Linc Group",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description:
    "Your Integrated Supply Chain Partner. Linc Group is one stop solution for global supply chain services and support.",
  sameAs: [
    // Add your social media URLs here
    // "https://www.linkedin.com/company/lincgroup",
    // "https://www.facebook.com/lincgroup",
    // "https://www.instagram.com/lincgroup",
  ],
};
