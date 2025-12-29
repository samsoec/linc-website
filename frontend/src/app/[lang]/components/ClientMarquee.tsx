"use client";

import Image from "next/image";
import { ClientMarqueeSection } from "@/types/generated";
import { getStrapiMedia } from "../utils/api-helpers";

interface ClientMarqueeProps {
  data: ClientMarqueeSection;
}

export default function ClientMarquee({ data }: ClientMarqueeProps) {
  const { clients } = data;

  // Return nothing if no clients
  if (!clients || clients.length === 0) {
    return null;
  }

  // Duplicate the clients array for seamless infinite scroll
  const duplicatedClients = [...clients, ...clients];

  return (
    <section className="w-full overflow-hidden bg-white py-12">
      <div className="relative">
        {/* Gradient overlays for smooth fade effect */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-white to-transparent" />

        {/* Marquee container */}
        <div className="flex animate-marquee">
          {duplicatedClients.map((client, index) => {
            const imageUrl = getStrapiMedia(client.url);
            if (!imageUrl) return null;

            return (
              <div
                key={`${client.id}-${index}`}
                className="mx-8 flex flex-shrink-0 items-center justify-center md:mx-12 lg:mx-16"
              >
                <Image
                  src={imageUrl}
                  alt={client.alternativeText || "Client logo"}
                  width={client.width || 150}
                  height={client.height || 50}
                  className="h-8 w-auto object-contain grayscale opacity-60 transition-all duration-300 hover:grayscale-0 hover:opacity-100 md:h-10 lg:h-12"
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
