"use client";

import { useRef, useState } from "react";
import { Slide, SlideshowRef } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import type { JargonSliderSection } from "@/types/generated";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

interface JargonSliderProps {
  data: JargonSliderSection;
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

export default function JargonSlider({ data }: JargonSliderProps) {
  const desktopSlideRef = useRef<SlideshowRef>(null);
  const mobileSlideRef = useRef<SlideshowRef>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!data || !data.items || data.items.length === 0) return null;

  const { subheading, items } = data;

  // Sort items by index
  const sortedItems = [...items].sort((a, b) => a.index - b.index);

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

  // Function to render jargon letters with styling
  const renderJargonLetters = (jargon: string) => {
    const letters = jargon.split("");
    return (
      <div className="flex items-center justify-center gap-4 md:gap-8 mb-8">
        {letters.map((letter, idx) => (
          <span
            key={idx}
            className="text-6xl md:text-8xl lg:text-9xl font-bold text-white"
            style={{
              WebkitTextStroke: idx % 2 === 1 ? "2px white" : "0",
              WebkitTextFillColor: idx % 2 === 1 ? "transparent" : "white",
            }}
          >
            {letter}
          </span>
        ))}
      </div>
    );
  };

  return (
    <section className="relative w-full min-h-[480px] md:min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Overlay */}
      <div className="absolute inset-0 bg-accent-dark/95" />

      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src={`${process.env.NEXT_PUBLIC_HOSTNAME}/background-banner.png`}
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
            transitionDuration={500}
            canSwipe={true}
            cssClass="jargon-slider-desktop"
            onChange={handleSlideChange}
          >
            {sortedItems.map((item) => (
              <div key={item.id} className="flex items-center justify-center px-4 py-16 md:py-32">
                <div className="max-w-5xl mx-auto text-center">
                  {/* Subheading */}
                  <p className="text-white text-sm md:text-base font-light tracking-[0.3em] mb-6 uppercase">
                    {subheading}
                  </p>

                  {/* Jargon Letters */}
                  {renderJargonLetters(item.jargon)}

                  {/* Heading */}
                  <h2 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                    {item.heading}
                  </h2>

                  {/* Description */}
                  <p className="text-white text-base md:text-lg leading-relaxed max-w-3xl mx-auto">
                    {item.description}
                  </p>
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
            transitionDuration={500}
            canSwipe={true}
            cssClass="jargon-slider-mobile"
            onChange={handleSlideChange}
          >
            {sortedItems.map((item) => (
              <div key={item.id} className="flex items-center justify-center px-4 py-16">
                <div className="max-w-7xl mx-auto text-center">
                  {/* Subheading */}
                  <p className="text-white text-sm font-light tracking-[0.3em] mb-6 uppercase">
                    {subheading}
                  </p>

                  {/* Jargon Letters - smaller on mobile */}
                  <div className="flex items-center justify-center gap-2 mb-6">
                    {item.jargon.split("").map((letter, idx) => (
                      <span
                        key={idx}
                        className="text-4xl font-bold text-white"
                        style={{
                          WebkitTextStroke: idx % 2 === 1 ? "1px white" : "0",
                          WebkitTextFillColor: idx % 2 === 1 ? "transparent" : "white",
                        }}
                      >
                        {letter}
                      </span>
                    ))}
                  </div>

                  {/* Heading */}
                  <h2 className="text-white text-2xl font-bold mb-4 px-4">{item.heading}</h2>

                  {/* Description */}
                  <p className="text-white text-sm leading-relaxed px-4">{item.description}</p>
                </div>
              </div>
            ))}
          </Slide>
        </div>
      </div>

      {/* Custom styles for the slider */}
      <style jsx global>{`
        .jargon-slider-desktop,
        .jargon-slider-mobile {
          padding-bottom: 2rem;
        }

        .jargon-slider-desktop .react-slideshow-container,
        .jargon-slider-mobile .react-slideshow-container {
          position: relative;
        }

        /* Indicators styling */
        .jargon-slider-desktop .react-slideshow-container + ul.indicators,
        .jargon-slider-mobile .react-slideshow-container + ul.indicators {
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

        .jargon-slider-desktop .react-slideshow-container + ul.indicators li,
        .jargon-slider-mobile .react-slideshow-container + ul.indicators li {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .jargon-slider-desktop .react-slideshow-container + ul.indicators li.active > div,
        .jargon-slider-mobile .react-slideshow-container + ul.indicators li.active > div {
          width: 2.5rem;
          background-color: white;
        }

        .jargon-slider-desktop .react-slideshow-container + ul.indicators li:not(.active) > div,
        .jargon-slider-mobile .react-slideshow-container + ul.indicators li:not(.active) > div {
          width: 2.5rem;
          background-color: rgba(255, 255, 255, 0.4);
        }
      `}</style>
    </section>
  );
}
