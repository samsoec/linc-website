import Image from "next/image";
import Link from "next/link";
import { ServicesGridSection, Service } from "@/types/generated";
import { getStrapiMedia } from "../utils/api-helpers";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

interface ServicesGridProps {
  data: ServicesGridSection;
}

interface ServiceCardProps {
  service: Service;
}

function ServiceCard({ service }: ServiceCardProps) {
  const imageUrl = getStrapiMedia(service.picture?.url || null);
  const iconUrl = getStrapiMedia(service.icon?.url || null);

  return (
    <Link
      href={`/services/${service.slug || service.documentId}`}
      className="group relative block h-[280px] overflow-hidden rounded-2xl md:h-[350px]"
    >
      {/* Background Image */}
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={service.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      )}

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40 transition-opacity duration-300 group-hover:bg-black/50" />

      {/* Content Container */}
      <div className="absolute inset-0 flex items-end justify-between p-6 md:p-8 gap-2">
        {/* Left: Title, Description, and Button */}
        <div className="flex flex-col transition-transform duration-300 group-hover:-translate-y-4">
          <h3 className="mb-2 text-base font-semibold text-white">
            {service.name}
          </h3>
          {service.description && (
            <p className="mb-2 line-clamp-2 text-xs text-gray-200 md:text-sm lg:text-base">
              {service.caption}
            </p>
          )}

          {/* Learn More Button - Shows on Hover */}
          <div className="max-h-0 overflow-hidden opacity-0 transition-all duration-300 group-hover:max-h-20 group-hover:opacity-100">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-primary transition-all hover:bg-gray-100">
              Learn More
              <ChevronRightIcon className="h-4 w-4" />
            </span>
          </div>
        </div>

        {/* Right: Icon/Logo */}
        <div className="flex-shrink-0">
          {iconUrl ? (
            <div className="h-28 w-28 overflow-hidden rounded-lg md:h-32 md:w-32">
              <Image
                src={iconUrl}
                alt={`${service.name} icon`}
                width={128}
                height={64}
                className="h-full w-full object-contain p-2 invert brightness-0"
              />
            </div>
          ) : (
            <div className="h-14 w-28 rounded-lg bg-white md:h-16 md:w-32" />
          )}
        </div>
      </div>
    </Link>
  );
}

export default function ServicesGrid({ data }: ServicesGridProps) {
  const { heading, subheading, description, services } = data;

  // Return nothing if no services
  if (!services || services.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 md:mb-16">
          <div className="grid gap-8 md:grid-cols-2 md:gap-12 lg:gap-16">
            <div>
              {subheading && (
                <p className="mb-3 text-sm font-medium uppercase tracking-[0.4em] text-accent">
                  {subheading}
                </p>
              )}
              {heading && (
                <>
                  <h2 className="text-3xl font-semibold text-primary md:text-4xl lg:text-5xl">
                    {heading}
                  </h2>
                  <div className="mt-6 h-1 w-16 rounded-full bg-accent" />
                </>
              )}
            </div>
            {description && (
              <p className="mt-6 text-base text-gray-600 md:text-lg">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Services Grid */}
        {/* Desktop: 2 columns, Mobile: 1 column */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {services.map((service, index) => (
            <ServiceCard key={service.id || index} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}
