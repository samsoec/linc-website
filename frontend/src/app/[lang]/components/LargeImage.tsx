import Image from "next/image";
import type { LargeImageSection } from "@/types/generated";
import { getStrapiMedia } from "../utils/api-helpers";
import { MapPinIcon } from "@heroicons/react/24/outline";

interface LargeImageProps {
  data: LargeImageSection;
}

export default function LargeImage({ data }: LargeImageProps) {
  const { heading, subheading, image, background } = data;

  const imageUrl = getStrapiMedia(image?.media?.url || null);

  if (!imageUrl) return null;

  const isBrandColor = background === "brand-color";
  const textColor = isBrandColor ? "text-white" : "text-primary";
  const subheadingColor = isBrandColor ? "text-white" : "text-accent";
  const lineColor = isBrandColor ? "bg-white" : "bg-accent";
  const bgClass = isBrandColor ? "bg-accent" : "bg-white";

  return (
    <section className={`relative w-full overflow-hidden py-16 md:py-24 ${bgClass}`}>
      {/* Background Image - Only show for brand-color */}
      {isBrandColor && (
        <div className="absolute inset-0">
          <Image src="/background-banner.png" alt={"Background"} fill className="object-cover" />
        </div>
      )}

      <div className="relative mx-auto z-10 max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center md:mb-16">
          {subheading && (
            <p className={`mb-3 text-sm font-medium uppercase tracking-[0.4em] ${subheadingColor}`}>
              {subheading}
            </p>
          )}
          {heading && (
            <>
              <h2 className={`text-3xl font-semibold md:text-4xl lg:text-5xl ${textColor}`}>
                {heading}
              </h2>
              <div className={`mx-auto mt-6 h-1 w-16 rounded-full ${lineColor}`} />
            </>
          )}
        </div>

        {/* Image */}
        {image && (
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
                        {image.caption && (
                          <p className="font-semibold text-white">{image.caption}</p>
                        )}
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
                              {item.caption && (
                                <p className="text-sm text-gray-300">{item.caption}</p>
                              )}
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
              <div className="md:hidden grid grid-cols-3 divide-x divide-gray-200 rounded-b-2xl py-6">
                {image.items.map((item, index) => (
                  <div key={index} className="text-center px-4">
                    {item.title && (
                      <p
                        className={`text-sm font-semibold ${isBrandColor ? "text-white" : "text-gray-500"}`}
                      >
                        {item.title}
                      </p>
                    )}
                    <p
                      className={`text-2xl font-semibold ${isBrandColor ? "text-white" : "text-accent"}`}
                    >
                      {item.value}
                    </p>
                    {item.caption && (
                      <p className={`text-xs ${isBrandColor ? "text-white" : "text-gray-500"}`}>
                        {item.caption}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
