import Image from "next/image";
import type { CareerBenefitSection } from "@/types/generated";
import { getStrapiMedia } from "../utils/api-helpers";
import { LightBulbIcon } from "@heroicons/react/24/outline";

interface CareerBenefitProps {
  data: CareerBenefitSection;
}

export default function CareerBenefit({ data }: CareerBenefitProps) {
  if (!data || !data.benefits || data.benefits.length === 0) return null;

  const { heading, subheading, description, benefits, background } = data;
  const backgroundUrl = getStrapiMedia(background?.url || null);

  return (
    <section className="relative w-full py-16 md:py-24 overflow-hidden">
      {/* Background Image */}
      {backgroundUrl && (
        <div className="absolute inset-0">
          <Image
            src={backgroundUrl}
            alt={background?.alternativeText || "Career benefits background"}
            fill
            className="object-cover"
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/70" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="max-w-3xl mb-12 md:mb-16">
          {subheading && (
            <p className="text-white text-sm md:text-base font-light tracking-[0.3em] mb-4 uppercase">
              {subheading}
            </p>
          )}

          {heading && (
            <>
              <h2 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                {heading}
              </h2>
              <div className="h-1 w-16 rounded-full bg-white mb-6" />
            </>
          )}

          {description && (
            <p className="text-white text-base md:text-lg leading-relaxed">{description}</p>
          )}
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <div
              key={benefit.id || index}
              className="group relative overflow-hidden rounded-xl border-2 border-white/30 bg-white/5 backdrop-blur-sm p-6 transition-all duration-300 hover:border-white/60 hover:bg-white/10"
            >
              {/* Icon */}
              <div className="mb-4">
                <LightBulbIcon className="h-10 w-10 text-white" />
              </div>

              {/* Title */}
              <h3 className="text-white text-xl font-bold mb-3">{benefit.title}</h3>

              {/* Description */}
              <p className="text-white/90 text-sm leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
