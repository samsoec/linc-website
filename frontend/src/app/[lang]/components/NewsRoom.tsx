"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Slide, SlideshowRef } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";
import type { NewsRoomSection, Article } from "@/types/generated";
import { getStrapiMedia, formatDate } from "../utils/api-helpers";

interface NewsRoomProps {
  data: NewsRoomSection;
}

interface ArticleCardProps {
  article: Article;
}

function ArticleCard({ article }: ArticleCardProps) {
  const imageUrl = getStrapiMedia(article.cover?.url || null);
  const category = article.category;

  return (
    <Link href={`/blog/${category?.slug}/${article.slug}`} className="group block h-full">
      <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-white border border-gray-200">
        {/* Cover Image */}
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={article.cover?.alternativeText || article.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 25vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-100">
              <span className="text-gray-400">No image</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-5">
          {/* Category */}
          {category && (
            <span className="mb-2 text-sm font-medium text-gray-500">{category.name}</span>
          )}

          {/* Title */}
          <h3 className="mb-3 line-clamp-2 text-lg font-semibold text-gray-900 transition-colors group-hover:text-accent">
            {article.title}
          </h3>

          {/* Date */}
          <p className="mt-auto text-sm text-gray-400">
            {article.publishedAt ? formatDate(article.publishedAt) : ""}
          </p>
        </div>
      </div>
    </Link>
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

export default function NewsRoom({ data }: NewsRoomProps) {
  const slideRef = useRef<SlideshowRef>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const { heading, subheading, description, articles } = data;

  if (!heading || !articles || articles.length === 0) {
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
  const isLastSlide = currentSlide >= articles.length - 1;

  const responsiveSettings = [
    {
      breakpoint: 1024, // ≥768px and <1024px: 3 cards
      settings: {
        slidesToShow: 5,
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
    <section className="w-full bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-10 md:mb-12">
          {/* Desktop: Side by side layout */}
          <div className="hidden md:flex md:items-start md:justify-between">
            <div className="max-w-2xl">
              {subheading && (
                <p className="mb-3 text-sm uppercase tracking-[0.4em] text-accent">{subheading}</p>
              )}
              <h2 className="mb-4 text-4xl font-semibold text-gray-900 lg:text-5xl">{heading}</h2>
              {description && <p className="text-gray-600">{description}</p>}
            </div>

            {/* See All News Link - Desktop */}
            <Link
              href="/blog"
              className="group flex items-center gap-2 whitespace-nowrap text-accent transition-colors hover:text-accent-dark"
            >
              <span className="font-medium">See All News</span>
              <ChevronRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Mobile: Stacked layout */}
          <div className="md:hidden">
            {subheading && (
              <p className="mb-3 text-sm uppercase tracking-[0.4em] text-accent">{subheading}</p>
            )}
            <h2 className="mb-4 text-3xl font-semibold text-gray-900">{heading}</h2>
            {description && <p className="mb-4 text-base text-gray-600">{description}</p>}

            {/* See All News Link - Mobile */}
            <Link
              href="/blog"
              className="group inline-flex items-center gap-2 font-medium text-accent transition-colors hover:text-accent-dark"
            >
              <span>See All News</span>
              <ChevronRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Accent Line */}
          <div className="mt-6 h-1 w-16 rounded-full bg-accent" />
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
            cssClass="news-room-slider"
            onChange={handleSlideChange}
            transitionDuration={300}
          >
            {articles.map((article, index) => (
              <div key={article.id || index} className="px-2">
                <ArticleCard article={article} />
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
        .news-room-slider {
          padding-bottom: 2rem;
        }

        .news-room-slider .react-slideshow-container {
          position: relative;
        }

        .news-room-slider .react-slideshow-container + ul.indicators {
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

        .news-room-slider .react-slideshow-container + ul.indicators li {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .news-room-slider .react-slideshow-container + ul.indicators li.active > div {
          width: 1.5rem;
          background-color: #9e2045;
        }

        .news-room-slider .react-slideshow-container + ul.indicators li:not(.active) > div {
          width: 0.5rem;
          background-color: #d1d5db;
        }

        @media (max-width: 767px) {
          .news-room-slider .react-slideshow-container + ul.indicators {
            left: 0;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
}
