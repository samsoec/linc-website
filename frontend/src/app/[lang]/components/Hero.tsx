"use client";

import { useState } from "react";
import Image from "next/image";
import { getStrapiMedia } from "../utils/api-helpers";
import { PlayIcon } from "@heroicons/react/24/outline";
import Button from "./Button";
import VideoModal from "./VideoModal";
import type { HeroSection } from "@/types/generated";

interface HeroProps {
  data: HeroSection;
}

export default function Hero({ data }: HeroProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const imgUrl = getStrapiMedia(data.picture.url);
  const mobileImgUrl = data.mobilePicture ? getStrapiMedia(data.mobilePicture.url) : imgUrl;
  const awardLogoUrl = data.award?.logo ? getStrapiMedia(data.award.logo.url) : null;

  return (
    <>
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
                <h1 className="text-4xl leading-tight sm:text-5xl sm:leading-tight lg:text-6xl lg:leading-tight font-semibold text-white mb-6">
                  {data.title}
                </h1>

                {/* Description */}
                <p className="text-base sm:text-lg text-gray-200 mb-8 max-w-xl leading-relaxed sm:leading-relaxed">
                  {data.description}
                </p>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  {/* Primary Buttons from Strapi */}
                  {data.buttons?.map((button, index) => (
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
                  {data.videoButton && data.videoButton.button && (
                    <Button
                      onClick={() => setIsModalOpen(true)}
                      className="inline-flex items-center gap-2 w-full sm:w-auto"
                      type={data.videoButton.button.type}
                      color="secondary"
                      size="lg"
                    >
                      <PlayIcon className="h-5 w-5" />
                      {data.videoButton.button.text}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Award Section */}
          {data.award && (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12 lg:pb-16">
              {/* Hairline */}
              <div className="h-px bg-white/30 mb-8" />

              <div className="flex flex-col items-center">
                <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
                  {/* Award Logo */}
                  {awardLogoUrl && (
                    <div className="flex-shrink-0">
                      <div className="relative w-32 h-16 md:w-40 md:h-20">
                        <Image
                          src={awardLogoUrl}
                          alt={data.award.logo.alternativeText || data.award.name}
                          fill
                          className="object-contain invert brightness-0"
                        />
                      </div>
                    </div>
                  )}

                  {/* Award Content */}
                  <div className="flex-1 text-center md:text-left">
                    {data.award.caption && (
                      <p className="text-sm sm:text-base text-gray-300 mb-2 font-semibold">
                        {data.award.caption}
                      </p>
                    )}
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                      {data.award.name}
                    </h3>
                    {data.award.sponsor && (
                      <p className="text-sm sm:text-base text-gray-300">{data.award.sponsor}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Video Modal */}
        <VideoModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          embedUrl={data.videoButton?.embedUrl}
          title={data.title}
        />
      </section>
      <div className="h-2 md:h-4 bg-accent" />
    </>
  );
}
