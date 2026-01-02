import Image from "next/image";
import type { BannerSection } from "@/types/generated";
import Button from "./Button";
import { ChevronDownIcon, PlayIcon } from "@heroicons/react/24/outline";
import { getStrapiMedia } from "../utils/api-helpers";

interface BannerProps {
  data: BannerSection;
}

export default function Banner({ data }: BannerProps) {
  if (!data) return null;
  const { heading, buttons, videoButton, background } = data;

  const backgroundUrl = getStrapiMedia(background?.url);

  return (
    <section className="relative w-full min-h-[320px] md:min-h-[480px] flex items-center justify-center overflow-hidden">
      {/* Overlay for better text contrast */}
      <div className="absolute inset-0 bg-accent-dark/90" />

      {/* Background image */}
      {backgroundUrl && (
        <div className="absolute inset-0">
          <Image
            src={backgroundUrl}
            alt={background?.alternativeText || "Banner background"}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Content */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 flex flex-col py-16 md:py-32">
        <h1 className="text-white text-3xl md:text-6xl font-bold leading-tight mb-8">{heading}</h1>
        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-start gap-4">
          {/* Primary Buttons from Strapi */}
          {buttons?.map((button, index) => (
            <Button
              key={index}
              as="link"
              href={button.url}
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
          {videoButton && (
            <Button
              className="inline-flex items-center gap-2 w-full sm:w-auto"
              type={data.videoButton.type}
              color="secondary"
              size="lg"
            >
              <PlayIcon className="h-5 w-5" />
              {data.videoButton.text}
              <ChevronDownIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
