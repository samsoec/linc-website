"use client";

import { useState } from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import type {
  ServiceDetailSection,
  ServiceDetailContent,
  ServiceDetailList,
  ServiceDetailListItem,
  ServiceDetailValue,
  ContentBlock,
  InfoImage,
} from "@/types/generated";
import { getStrapiMedia } from "../utils/api-helpers";
import { MapPinIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { PlusIcon, MinusIcon } from "@heroicons/react/24/outline";
import ChipTabs from "./ChipTabs";

interface ServiceDetailProps {
  data: ServiceDetailSection;
}

// InfoImage component - renders image with optional caption, description, and stats overlay
function InfoImageBlock({ image, heading }: { image: InfoImage; heading?: string }) {
  const imageUrl = getStrapiMedia(image.media?.url || null);

  if (!imageUrl) return null;

  return (
    <>
      <div className="relative overflow-hidden rounded-2xl">
        <div className="aspect-[16/9]">
          <Image
            src={imageUrl}
            alt={image.media?.alternativeText || heading || "Service image"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 1280px"
          />
        </div>

        {/* Caption Overlay */}
        {(image.caption || image.description) && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              {/* Caption and Description */}
              <div className="flex items-start gap-3">
                <MapPinIcon className="h-6 w-6 flex-shrink-0 text-white" />
                <div>
                  {image.caption && <p className="font-semibold text-white">{image.caption}</p>}
                  {image.description && (
                    <p className="mt-1 text-sm text-gray-300">{image.description}</p>
                  )}
                </div>
              </div>

              {/* Desktop: Stats/Items on the side */}
              {image.items && image.items.length > 0 && (
                <div className="hidden md:flex items-center gap-6">
                  {image.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-6">
                      {index > 0 && <div className="h-16 w-px bg-white/30" />}
                      <div className="text-left">
                        {item.title && (
                          <p className="text-sm font-semibold text-gray-300">{item.title}</p>
                        )}
                        <p className="text-3xl font-semibold text-white">{item.value}</p>
                        {item.caption && <p className="text-sm text-gray-300">{item.caption}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mobile: Stats/Items below image */}
      {image.items && image.items.length > 0 && (
        <div className="md:hidden grid grid-cols-3 divide-x divide-gray-200 rounded-b-2xl bg-white py-6">
          {image.items.map((item, index) => (
            <div key={index} className="text-center px-4">
              {item.title && <p className="text-sm font-semibold text-gray-500">{item.title}</p>}
              <p className="text-2xl font-semibold text-accent">{item.value}</p>
              {item.caption && <p className="text-xs text-gray-500">{item.caption}</p>}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

// ListItems component - renders individual list items, with or without descriptions
function ListItemsBlock({
  items,
  numOfRows = 2,
}: {
  items: ServiceDetailListItem[];
  numOfRows?: number;
}) {
  if (!items || items.length === 0) return null;

  // Check if any item has a description
  const hasDescriptions = items.some((item) => item.description);

  if (hasDescriptions) {
    // Render list with descriptions
    return (
      <ul className={`grid gap-4 grid-cols-1 md:grid-cols-${numOfRows || 2} list-none`}>
        {items.map((item, index) => (
          <li key={index} className="flex gap-3">
            <ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-accent mt-0.5" />
            <div>
              <h4 className="font-semibold text-primary">{item.title}</h4>
              {item.description && (
                <div className="mt-2 text-gray-600 prose prose-sm max-w-none">
                  <ReactMarkdown>{item.description}</ReactMarkdown>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    );
  }

  // Render simple list without descriptions
  return (
    <ul className={`grid gap-2 grid-cols-1 md:grid-cols-${numOfRows || 2} list-none`}>
      {items.map((item, index) => (
        <li key={index} className="flex items-center gap-3">
          <ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-accent" />
          <span className="text-gray-700">{item.title}</span>
        </li>
      ))}
    </ul>
  );
}

// InfoList component - renders list with title and nested items
function InfoListBlock({ list }: { list: ServiceDetailList }) {
  if (!list || !list.items || list.items.length === 0) return null;

  return (
    <div>
      {list.title && (
        <h3 className="mb-8 text-2xl md:text-3xl font-semibold text-primary">{list.title}</h3>
      )}
      <ListItemsBlock items={list.items} numOfRows={list.numOfRow} />
    </div>
  );
}

// ServiceValue Accordion component
function ServiceValuesAccordion({ accordion }: { accordion: ServiceDetailValue }) {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set([0]));

  if (!accordion.items || accordion.items.length === 0) return null;

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
  const midpoint = Math.ceil(accordion.items.length / 2);
  const leftItems = accordion.items.slice(0, midpoint);
  const rightItems = accordion.items.slice(midpoint);

  const renderAccordionItem = (item: (typeof accordion.items)[0], originalIndex: number) => (
    <div key={item.id || originalIndex} className="border-b border-white/30">
      {/* Question Button */}
      <button
        onClick={() => toggleItem(originalIndex)}
        className="flex w-full items-center justify-between gap-4 py-5 text-left transition-colors hover:text-black/80"
      >
        <h3 className="text-base font-semibold md:text-lg">{item.title}</h3>
        <span className="flex-shrink-0">
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
            <div className="prose prose-sm max-w-none prose-ul:ml-0 prose-ul:list-disc prose-ul:pl-5 prose-li:marker:text-gray-700">
              <ReactMarkdown
                components={{
                  ul: ({ children }) => <ul className="list-disc space-y-1 pl-5">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal space-y-1 pl-5">{children}</ol>,
                  li: ({ children }) => <li className="text-gray-700">{children}</li>,
                  p: ({ children }) => <p className="mb-3 text-gray-700">{children}</p>,
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
    <div className="relative w-full overflow-hidden rounded-2xl">
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        {accordion.title && (
          <h3 className="mb-4 text-2xl md:text-3xl font-semibold text-primary">
            {accordion.title}
          </h3>
        )}

        {/* Accordion - Two independent columns */}
        {/* Desktop: 2 columns side by side, Mobile: 1 column */}
        <div className="flex flex-col md:flex-row md:gap-12">
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
    </div>
  );
}

// Side-by-side content blocks
function SideBySideBlocks({ blocks }: { blocks: ContentBlock[] }) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <div className="space-y-12 mt-8">
      {blocks.map((block, index) => {
        const imageUrl = getStrapiMedia(block.picture?.url || null);
        const isReversed = index % 2 === 0;

        return (
          <div
            key={index}
            className={`grid gap-8 md:grid-cols-2 md:gap-12 items-center ${
              isReversed ? "md:flex-row-reverse" : ""
            }`}
          >
            {/* Image */}
            <div
              className={`relative overflow-hidden rounded-xl ${isReversed ? "md:order-2" : ""}`}
            >
              {imageUrl && (
                <div className="aspect-[4/3]">
                  <Image
                    src={imageUrl}
                    alt={block.picture?.alternativeText || "Content image"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              )}
            </div>

            {/* Content */}
            <div className={`${isReversed ? "md:order-1" : ""}`}>
              <div className="prose prose-sm md:prose max-w-none text-gray-600">
                <ReactMarkdown
                  components={{
                    ul: ({ children }) => <ul className="list-disc space-y-1 pl-5">{children}</ul>,
                    ol: ({ children }) => (
                      <ol className="list-decimal space-y-1 pl-5">{children}</ol>
                    ),
                    li: ({ children }) => <li className="text-gray-700">{children}</li>,
                    p: ({ children }) => <p className="mb-3 text-gray-700">{children}</p>,
                    h1: ({ children }) => (
                      <h1 className="mb-4 text-3xl md:text-4xl font-semibold text-primary">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="mb-4 text-2xl md:text-3xl font-semibold text-primary">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="mb-3 text-xl md:text-2xl font-semibold text-primary">
                        {children}
                      </h3>
                    ),
                    h4: ({ children }) => (
                      <h4 className="mb-2 text-lg md:text-xl font-semibold text-primary">
                        {children}
                      </h4>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-semibold text-primary">{children}</strong>
                    ),
                  }}
                >
                  {block.content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Single content renderer
function ContentRenderer({
  content,
  heading,
}: {
  content: ServiceDetailContent;
  heading?: string;
}) {
  return (
    <div className="space-y-8">
      {/* Info Image */}
      {content.image && <InfoImageBlock image={content.image} heading={heading} />}

      {/* Description */}
      {content.description && (
        <div className="prose prose-lg max-w-none text-gray-600">
          <ReactMarkdown>{content.description}</ReactMarkdown>
        </div>
      )}

      {/* Info List */}
      {content.infoList && <InfoListBlock list={content.infoList} />}

      {/* Side-by-side blocks */}
      {content.sideBySideBlocks && content.sideBySideBlocks.length > 0 && (
        <SideBySideBlocks blocks={content.sideBySideBlocks} />
      )}

      {/* Service Values Accordion */}
      {content.accordion && content.accordion.items && content.accordion.items.length > 0 && (
        <ServiceValuesAccordion accordion={content.accordion} />
      )}
    </div>
  );
}

export default function ServiceDetail({ data }: ServiceDetailProps) {
  const { heading, subheading, content } = data;
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  if (!content || content.length === 0) {
    return null;
  }

  const hasMultipleContents = content.length > 1;

  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          {/* Header */}
          <div className="mb-8 md:mb-12">
            {subheading && (
              <p className="mb-3 text-sm uppercase tracking-[0.4em] text-accent">{subheading}</p>
            )}
            {heading && (
              <>
                <h2 className="text-3xl font-semibold leading-tight text-primary md:text-4xl lg:text-5xl">
                  {heading}
                </h2>
                <div className="mt-6 h-1 w-16 rounded-full bg-accent" />
              </>
            )}
          </div>

          {/* Tabs for multiple content */}
          {hasMultipleContents && (
            <div className="mb-8">
              <ChipTabs
                items={content}
                activeIndex={activeTabIndex}
                onSelect={setActiveTabIndex}
                getLabel={(item) => item.name}
              />
            </div>
          )}
        </div>

        {/* Content */}
        <ContentRenderer content={content[activeTabIndex]} heading={heading} />
      </div>
    </section>
  );
}
