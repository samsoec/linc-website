"use client";

import Image from "next/image";
import Link from "next/link";
import { getStrapiMedia } from "../utils/api-helpers";
import type { HeroSimpleSection } from "@/types/generated";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import SearchBar from "./SearchBar";

interface HeroSimpleProps {
  data: HeroSimpleSection;
}

export default function HeroSimple({ data }: HeroSimpleProps) {
  const imgUrl = getStrapiMedia(data.picture?.url);
  const mobileImgUrl = data.mobilePicture ? getStrapiMedia(data.mobilePicture.url) : imgUrl;

  return (
    <section className="relative w-full py-20 md:py-32">
      {/* Background Image - Desktop */}
      {!data.isPictureBlank && imgUrl && (
        <div className="absolute inset-0 hidden md:block">
          <Image
            src={imgUrl}
            alt={data.picture?.alternativeText || "Hero background"}
            fill
            className="object-cover"
            priority
          />
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/50" />
        </div>
      )}

      {/* Background Image - Mobile */}
      {!data.isPictureBlank && mobileImgUrl && (
        <div className="absolute inset-0 md:hidden">
          <Image
            src={mobileImgUrl}
            alt={data.picture?.alternativeText || "Hero background"}
            fill
            className="object-cover"
            priority
          />
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/50" />
        </div>
      )}

      {/* White background when isPictureBlank is true */}
      {data.isPictureBlank && <div className="absolute inset-0 bg-white" />}

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          {/* Breadcrumbs */}
          <nav className="mb-8 flex items-center gap-2 text-sm font-medium">
            <Link
              href="/"
              className={`transition-colors ${
                data.isPictureBlank
                  ? "text-gray-600 hover:text-gray-900"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              HOME
            </Link>
            <ChevronRightIcon
              className={`h-4 w-4 ${data.isPictureBlank ? "text-gray-400" : "text-gray-400"}`}
            />
            <span className={`uppercase ${data.isPictureBlank ? "text-gray-900" : "text-white"}`}>
              {data.title}
            </span>
          </nav>

          {/* Title */}
          <h1
            className={`text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6 max-w-4xl ${
              data.isPictureBlank ? "text-gray-900" : "text-white"
            }`}
          >
            {data.title}
          </h1>

          {/* Description */}
          {data.description && (
            <p
              className={`text-base sm:text-lg md:text-xl leading-relaxed mb-6 max-w-3xl ${
                data.isPictureBlank ? "text-gray-600" : "text-gray-200"
              }`}
            >
              {data.description}
            </p>
          )}

          {/* Accent Line */}
          <div className="h-1 w-16 rounded-full bg-accent" />

          {/* Search Component */}
          {data.searchBar && (
            <SearchBar
              navigateTo={data.searchBar.navigateTo}
              isLocationSearchEnabled={data.searchBar.isLocationSearchEnabled}
              isDivisionSearchEnabled={data.searchBar.isDivisionSearchEnabled}
            />
          )}
        </div>
      </div>
    </section>
  );
}
