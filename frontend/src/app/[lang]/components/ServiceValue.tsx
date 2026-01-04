"use client";

import { useState } from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import type { ServiceValueSection } from "@/types/generated";
import { PlusIcon, MinusIcon } from "@heroicons/react/24/outline";
import { getStrapiMedia } from "../utils/api-helpers";

interface ServiceValueProps {
  data: ServiceValueSection;
}

export default function ServiceValue({ data }: ServiceValueProps) {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set([0]));

  const { heading, subheading, description, items, background } = data;

  const backgroundUrl = getStrapiMedia(background?.url);

  if (!items || items.length === 0) {
    return null;
  }

  const toggleItem = (index: number) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  // Split items into left and right columns
  const midpoint = Math.ceil(items.length / 2);
  const leftItems = items.slice(0, midpoint);
  const rightItems = items.slice(midpoint);

  const renderAccordionItem = (item: (typeof items)[0], originalIndex: number) => (
    <div key={item.id || originalIndex} className="border-b border-white/30">
      {/* Question Button */}
      <button
        onClick={() => toggleItem(originalIndex)}
        className="flex w-full items-center justify-between gap-4 py-5 text-left transition-colors hover:text-white/80"
      >
        <h3 className="text-base font-semibold text-white md:text-lg">{item.title}</h3>
        <span className="flex-shrink-0 text-white">
          {openItems.has(originalIndex) ? (
            <MinusIcon className="h-5 w-5 md:h-6 md:w-6" />
          ) : (
            <PlusIcon className="h-5 w-5 md:h-6 md:w-6" />
          )}
        </span>
      </button>

      {/* Answer Content */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          openItems.has(originalIndex) ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="pb-5">
            <div className="prose prose-sm max-w-none text-white/90 prose-ul:ml-0 prose-ul:list-disc prose-ul:pl-5 prose-li:marker:text-white/90">
              <ReactMarkdown
                components={{
                  ul: ({ children }) => <ul className="list-disc space-y-1 pl-5">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal space-y-1 pl-5">{children}</ol>,
                  li: ({ children }) => <li className="text-sm text-white/90">{children}</li>,
                  p: ({ children }) => <p className="mb-3 text-sm text-white/90">{children}</p>,
                }}
              >
                {item.description}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section className="relative w-full overflow-hidden py-16 md:py-24">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-accent" />

      {/* Background Image */}
      {backgroundUrl && (
        <div className="absolute inset-0 opacity-20">
          <Image
            src={backgroundUrl}
            alt={background?.alternativeText || "Service Value background"}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center md:mb-12">
          {subheading && (
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-white">
              {subheading}
            </p>
          )}
          {heading && (
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
              {heading}
            </h2>
          )}

          {/* Accent Line */}
          <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-white" />

          {description && (
            <p className="mx-auto mt-6 max-w-3xl text-sm text-white/90 md:text-base">
              {description}
            </p>
          )}
        </div>

        {/* Accordion - Two independent columns */}
        {/* Desktop: 2 columns side by side, Mobile: 1 column */}
        <div className="flex flex-col gap-8 md:flex-row md:gap-12">
          {/* Left Column */}
          <div className="flex-1">
            {leftItems.map((item, index) => renderAccordionItem(item, index))}
          </div>

          {/* Right Column */}
          <div className="flex-1">
            {rightItems.map((item, index) => renderAccordionItem(item, index + midpoint))}
          </div>
        </div>
      </div>
    </section>
  );
}
