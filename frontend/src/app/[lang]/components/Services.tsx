"use client";

import { useState } from "react";
import Image from "next/image";
import LocaleLink from "./LocaleLink";
import ReactMarkdown from "react-markdown";
import { ServicesSection, Service } from "@/types/generated";
import { getStrapiMedia } from "../utils/api-helpers";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { useDictionary } from "@/contexts/DictionaryContext";

interface ServicesProps {
  data: ServicesSection;
}

interface ServiceCardProps {
  service: Service;
  isActive: boolean;
  onActivate: () => void;
}

function ServiceCard({ service, isActive, onActivate }: ServiceCardProps) {
  const imageUrl = getStrapiMedia(service.picture?.url || null);
  const iconUrl = getStrapiMedia(service.icon?.url || null);

  return (
    <div
      className={`
        group relative cursor-pointer overflow-hidden rounded-2xl
        transition-all duration-500 ease-in-out
        ${isActive ? "flex-[3] md:flex-[2.5]" : "flex-1 hover:flex-[1.2]"}
        h-[400px] md:h-[550px] lg:h-[600px]
      `}
      onMouseEnter={onActivate}
      onClick={onActivate}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onActivate();
        }
      }}
    >
      {/* Background Image */}
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={service.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      )}

      {/* Dark Overlay */}
      <div
        className={`
          absolute inset-0 transition-opacity duration-500
          ${isActive ? "bg-black/60" : "bg-black/40 group-hover:bg-black/50"}
        `}
      />

      {/* Content Container */}
      <div className="absolute inset-0 flex flex-col justify-center p-6 md:p-8">
        {/* Icon/Logo Placeholder */}
        {iconUrl ? (
          <div
            className={`
              mb-4 h-24 w-24 overflow-hidden rounded-lg
              transition-all duration-500
              ${isActive ? "self-start" : "self-center"}
            `}
          >
            <Image
              src={iconUrl}
              alt={`${service.name} icon`}
              width={96}
              height={48}
              className="h-full w-full object-contain p-2 invert brightness-0"
            />
          </div>
        ) : (
          <div
            className={`
              mb-4 h-12 w-24 rounded-lg bg-white
              transition-all duration-500
            `}
          />
        )}

        {/* Expandable Content */}
        <div
          className={`
            overflow-hidden transition-all duration-500 ease-in-out
            ${isActive ? "mt-4 max-h-[400px] opacity-100" : "max-h-0 opacity-0"}
          `}
        >
          {/* Title - Always Visible */}
          <h3
            className={`
              mb-6 font-semibold text-white transition-all duration-500
              ${isActive ? "text-2xl md:text-3xl lg:text-4xl" : "text-lg md:text-xl"}
            `}
          >
            {service.name}
          </h3>

          {/* Summary */}
          {service.cardSummary && (
            <div className="mb-6 space-y-2">
              <div className="prose prose-sm max-w-none text-white/90 prose-ul:ml-0 prose-ul:list-disc prose-ul:pl-5 prose-li:marker:text-white/90">
                <ReactMarkdown
                  components={{
                    ul: ({ children }) => <ul className="list-disc space-y-1 pl-5">{children}</ul>,
                    ol: ({ children }) => (
                      <ol className="list-decimal space-y-1 pl-5">{children}</ol>
                    ),
                    li: ({ children }) => (
                      <li className="text-sm md:text-base text-white/90">{children}</li>
                    ),
                    p: ({ children }) => (
                      <p className="mb-3 text-sm md:text-base text-white/90">{children}</p>
                    ),
                  }}
                >
                  {service.cardSummary}
                </ReactMarkdown>
              </div>
            </div>
          )}

          {/* Learn More Button */}
          <LocaleLink
            href={`/service/${service.slug || service.documentId}`}
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-primary transition-all hover:bg-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            Learn More
            <ChevronRightIcon className="h-4 w-4" />
          </LocaleLink>
        </div>
      </div>
    </div>
  );
}

interface MobileServiceCardProps {
  service: Service;
  isActive: boolean;
  onActivate: () => void;
}

