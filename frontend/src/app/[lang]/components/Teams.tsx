"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { Slide, SlideshowRef } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";
import type { TeamsSection, TeamMember } from "@/types/generated";
import { getStrapiMedia } from "../utils/api-helpers";

interface TeamsProps {
  data: TeamsSection;
}

interface TeamMemberCardProps {
  member: TeamMember;
}

function TeamMemberCard({ member }: TeamMemberCardProps) {
  const photoUrl = getStrapiMedia(member.photo?.url || null);

  return (
    <div className="group block h-full">
      {/* Desktop: Side by side layout */}
      <div className="hidden md:flex md:items-start md:gap-8 lg:gap-12">
        {/* Photo */}
        <div className="relative h-80 w-80 flex-shrink-0 overflow-hidden rounded-2xl">
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt={member.photo?.alternativeText || member.name}
              fill
              className="object-cover"
              sizes="320px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-100">
              <span className="text-gray-400">No photo</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-center py-4">
          <h3 className="mb-3 text-3xl font-semibold text-gray-900 lg:text-4xl">{member.name}</h3>
          <p className="mb-6 text-base font-medium text-gray-500">{member.title}</p>
          <div className="prose prose-base max-w-none text-gray-600">
            <ReactMarkdown
              components={{
                ul: ({ children }) => <ul className="list-disc space-y-2 pl-5 mb-4">{children}</ul>,
                ol: ({ children }) => (
                  <ol className="list-decimal space-y-2 pl-5 mb-4">{children}</ol>
                ),
                li: ({ children }) => <li className="text-gray-600">{children}</li>,
                p: ({ children }) => <p className="mb-4">{children}</p>,
              }}
            >
              {member.description}
            </ReactMarkdown>
          </div>
        </div>
      </div>

      {/* Mobile: Vertical layout */}
      <div className="flex flex-col items-center md:hidden">
        {/* Photo */}
        <div className="relative mb-6 h-80 w-80 overflow-hidden rounded-2xl">
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt={member.photo?.alternativeText || member.name}
              fill
              className="object-cover"
              sizes="320px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-100">
              <span className="text-gray-400">No photo</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col">
          <h3 className="mb-3 text-2xl font-semibold text-gray-900">{member.name}</h3>
          <p className="mb-6 text-sm font-medium text-gray-500">{member.title}</p>
          <div className="prose prose-sm max-w-none text-gray-600">
            <ReactMarkdown
              components={{
                ul: ({ children }) => <ul className="list-disc space-y-2 pl-5 mb-4">{children}</ul>,
                ol: ({ children }) => (
                  <ol className="list-decimal space-y-2 pl-5 mb-4">{children}</ol>
                ),
                li: ({ children }) => <li className="text-gray-600">{children}</li>,
                p: ({ children }) => <p className="mb-4">{children}</p>,
              }}
            >
              {member.description}
            </ReactMarkdown>
          </div>
        </div>
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

export default function Teams({ data }: TeamsProps) {
  const slideRef = useRef<SlideshowRef>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const { heading, subheading, members } = data;

  if (!heading || !members || members.length === 0) {
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
  const isLastSlide = currentSlide >= members.length - 1;

  const indicators = (index?: number) => <CustomDot active={index === currentSlide} />;

  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-10 text-center md:mb-12">
          {subheading && (
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.4em] text-accent">
              {subheading}
            </p>
          )}
          {heading && (
            <h2 className="mb-4 text-3xl font-semibold text-gray-900 md:text-4xl lg:text-5xl">
              {heading}
            </h2>
          )}

          {/* Accent Line */}
          <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-accent" />
        </div>

        {/* Slider Section */}
        <div className="relative">
          <Slide
            ref={slideRef}
            slidesToShow={1}
            slidesToScroll={1}
            autoplay={false}
            indicators={indicators}
            arrows={false}
            infinite={false}
            cssClass="teams-slider"
            onChange={handleSlideChange}
            transitionDuration={300}
          >
            {members.map((member, index) => (
              <div key={member.id || index} className="px-4">
                <TeamMemberCard member={member} />
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
        .teams-slider {
          padding-bottom: 2rem;
        }

        .teams-slider .react-slideshow-container {
          position: relative;
        }

        .teams-slider .react-slideshow-container + ul.indicators {
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

        .teams-slider .react-slideshow-container + ul.indicators li {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .teams-slider .react-slideshow-container + ul.indicators li.active > div {
          width: 1.5rem;
          background-color: #9e2045;
        }

        .teams-slider .react-slideshow-container + ul.indicators li:not(.active) > div {
          width: 0.5rem;
          background-color: #d1d5db;
        }

        @media (max-width: 767px) {
          .teams-slider .react-slideshow-container + ul.indicators {
            left: 0;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
}
