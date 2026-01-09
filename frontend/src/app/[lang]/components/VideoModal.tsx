"use client";

import { useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  embedUrl?: string;
  videoUrl?: string;
  title?: string;
}

export default function VideoModal({
  isOpen,
  onClose,
  embedUrl,
  videoUrl,
  title = "Video",
}: VideoModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
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
              title={title}
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
