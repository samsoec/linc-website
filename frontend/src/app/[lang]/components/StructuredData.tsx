import { ORGANIZATION_INFO, SITE_URL } from "../utils/constants";

type OrganizationSchemaProps = {
  name?: string;
  description?: string;
  url?: string;
  logo?: string;
};

type ArticleSchemaProps = {
  title: string;
  description: string;
  url: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  authorName?: string;
};

type JobPostingSchemaProps = {
  title: string;
  description: string;
  url: string;
  datePosted?: string;
  validThrough?: string;
  locationName?: string;
  employerName?: string;
};

type BreadcrumbItem = {
  name: string;
  url: string;
};

type BreadcrumbSchemaProps = {
  items: BreadcrumbItem[];
};

type WebPageSchemaProps = {
  title: string;
  description: string;
  url: string;
};

export function OrganizationSchema({
  name = ORGANIZATION_INFO.name,
  description = ORGANIZATION_INFO.description,
  url = ORGANIZATION_INFO.url,
  logo = ORGANIZATION_INFO.logo,
}: OrganizationSchemaProps = {}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    description,
    url,
    logo,
    sameAs: ORGANIZATION_INFO.sameAs,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: ["English", "Indonesian"],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ArticleSchema({
  title,
  description,
  url,
  image,
  datePublished,
  dateModified,
  authorName,
}: ArticleSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url,
    image: image || `${SITE_URL}/og-image.png`,
    datePublished,
    dateModified: dateModified || datePublished,
    author: authorName
      ? {
          "@type": "Person",
          name: authorName,
        }
      : {
          "@type": "Organization",
          name: ORGANIZATION_INFO.name,
        },
    publisher: {
      "@type": "Organization",
      name: ORGANIZATION_INFO.name,
      logo: {
        "@type": "ImageObject",
        url: ORGANIZATION_INFO.logo,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function JobPostingSchema({
  title,
  description,
  url,
  datePosted,
  validThrough,
  locationName,
  employerName = ORGANIZATION_INFO.name,
}: JobPostingSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title,
    description,
    url,
    datePosted,
    validThrough,
    hiringOrganization: {
      "@type": "Organization",
      name: employerName,
      sameAs: ORGANIZATION_INFO.url,
      logo: ORGANIZATION_INFO.logo,
    },
    jobLocation: locationName
      ? {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressLocality: locationName,
            addressCountry: "ID",
          },
        }
      : undefined,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebPageSchema({ title, description, url }: WebPageSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url,
    isPartOf: {
      "@type": "WebSite",
      name: ORGANIZATION_INFO.name,
      url: ORGANIZATION_INFO.url,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
