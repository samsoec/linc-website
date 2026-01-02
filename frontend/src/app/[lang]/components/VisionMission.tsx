"use client";

import Image from "next/image";
import type { VisionMissionSection } from "@/types/generated";
import { getStrapiMedia } from "../utils/api-helpers";

interface VisionMissionProps {
  data: VisionMissionSection;
}

export default function VisionMission({ data }: VisionMissionProps) {
  const { background, visionMission, coreValues } = data;

  if (!visionMission && !coreValues) {
    return null;
  }

  const backgroundUrl = getStrapiMedia(background?.url);

  // Parse core values - assume it's a JSON array of objects with number and text
  const coreValuesArray = coreValues?.values
    ? typeof coreValues.values === "string"
      ? JSON.parse(coreValues.values)
      : Array.isArray(coreValues.values)
        ? coreValues.values
        : []
    : [];

  return (
    <section className="relative w-full overflow-hidden py-16 md:py-24">
      {/* Background Image */}
      {backgroundUrl && (
        <div className="absolute inset-0">
          <Image
            src={backgroundUrl}
            alt="Vision & Mission background"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/60" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Vision & Mission Section */}
        {visionMission && (
          <div className="mb-16 md:mb-24">
            {/* Subheading */}
            {visionMission.subheading && (
              <p className="mb-8 text-sm font-medium uppercase tracking-[0.2em] text-white/80 md:text-left">
                {visionMission.subheading}
              </p>
            )}

            {/* Vision & Mission Grid */}
            <div className="grid gap-12 md:grid-cols-2 md:gap-16">
              {/* Our Vision */}
              <div>
                {visionMission.visionHeading && (
                  <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
                    {visionMission.visionHeading}
                  </h2>
                )}
                {visionMission.visionDescription && (
                  <>
                    <p className="mb-6 text-xl leading-relaxed text-white md:text-2xl">
                      {visionMission.visionDescription}
                    </p>
                    <div className="h-1 w-16 rounded-full bg-white" />
                  </>
                )}
              </div>

              {/* Our Mission */}
              <div>
                {visionMission.missionHeading && (
                  <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
                    {visionMission.missionHeading}
                  </h2>
                )}
                {visionMission.missionDescription && (
                  <div className="space-y-4 text-white">
                    {visionMission.missionDescription.split("\n").map((line, index) => (
                      <p key={index} className="leading-relaxed">
                        {line}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Core Values Section */}
        {coreValues && (
          <div>
            {/* Subheading */}
            {coreValues.subheading && (
              <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-white/80 md:text-left">
                {coreValues.subheading}
              </p>
            )}

            {/* Heading */}
            {coreValues.heading && (
              <h2 className="mb-6 text-3xl font-bold text-white md:text-left md:text-4xl lg:text-5xl">
                {coreValues.heading}
              </h2>
            )}

            {/* Description */}
            {coreValues.description && (
              <>
                <p className="mb-6 text-white/90 md:text-left">{coreValues.description}</p>
                <div className="mx-auto mb-12 h-1 w-16 rounded-full bg-white md:mx-0" />
              </>
            )}

            {/* Core Values Grid */}
            {coreValuesArray.length > 0 && (
              <div className="grid gap-8 sm:grid-cols-2 md:gap-12">
                {coreValuesArray.map(
                  (value: { text?: string; description?: string } | string, index: number) => (
                    <div key={index} className="flex items-start gap-6">
                      {/* Number */}
                      <div className="flex-shrink-0">
                        <span className="text-5xl font-bold text-white md:text-6xl">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                      {/* Text */}
                      <div className="flex-1 pt-2">
                        <p className="text-lg leading-relaxed text-white">
                          {typeof value === "string"
                            ? value
                            : (value as { text?: string; description?: string }).text ||
                              (value as { text?: string; description?: string }).description ||
                              ""}
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
