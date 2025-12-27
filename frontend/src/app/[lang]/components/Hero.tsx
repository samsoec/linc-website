"use client";
import Image from "next/image";
import { getStrapiMedia } from "../utils/api-helpers";
import { ChevronDownIcon, PlayIcon } from "@heroicons/react/24/outline";
import Button from "./Button";
import type { HeroSection } from "@/types/generated";

interface HeroProps {
  data: HeroSection;
}

export default function Hero({ data }: HeroProps) {
  const imgUrl = getStrapiMedia(data.picture.url);
  const mobileImgUrl = data.mobilePicture ? getStrapiMedia(data.mobilePicture.url) : imgUrl;

  return (
    <section className="relative min-h-screen">
      {/* Background Image - Desktop */}
      {imgUrl && (
        <div className="absolute inset-0 hidden md:block">
          <Image
            src={imgUrl}
            alt={data.picture.alternativeText || "Hero background"}
            fill
            className="object-cover"
            priority
          />
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}

      {/* Background Image - Mobile */}
      {mobileImgUrl && (
        <div className="absolute inset-0 md:hidden">
          <Image
            src={mobileImgUrl}
            alt={data.picture.alternativeText || "Hero background"}
            fill
            className="object-cover"
            priority
          />
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Main Hero Content */}
        <div className="flex-1 flex items-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
            <div className="max-w-2xl">
              {/* Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                {data.title}
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg text-gray-200 mb-8 max-w-xl leading-relaxed">
                {data.description}
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {/* Primary Buttons from Strapi */}
                {data.buttons?.map((button, index) => (
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
                {data.videoButton && (
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
          </div>
        </div>

        {/* Highlights/Stats Section */}
        {data.highlights && data.highlights.length > 0 && (
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12 lg:pb-16">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-12">
              {data.highlights.map((highlight, index) => (
                <div key={index} className="text-center lg:text-left">
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
                    {highlight.value}
                  </div>
                  <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                    {highlight.caption}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