function MobileServiceCard({ service, isActive, onActivate }: MobileServiceCardProps) {
  const imageUrl = getStrapiMedia(service.picture?.url || null);
  const iconUrl = getStrapiMedia(service.icon?.url || null);
  const { t } = useDictionary();

  return (
    <div
      className={`
        relative cursor-pointer overflow-hidden rounded-2xl
        transition-all duration-500 ease-in-out
        ${isActive ? "h-[540px]" : "h-[180px]"}
      `}
      onClick={onActivate}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onActivate();
        }
      }}
    >
      {/* Background Image */}
      {imageUrl && (
        <Image src={imageUrl} alt={service.name} fill className="object-cover" sizes="100vw" />
      )}

      {/* Dark Overlay */}
      <div
        className={`
          absolute inset-0 transition-opacity duration-500
          ${isActive ? "bg-black/60" : "bg-black/40"}
        `}
      />

      {/* Content Container */}
      <div className="absolute inset-0 flex flex-col justify-end p-6">
        {/* Icon/Logo Placeholder */}
        {iconUrl ? (
          <div className="mb-4 h-24 w-24 overflow-hidden rounded-lg">
            <Image
              src={iconUrl}
              alt={`${service.name} icon`}
              width={96}
              height={48}
              className="h-full w-full object-contain p-2 invert brightness-0"
            />
          </div>
        ) : (
          <div className="mb-4 h-12 w-24 rounded-lg bg-white" />
        )}

        {/* Expandable Content */}
        <div
          className={`
            overflow-hidden transition-all duration-500 ease-in-out
            ${isActive ? "mt-4 opacity-100" : "max-h-0 opacity-0"}
          `}
        >
          {/* Title */}
          <h3
            className={`
              mb-4 font-semibold text-white transition-all duration-300
              ${isActive ? "text-2xl" : "text-xl"}
            `}
          >
            {service.name}
          </h3>

          {/* Features List */}
          {service.cardSummary && (
            <div className="mb-6 space-y-2">
              <div className="prose prose-sm max-w-none text-white/90 prose-ul:ml-0 prose-ul:list-disc prose-ul:pl-5 prose-li:marker:text-white/90">
                <ReactMarkdown
                  components={{
                    ul: ({ children }) => <ul className="list-disc space-y-1 pl-5">{children}</ul>,
                    ol: ({ children }) => (
                      <ol className="list-decimal space-y-1 pl-5">{children}</ol>
                    ),
                    li: ({ children }) => (
                      <li className="text-sm md:text-base text-white/90">{children}</li>
                    ),
                    p: ({ children }) => (
                      <p className="mb-3 text-sm md:text-base text-white/90">{children}</p>
                    ),
                  }}
                >
                  {service.cardSummary}
                </ReactMarkdown>
              </div>
            </div>
          )}

          {/* Learn More Button */}
          <LocaleLink
            href={`/service/${service.slug || service.documentId}`}
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-primary transition-all hover:bg-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            {t("actions.learnMore")}
            <ChevronRightIcon className="h-4 w-4" />
          </LocaleLink>
        </div>
      </div>
    </div>
  );
}

export default function Services({ data }: ServicesProps) {
  const { heading, subheading, services } = data;
  const [activeIndex, setActiveIndex] = useState(0);

  // Return nothing if no services
  if (!services || services.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center md:mb-16">
          {subheading && (
            <p className="mb-3 text-sm uppercase tracking-[0.4em] text-accent">{subheading}</p>
          )}
          {heading && (
            <>
              <h2 className="text-3xl font-semibold text-primary md:text-4xl lg:text-5xl">
                {heading}
              </h2>
              <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-accent" />
            </>
          )}
        </div>

        {/* Desktop: Horizontal Accordion */}
        <div className="hidden gap-4 md:flex">
          {services.map((service, index) => (
            <ServiceCard
              key={service.id || index}
              service={service}
              isActive={activeIndex === index}
              onActivate={() => setActiveIndex(index)}
            />
          ))}
        </div>

        {/* Mobile: Vertical Accordion */}
        <div className="flex flex-col gap-4 md:hidden">
          {services.map((service, index) => (
            <MobileServiceCard
              key={service.id || index}
              service={service}
              isActive={activeIndex === index}
              onActivate={() => setActiveIndex(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
