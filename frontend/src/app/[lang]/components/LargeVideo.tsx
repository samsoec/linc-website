"use client";

import { useState } from "react";
import Image from "next/image";
import { LargeVideoSection } from "@/types/generated";
import { getStrapiMedia } from "../utils/api-helpers";
import { PlayIcon, XMarkIcon } from "@heroicons/react/24/solid";

interface LargeVideoProps {
  data: LargeVideoSection;
}

export default function LargeVideo({ data }: LargeVideoProps) {
  const { heading, subheading, description, embedUrl, video, poster } = data;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const posterUrl = getStrapiMedia(poster?.url || null);
  const videoUrl = getStrapiMedia(video?.url || null);

  if (!heading && !posterUrl) {
    return null;
  }

  const hasVideo = embedUrl || videoUrl;

  const openModal = () => {
    if (hasVideo) {
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

  return (
    <>
      <section className="relative w-full overflow-hidden">
        {/* Background Image (same as poster, blurred) */}
        {posterUrl && (
          <div className="absolute inset-0">
            <Image
              src={posterUrl}
              alt=""
              fill
              className="object-cover blur-sm scale-105"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-primary/80" />
          </div>
        )}

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
          {/* Header */}
          <div className="mb-12 text-center md:mb-16">
            {subheading && (
              <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-white/80">
                {subheading}
              </p>
            )}
            {heading && (
              <h2 className="font-sora text-3xl font-bold text-white md:text-4xl lg:text-5xl">
                {heading}
              </h2>
            )}
            {description && (
              <p className="mx-auto mt-4 max-w-2xl text-lg italic text-white/80">{description}</p>
            )}
            <div className="mx-auto mt-8 h-1 w-16 rounded-full bg-white" />
          </div>

          {/* Video Poster with Play Button */}
          {posterUrl && (
            <div className="relative mx-auto max-w-5xl">
              <div
                className={`
                  relative overflow-hidden rounded-2xl shadow-2xl
                  ${hasVideo ? "cursor-pointer group" : ""}
                `}
                onClick={openModal}
                role={hasVideo ? "button" : undefined}
                tabIndex={hasVideo ? 0 : undefined}
                onKeyDown={(e) => {
                  if (hasVideo && (e.key === "Enter" || e.key === " ")) {
                    openModal();
                  }
                }}
              >
                <div className="aspect-video">
                  <Image
                    src={posterUrl}
                    alt={poster?.alternativeText || heading || "Video poster"}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 1024px"
                  />
                </div>

                {/* Play Button Overlay */}
                {hasVideo && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/30">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 shadow-lg transition-transform group-hover:scale-110 md:h-20 md:w-20">
                      <PlayIcon className="h-8 w-8 text-white md:h-10 md:w-10" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Video Modal */}
      {isModalOpen && (
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
              {embedUrl ? (
                // YouTube/Vimeo embed
                <iframe
                  src={getEmbedUrl(embedUrl)}
                  title={heading || "Video"}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : videoUrl ? (
                // Self-hosted video
                <video src={videoUrl} controls autoPlay className="h-full w-full">
                  Your browser does not support the video tag.
                </video>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </>
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
