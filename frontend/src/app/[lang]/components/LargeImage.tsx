import Image from "next/image";
import type { LargeImageSection } from "@/types/generated";
import { getStrapiMedia } from "../utils/api-helpers";

interface LargeImageProps {
  data: LargeImageSection;
}

export default function LargeImage({ data }: LargeImageProps) {
  const { heading, subheading, desktopImage, mobileImage } = data;

  const desktopImageUrl = getStrapiMedia(desktopImage?.url);
  const mobileImageUrl = getStrapiMedia(mobileImage?.url);

  // Use desktop image as fallback if mobile image not provided
  const fallbackImageUrl = desktopImageUrl as string;

  if (!desktopImageUrl) {
    return null;
  }

  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center md:mb-16">
          {subheading && (
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-accent">
              {subheading}
            </p>
          )}
          {heading && (
            <>
              <h2 className="font-sora text-3xl font-bold text-primary md:text-4xl lg:text-5xl">
                {heading}
              </h2>
              <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-accent" />
            </>
          )}
        </div>

        {/* Image Container */}
        <div className="relative mx-auto max-w-6xl">
          {/* Desktop Image */}
          <div className="hidden md:block">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl">
              <Image
                src={desktopImageUrl}
                alt={desktopImage?.alternativeText || heading || "Large image"}
                fill
                className="object-contain"
                sizes="(min-width: 768px) 1152px, 100vw"
                priority
              />
            </div>
          </div>

          {/* Mobile Image */}
          <div className="block md:hidden">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl">
              <Image
                src={mobileImageUrl || fallbackImageUrl}
                alt={
                  mobileImage?.alternativeText ||
                  desktopImage?.alternativeText ||
                  heading ||
                  "Large image"
                }
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
