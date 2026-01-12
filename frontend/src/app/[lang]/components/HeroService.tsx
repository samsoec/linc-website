"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getStrapiMedia } from "../utils/api-helpers";
import type { Service } from "@/types/generated";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

interface HeroServiceProps {
  data: Service;
}

export default function HeroService({ data }: HeroServiceProps) {
  const pathname = usePathname();

  if (!data) {
    return null;
  }

  const imageUrl = getStrapiMedia(data.picture?.url || null);
  const iconUrl = getStrapiMedia(data.icon?.url || null);

  // Generate breadcrumb segments from pathname
  const generateBreadcrumbs = () => {
    const segments = pathname.split("/").filter(Boolean);

    // Remove language code (first segment)
    const pathSegments = segments.slice(1);

    const breadcrumbs = [
      {
        label: "HOME",
        href: `/${segments[0]}`,
      },
    ];

    // Build cumulative path for each segment
    let cumulativePath = `/${segments[0]}`;
    pathSegments.forEach((segment) => {
      cumulativePath += `/${segment}`;
      breadcrumbs.push({
        label: segment.replace(/-/g, " ").toUpperCase(),
        href: cumulativePath,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Filter breadcrumbs for mobile display - show first, ellipsis, and last
  const getMobileBreadcrumbs = () => {
    const crumbs = generateBreadcrumbs();
    if (crumbs.length <= 3) return crumbs;

    // Keep first, ellipsis, and last
    return [
      crumbs[0],
      { label: "...", href: "#" },
      crumbs[crumbs.length - 1],
    ];
  };

  const mobileBreadcrumbs = getMobileBreadcrumbs();

  return (
    <>
      {/* Hero Top Section - White Background */}
      <section className="relative w-full bg-white py-20 md:py-32">
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            {/* Breadcrumbs - Desktop */}
            <nav className="mb-8 hidden md:flex flex-wrap items-center justify-center gap-2 text-sm font-medium tracking-widest">
              {breadcrumbs.map((crumb, index) => (
                <div key={crumb.href + index} className="flex items-center gap-2">
                  {index < breadcrumbs.length - 1 ? (
                    <>
                      <Link
                        href={crumb.href}
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        {crumb.label}
                      </Link>
                      <ChevronRightIcon className="h-4 w-4 text-gray-400" />
                    </>
                  ) : (
                    <span className="uppercase text-primary font-semibold">
                      {crumb.label}
                    </span>
                  )}
                </div>
              ))}
            </nav>

            {/* Breadcrumbs - Mobile */}
            <nav className="mb-8 flex md:hidden flex-wrap items-center justify-center gap-2 text-sm font-medium tracking-widest">
              {mobileBreadcrumbs.map((crumb, index) => (
                <div key={crumb.href + index} className="flex items-center gap-2">
                  {index < mobileBreadcrumbs.length - 1 ? (
                    <>
                      {crumb.label === "..." ? (
                        <span className="text-gray-400">{crumb.label}</span>
                      ) : (
                        <Link
                          href={crumb.href}
                          className="text-gray-600 hover:text-gray-900 transition-colors"
                        >
                          {crumb.label}
                        </Link>
                      )}
                      <ChevronRightIcon className="h-4 w-4 text-gray-400" />
                    </>
                  ) : (
                    <span className="uppercase text-primary font-semibold">
                      {crumb.label}
                    </span>
                  )}
                </div>
              ))}
            </nav>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold leading-tight sm:leading-tight md:leading-tight mb-6 max-w-4xl text-gray-900">
              {data.name}
            </h1>

            {/* Description */}
            {data.description && (
              <p className="text-base sm:text-lg md:text-xl leading-relaxed sm:leading-relaxed md:leading-relaxed mb-6 max-w-3xl text-gray-600">
                {data.description}
              </p>
            )}

            {/* Accent Line */}
            <div className="h-1 w-16 rounded-full bg-accent" />
          </div>
        </div>
      </section>

      {/* Hero Bottom Section - Image with Caption */}
      {imageUrl && (
        <section className="relative w-full h-[360px] lg:h-[400px]">
          {/* Background Image */}
          <Image
            src={imageUrl}
            alt={data.picture?.alternativeText || data.name}
            fill
            className="object-cover"
            priority
          />

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Content Container */}
          <div className="absolute inset-0 flex items-end">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-8 md:pb-12">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                {/* Caption Text */}
                {data.caption && (
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-white max-w-xl md:max-w-2xl leading-tight">
                    {data.caption}
                  </h2>
                )}

                {/* Service Icon/Logo */}
                {iconUrl && (
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 relative">
                      <Image
                        src={iconUrl}
                        alt={`${data.name} logo`}
                        fill
                        className="object-contain brightness-0 invert"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Accent Bar */}
      <div className="h-2 md:h-4 bg-accent" />
    </>
  );
}

