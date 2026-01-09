"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AboutCompanySection } from "@/types/generated";
import { getStrapiMedia } from "../utils/api-helpers";
import { ChevronRightIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { PlayIcon } from "@heroicons/react/24/solid";
import VideoModal from "./VideoModal";
import { DynamicHeroIcon, KeyIcon } from "./DynamicIcon";

interface AboutCompanyProps {
  data: AboutCompanySection;
}

export default function AboutCompany({ data }: AboutCompanyProps) {
  const {
    heading,
    subheading,
    description,
    highlights,
    moreButton,
    image,
    videoEmbed,
    cards,
  } = data;

  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!heading && !description) {
    return null;
  }

  const imageUrl = getStrapiMedia(image?.media.url || null);

  console.log("AboutCompany highlights:", imageUrl);

  const openModal = () => {
    if (videoEmbed) {
      setIsModalOpen(true);
      document.body.style.overflow = "hidden";
    }
  };

  const paragraphs = description?.split("\n").filter((p) => p.trim()) || [];

  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Section: Heading + Description */}
        <div className="grid gap-8 md:grid-cols-2 md:gap-12 lg:gap-16">
          {/* Left: Heading */}
          <div>
            {subheading && (
              <p className="mb-3 text-sm uppercase tracking-[0.4em] text-accent">
                {subheading}
              </p>
            )}
            {heading && (
              <>
                <h2 className="text-3xl font-semibold leading-tight text-primary md:text-4xl lg:text-5xl">
                  {heading}
                </h2>
                <div className="mt-6 h-1 w-16 rounded-full bg-accent" />
              </>
            )}
          </div>

          {/* Right: Description + Highlights + Button */}
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

            {/* Highlights */}
            {highlights && highlights.length > 0 && (
              <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-6">
                {highlights.map((highlight, index) => (
                  <div key={index} className="flex flex-col">
                    <div className="text-xl md:text-3xl font-bold text-accent">
                      {highlight.value}
                    </div>
                    <div className="mt-2 text-sm text-gray-600">{highlight.caption}</div>
                  </div>
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

        {/* Cards Section */}
        {cards && cards.length > 0 && (
          <div className="mt-12 grid gap-4 md:mt-16 md:grid-cols-3 md:gap-6">
            {cards.map((card, index) => (
              <div
                key={card.id || index}
                className="flex gap-4 rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex-shrink-0">
                  <DynamicHeroIcon iconName={card.icon as KeyIcon || "TrophyIcon"} className="h-8 w-8 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-primary">{card.title}</h3>
                  <p className="mt-2 text-sm text-gray-600">{card.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Media Section */}
        {imageUrl && (
          <>
          <div
            className={`relative mt-12 overflow-hidden rounded-2xl md:mt-16 ${
              videoEmbed ? "cursor-pointer group" : ""
            }`}
            onClick={videoEmbed ? openModal : undefined}
            role={videoEmbed ? "button" : undefined}
            tabIndex={videoEmbed ? 0 : undefined}
            onKeyDown={
              videoEmbed
                ? (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      openModal();
                    }
                  }
                : undefined
            }
          >
            <div className="aspect-[16/9]">
              <Image
                src={imageUrl}
                alt={image?.media.alternativeText || heading || "Company image"}
                fill
                className={`object-cover ${
                  videoEmbed ? "transition-transform duration-500 group-hover:scale-105" : ""
                }`}
                sizes="(max-width: 768px) 100vw, 1280px"
              />
            </div>

            {/* Play Button Overlay */}
            {videoEmbed && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/30">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 shadow-lg transition-transform group-hover:scale-110 md:h-20 md:w-20">
                  <PlayIcon className="h-8 w-8 text-white md:h-10 md:w-10" />
                </div>
              </div>
            )}

            {/* Caption Overlay - Desktop: with stats on the side */}
            {(image?.caption || image?.description) && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                  {/* Caption and Description */}
                  <div className="flex items-start gap-3">
                    <MapPinIcon className="h-6 w-6 flex-shrink-0 text-white" />
                    <div>
                      {image?.caption && <p className="font-semibold text-white">{image.caption}</p>}
                      {image?.description && <p className="mt-1 text-sm text-gray-300">{image.description}</p>}
                    </div>
                  </div>

                  {/* Desktop: Stats/Items on the side */}
                  {image?.items && image.items.length > 0 && (
                    <div className="hidden md:flex items-center gap-6">
                      {image.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-6">
                          {index > 0 && <div className="h-16 w-px bg-white/30" />}
                          <div className="text-left">
                            {item.title && (
                              <p className="text-sm font-semibold text-gray-300">{item.title}</p>
                            )}
                            <p className="text-3xl font-semibold text-white">{item.value}</p>
                            {item.caption && (
                              <p className="text-sm text-gray-300">{item.caption}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          {/* Mobile: Stats/Items below image */}
          {image?.items && image.items.length > 0 && (
            <div className="md:hidden grid grid-cols-3 divide-x divide-gray-200 rounded-b-2xl bg-white py-6">
              {image.items.map((item, index) => (
                <div key={index} className="text-center px-4">
                  {item.title && (
                    <p className="text-sm font-semibold text-gray-500">{item.title}</p>
                  )}
                  <p className="text-2xl font-semibold text-accent">{item.value}</p>
                  {item.caption && (
                    <p className="text-xs text-gray-500">{item.caption}</p>
                  )}
                </div>
              ))}
            </div>
          )}
            </>
        )}
      </div>

      {/* Video Modal */}
      {isModalOpen && videoEmbed && (
        <VideoModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          embedUrl={videoEmbed.url}
        />
      )}
    </section>
  );
}
