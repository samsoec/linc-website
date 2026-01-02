"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Slide, SlideshowRef } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";
import type { AwardCertificationSection, Award } from "@/types/generated";
import { getStrapiMedia } from "../utils/api-helpers";

interface AwardCertificationProps {
  data: AwardCertificationSection;
}

interface AwardCardProps {
  award: Award;
}

function AwardCard({ award }: AwardCardProps) {
  const logoUrl = getStrapiMedia(award.logo?.url);

  return (
    <div className="group block h-full">
      <div className="flex h-full flex-col items-center overflow-hidden rounded-2xl bg-white p-8 shadow-sm transition-shadow duration-300 hover:shadow-md">
        {/* Logo */}
        <div className="relative mb-6 h-32 w-32 flex-shrink-0">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={award.logo?.alternativeText || award.title}
              fill
              className="object-contain"
              sizes="128px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-100">
              <span className="text-gray-400 text-sm">No logo</span>
            </div>
          )}
        </div>

        {/* Code/Title */}
        {award.code && (
          <h3 className="mb-2 text-center text-xl font-bold text-gray-900">{award.code}</h3>
        )}

        {/* Subtitle */}
        {award.title && (
          <p className="mb-4 text-center text-sm font-medium text-gray-500">{award.title}</p>
        )}

        {/* Description */}
        {award.description && (
          <p className="text-center text-sm leading-relaxed text-gray-600">{award.description}</p>
        )}
      </div>
    </div>
  );
}

// Custom dot indicator component
function CustomDot({ active }: { active: boolean }) {
  return (
    <div
      className={`mx-1 h-2 cursor-pointer rounded-full transition-all duration-300 ${
        active ? "w-6 bg-accent" : "w-2 bg-gray-300 hover:bg-gray-400"
      }`}
    />
  );
}

// Custom arrow button component
function PrevArrow({ onClick, disabled }: { onClick?: () => void; disabled?: boolean }) {
  if (disabled) return null;

  return (
    <button
      onClick={onClick}
      className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 hover:shadow-md"
      aria-label="Previous slide"
    >
      <ChevronLeftIcon className="h-5 w-5" />
    </button>
  );
}

function NextArrow({ onClick, disabled }: { onClick?: () => void; disabled?: boolean }) {
  if (disabled) return null;

  return (
    <button
      onClick={onClick}
      className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 hover:shadow-md"
      aria-label="Next slide"
    >
      <ChevronRightIcon className="h-5 w-5" />
    </button>
  );
}

export default function AwardCertification({ data }: AwardCertificationProps) {
  const slideRef = useRef<SlideshowRef>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const { heading, subheading, description, items } = data;

  if (!heading || !items || items.length === 0) {
    return null;
  }

  const handleNext = () => {
    slideRef.current?.goNext();
  };

  const handlePrev = () => {
    slideRef.current?.goBack();
  };

  const handleSlideChange = (oldIndex: number, newIndex: number) => {
    setCurrentSlide(newIndex);
  };

  const isFirstSlide = currentSlide === 0;
  const isLastSlide = currentSlide >= items.length - 1;

  // Responsive settings based on container width
  const responsiveSettings = [
    {
      breakpoint: 1024, // ≥768px and <1024px: 3 cards
      settings: {
        slidesToShow: 4,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 768, // ≥640px and <768px: 2 cards
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 640, // <640px: 1 card
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ];

  const indicators = (index?: number) => <CustomDot active={index === currentSlide} />;

  return (
    <section className="w-full bg-gray-50 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-10 text-center md:mb-12">
          {subheading && (
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-accent">
              {subheading}
            </p>
          )}
          {heading && (
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl">
              {heading}
            </h2>
          )}
          {description && (
            <p className="mx-auto max-w-3xl text-base text-gray-600 md:text-lg">{description}</p>
          )}

          {/* Accent Line */}
          <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-accent" />
        </div>

        {/* Slider Section */}
        <div className="relative">
          <Slide
            ref={slideRef}
            autoplay={false}
            responsive={responsiveSettings}
            indicators={indicators}
            arrows={false}
            infinite={false}
            cssClass="award-certification-slider"
            onChange={handleSlideChange}
          >
            {items.map((award, index) => (
              <div key={award.id || index} className="px-2">
                <AwardCard award={award} />
              </div>
            ))}
          </Slide>

          {/* Navigation Arrows - Positioned outside on right */}
          <div className="absolute -bottom-16 right-0 flex items-center gap-3 md:-bottom-14">
            <PrevArrow onClick={handlePrev} disabled={isFirstSlide} />
            <NextArrow onClick={handleNext} disabled={isLastSlide} />
          </div>
        </div>

        {/* Spacer for navigation arrow */}
        <div className="h-20 md:h-16" />
      </div>

      {/* Custom styles for the slider */}
      <style jsx global>{`
        .award-certification-slider {
          padding-bottom: 2rem;
        }

        .award-certification-slider .react-slideshow-container {
          position: relative;
        }

        .award-certification-slider .react-slideshow-container + ul.indicators {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0;
          padding: 0;
          margin: 0;
          list-style: none;
        }

        .award-certification-slider .react-slideshow-container + ul.indicators li {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .award-certification-slider .react-slideshow-container + ul.indicators li.active > div {
          width: 1.5rem;
          background-color: #9e2045;
        }

        .award-certification-slider
          .react-slideshow-container
          + ul.indicators
          li:not(.active)
          > div {
          width: 0.5rem;
          background-color: #d1d5db;
        }

        @media (max-width: 767px) {
          .award-certification-slider .react-slideshow-container + ul.indicators {
            left: 0;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
}
