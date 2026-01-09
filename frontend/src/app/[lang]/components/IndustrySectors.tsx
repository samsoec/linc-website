import Image from "next/image";
import { IndustrySectorsSection, IndustrySector } from "@/types/generated";
import { getStrapiMedia } from "../utils/api-helpers";

interface IndustrySectorsProps {
  data: IndustrySectorsSection;
}

function SectorCard({ sector }: { sector: IndustrySector }) {
  const imageUrl = getStrapiMedia(sector.media?.url);

  return (
    <div className="group relative aspect-square overflow-hidden rounded-2xl bg-gray-100">
      {/* Background Image with zoom effect */}
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={sector.caption || "Industry sector"}
          fill
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        />
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

      {/* Caption */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <p className="font-medium text-white">{sector.caption}</p>
      </div>
    </div>
  );
}

export default function IndustrySectors({ data }: IndustrySectorsProps) {
  const { heading, subheading, description, sectors } = data;

  if (!sectors || sectors.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 md:mb-16">
          {subheading && (
            <p className="mb-3 text-sm uppercase tracking-[0.4em] text-accent">
              {subheading}
            </p>
          )}
          {heading && (
            <h2 className="text-3xl font-semibold text-primary md:text-4xl lg:text-5xl">
              {heading}
            </h2>
          )}
          {description && <p className="mt-4 max-w-2xl text-gray-600">{description}</p>}
          <div className="mt-6 h-1 w-16 rounded-full bg-accent" />
        </div>

        {/* Sectors Grid - 5 columns on desktop, 2 on mobile */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {sectors.map((sector, index) => (
            <SectorCard key={sector.id || index} sector={sector} />
          ))}
        </div>
      </div>
    </section>
  );
}
