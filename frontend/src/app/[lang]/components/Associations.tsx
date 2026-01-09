"use client";

import { useRef, useState } from "react";
import { Slide, SlideshowRef } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import Image from "next/image";
import type { AssociationsSection } from "@/types/generated";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

interface AssociationsProps {
  data: AssociationsSection;
}

// Custom dot indicator component
function CustomDot({ active }: { active: boolean }) {
  return (
    <div
      className={`mx-1 h-1 cursor-pointer rounded-full transition-all duration-300 ${
        active ? "w-10 bg-white" : "w-10 bg-white/40 hover:bg-white/60"
      }`}
    />
  );
}

// Custom arrow button component for desktop
function PrevArrow({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white bg-transparent text-white transition-all duration-200 hover:bg-white/10"
      aria-label="Previous slide"
    >
      <ChevronLeftIcon className="h-6 w-6" />
    </button>
  );
}

function NextArrow({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white bg-transparent text-white transition-all duration-200 hover:bg-white/10"
      aria-label="Next slide"
    >
      <ChevronRightIcon className="h-6 w-6" />
    </button>
  );
}

export default function Associations({ data }: AssociationsProps) {
  const desktopSlideRef = useRef<SlideshowRef>(null);
  const mobileSlideRef = useRef<SlideshowRef>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!data || !data.items || data.items.length === 0) return null;

  const { subheading, items } = data;

  const handleNext = () => {
    desktopSlideRef.current?.goNext();
    mobileSlideRef.current?.goNext();
  };

  const handlePrev = () => {
    desktopSlideRef.current?.goBack();
    mobileSlideRef.current?.goBack();
  };

  const handleSlideChange = (oldIndex: number, newIndex: number) => {
    setCurrentSlide(newIndex);
  };

  const indicators = (index?: number) => <CustomDot active={index === currentSlide} />;

  return (
    <section className="relative w-full min-h-[480px] md:min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Overlay */}
      <div className="absolute inset-0 bg-accent-dark/95" />

      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/background-banner.png"
          alt={"Association background"}
          fill
          className="object-cover"
        />
      </div>

      {/* Content */}
      <div className="relative z-20 w-full">
        {/* Desktop: Arrows on sides */}
        <div className="hidden md:block relative">
          <Slide
            ref={desktopSlideRef}
            slidesToScroll={1}
            slidesToShow={1}
            indicators={indicators}
            arrows={false}
            infinite={true}
            autoplay={false}
            transitionDuration={300}
            canSwipe={true}
            cssClass="associations-slider-desktop"
            onChange={handleSlideChange}
          >
            {items.map((item, index) => (
              <div key={index} className="flex items-center justify-center px-4 py-16 md:py-32">
                <div className="max-w-7xl mx-auto text-center">
                  <p className="text-white text-sm md:text-base font-light tracking-[0.3em] mb-8 uppercase">
                    {subheading}
                  </p>
                  <h2 className="text-white text-2xl md:text-4xl lg:text-5xl font-bold leading-relaxed">
                    {item.text}
                  </h2>
                </div>
              </div>
            ))}
          </Slide>

          {/* Desktop Arrow Controls on Sides */}
          <div className="absolute left-8 top-1/2 -translate-y-1/2 z-30">
            <PrevArrow onClick={handlePrev} />
          </div>
          <div className="absolute right-8 top-1/2 -translate-y-1/2 z-30">
            <NextArrow onClick={handleNext} />
          </div>
        </div>

        {/* Mobile: No arrows */}
        <div className="block md:hidden">
          <Slide
            ref={mobileSlideRef}
            slidesToScroll={1}
            slidesToShow={1}
            indicators={indicators}
            arrows={false}
            infinite={true}
            autoplay={false}
            transitionDuration={300}
            canSwipe={true}
            cssClass="associations-slider-mobile"
            onChange={handleSlideChange}
          >
            {items.map((item, index) => (
              <div key={index} className="flex items-center justify-center px-4 py-16">
                <div className="max-w-7xl mx-auto text-center">
                  <p className="text-white text-sm font-light tracking-[0.3em] mb-8 uppercase">
                    {subheading}
                  </p>
                  <h2 className="text-white text-xl font-bold leading-relaxed px-4">{item.text}</h2>
                </div>
              </div>
            ))}
          </Slide>
        </div>
      </div>

      {/* Custom styles for the slider */}
      <style jsx global>{`
        .associations-slider-desktop,
        .associations-slider-mobile {
          padding-bottom: 2rem;
        }

        .associations-slider-desktop .react-slideshow-container,
        .associations-slider-mobile .react-slideshow-container {
          position: relative;
        }

        /* Indicators styling */
        .associations-slider-desktop .react-slideshow-container + ul.indicators,
        .associations-slider-mobile .react-slideshow-container + ul.indicators {
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

        .associations-slider-desktop .react-slideshow-container + ul.indicators li,
        .associations-slider-mobile .react-slideshow-container + ul.indicators li {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .associations-slider-desktop .react-slideshow-container + ul.indicators li.active > div,
        .associations-slider-mobile .react-slideshow-container + ul.indicators li.active > div {
          width: 2.5rem;
          background-color: white;
        }

        .associations-slider-desktop
          .react-slideshow-container
          + ul.indicators
          li:not(.active)
          > div,
        .associations-slider-mobile
          .react-slideshow-container
          + ul.indicators
          li:not(.active)
          > div {
          width: 2.5rem;
          background-color: rgba(255, 255, 255, 0.4);
        }
      `}</style>
    </section>
  );
}
