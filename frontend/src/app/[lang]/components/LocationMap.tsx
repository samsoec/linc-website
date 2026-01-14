"use client";

import { useState } from "react";
import { LocationMapSection, Location } from "@/types/generated";
import ChipTabs from "./ChipTabs";

interface LocationMapProps {
  data: LocationMapSection;
}

export default function LocationMap({ data }: LocationMapProps) {
  const { heading, subheading, description, locations } = data;
  const [activeIndex, setActiveIndex] = useState(0);

  if (!locations || locations.length === 0) {
    return null;
  }

  const activeLocation = locations[activeIndex];

  return (
    <section className="w-full bg-white pt-16 md:pt-24">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center md:mb-16">
          {subheading && (
            <p className="mb-3 text-sm uppercase tracking-[0.4em] text-accent">{subheading}</p>
          )}
          {heading && (
            <h2 className="text-3xl font-semibold text-primary md:text-4xl lg:text-5xl">
              {heading}
            </h2>
          )}
          {description && <p className="mx-auto mt-4 max-w-2xl text-gray-600">{description}</p>}
          <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-accent" />
        </div>

        {/* Location Tabs */}
        <div className="mb-8 md:mb-12">
          <ChipTabs
            items={locations}
            activeIndex={activeIndex}
            onSelect={setActiveIndex}
            getLabel={(location: Location) => location.name}
          />
        </div>
      </div>

      {/* Map Embed */}
      {activeLocation?.mapUrl && (
        <div className="overflow-hidden">
          <iframe
            src={activeLocation.mapUrl}
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`Map of ${activeLocation.name}`}
            className="w-full"
          />
        </div>
      )}
    </section>
  );
}
