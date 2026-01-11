"use client";

import Image from "next/image";
import type { BannerSection } from "@/types/generated";
import Button from "./Button";
import { PlayIcon } from "@heroicons/react/24/outline";
import VideoModal from "./VideoModal";
import { useState } from "react";

interface BannerProps {
  data: BannerSection;
}

export default function Banner({ data }: BannerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!data) return null;
  const { heading, buttons, videoButton } = data;

  return (
    <section className="relative w-full min-h-[320px] md:min-h-[480px] flex items-center justify-center overflow-hidden">
      {/* Overlay for better text contrast */}
      <div className="absolute inset-0 bg-accent-dark/90" />

      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/background-banner.png"
          alt={"Banner background"}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Content */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 flex flex-col py-16 md:py-32">
        <h1 className="text-white text-3xl md:text-6xl font-semibold leading-tight mb-8">{heading}</h1>
        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-start gap-4">
          {/* Primary Buttons from Strapi */}
          {buttons?.map((button, index) => (
            <Button
              key={index}
              as="link"
              href={button.url || "#"}
              target={button.newTab ? "_blank" : "_self"}
              type={button.type}
              color="secondary"
              size="lg"
              className="w-full sm:w-auto"
            >
              {button.text}
            </Button>
          ))}

          {/* Video Button */}
          {videoButton && videoButton.button && (
            <Button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 w-full sm:w-auto"
              type={videoButton.button.type}
              color="secondary"
              size="lg"
            >
              <PlayIcon className="h-5 w-5" />
              {videoButton.button.text}
            </Button>
          )}
        </div>
      </div>

      {/* Video Modal */}
      <VideoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        embedUrl={data.videoButton?.embedUrl}
      />
    </section>
  );
}
