"use client";

import Image from "next/image";
import Link from "next/link";
import { AboutCompanySection } from "@/types/generated";
import { getStrapiMedia } from "../utils/api-helpers";
import { ChevronRightIcon, TrophyIcon } from "@heroicons/react/24/outline";

interface AboutCompanyProps {
  data: AboutCompanySection;
}

export default function AboutCompany({ data }: AboutCompanyProps) {
  const {
    heading,
    subheading,
    description,
    moreButton,
    awards,
    media,
    mediaCaption,
    mediaSubtitle,
  } = data;

  if (!heading && !description) {
    return null;
  }

  const imageUrl = getStrapiMedia(media?.url);

  const paragraphs = description?.split("\n").filter((p) => p.trim()) || [];

  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Section: Heading + Description */}
        <div className="grid gap-8 md:grid-cols-2 md:gap-12 lg:gap-16">
          {/* Left: Heading */}
          <div>
            {subheading && (
              <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-accent">
                {subheading}
              </p>
            )}
            {heading && (
              <>
                <h2 className="font-sora text-3xl font-bold leading-tight text-primary md:text-4xl lg:text-5xl">
                  {heading}
                </h2>
                <div className="mt-6 h-1 w-16 rounded-full bg-accent" />
              </>
            )}
          </div>

          {/* Right: Description + Button */}
          <div className="flex flex-col justify-center">
            {paragraphs.length > 0 && (
              <div className="space-y-4">
                {paragraphs.map((paragraph, index) => (
                  <p key={index} className="text-gray-600">
                    {paragraph}
                  </p>
                ))}
              </div>
            )}
            {moreButton && (
              <div className="mt-8">
                <Link
                  href={moreButton.url || "#"}
                  target={moreButton.newTab ? "_blank" : "_self"}
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition-all hover:bg-accent-dark"
                >
                  {moreButton.text}
                  <ChevronRightIcon className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Awards Section */}
        {awards && awards.length > 0 && (
          <div className="mt-12 grid gap-4 md:mt-16 md:grid-cols-3 md:gap-6">
            {awards.map((award, index) => (
              <div
                key={award.id || index}
                className="flex gap-4 rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex-shrink-0">
                  <TrophyIcon className="h-8 w-8 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-primary">{award.title}</h3>
                  <p className="mt-2 text-sm text-gray-600">{award.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Media Section */}
        {imageUrl && (
          <div className="relative mt-12 overflow-hidden rounded-2xl md:mt-16">
            <div className="aspect-[16/9] md:aspect-[21/9]">
              <Image
                src={imageUrl}
                alt={media?.alternativeText || heading || "Company image"}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 1280px"
              />
            </div>
            {/* Caption Overlay */}
            {(mediaCaption || mediaSubtitle) && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 md:p-8">
                <div className="flex items-start gap-3">
                  <TrophyIcon className="h-6 w-6 flex-shrink-0 text-white" />
                  <div>
                    {mediaCaption && <p className="font-semibold text-white">{mediaCaption}</p>}
                    {mediaSubtitle && <p className="mt-1 text-sm text-gray-300">{mediaSubtitle}</p>}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
