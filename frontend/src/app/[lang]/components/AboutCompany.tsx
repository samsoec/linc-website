"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AboutCompanySection } from "@/types/generated";
import { getStrapiMedia } from "../utils/api-helpers";
import { ChevronRightIcon, TrophyIcon } from "@heroicons/react/24/outline";
import { PlayIcon, XMarkIcon } from "@heroicons/react/24/solid";

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
    awards,
    media,
    mediaCaption,
    mediaSubtitle,
  } = data;

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Access videoEmbedUrl property (may not be in generated types yet)
  const videoEmbedUrl = (data as AboutCompanySection & { videoEmbedUrl?: string }).videoEmbedUrl;

  if (!heading && !description) {
    return null;
  }

  const imageUrl = getStrapiMedia(media?.url || null);

  const openModal = () => {
    if (videoEmbedUrl) {
      setIsModalOpen(true);
      document.body.style.overflow = "hidden";
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "unset";
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      closeModal();
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
          <div
            className={`relative mt-12 overflow-hidden rounded-2xl md:mt-16 ${
              videoEmbedUrl ? "cursor-pointer group" : ""
            }`}
            onClick={videoEmbedUrl ? openModal : undefined}
            role={videoEmbedUrl ? "button" : undefined}
            tabIndex={videoEmbedUrl ? 0 : undefined}
            onKeyDown={
              videoEmbedUrl
                ? (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      openModal();
                    }
                  }
                : undefined
            }
          >
            <div className="aspect-[16/9] md:aspect-[21/9]">
              <Image
                src={imageUrl}
                alt={media?.alternativeText || heading || "Company image"}
                fill
                className={`object-cover ${
                  videoEmbedUrl ? "transition-transform duration-500 group-hover:scale-105" : ""
                }`}
                sizes="(max-width: 768px) 100vw, 1280px"
              />
            </div>

            {/* Play Button Overlay */}
            {videoEmbedUrl && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/30">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 shadow-lg transition-transform group-hover:scale-110 md:h-20 md:w-20">
                  <PlayIcon className="h-8 w-8 text-white md:h-10 md:w-10" />
                </div>
              </div>
            )}

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

      {/* Video Modal */}
      {isModalOpen && videoEmbedUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={handleBackdropClick}
          onKeyDown={handleKeyDown}
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
        >
          {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20 md:right-8 md:top-8"
            aria-label="Close video"
          >
            <XMarkIcon className="h-8 w-8" />
          </button>

          {/* Video Container */}
          <div className="relative w-full max-w-5xl">
            <div className="aspect-video overflow-hidden rounded-lg bg-black">
              <iframe
                src={getEmbedUrl(videoEmbedUrl)}
                title={heading || "Video"}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

// Helper function to convert YouTube/Vimeo URLs to embed URLs
function getEmbedUrl(url: string): string {
  if (!url) return "";

  // YouTube
  const youtubeMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=1`;
  }

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
  }

  // Already an embed URL or other format
  return url;
}
