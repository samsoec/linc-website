import type { MapEmbedBlock } from "@/types/generated";

interface MapEmbedProps {
  data: MapEmbedBlock;
}

export default function MapEmbed({ data }: MapEmbedProps) {
  const { mapUrl } = data;

  if (!mapUrl) {
    return null;
  }

  return (
    <section className="w-full">
      <div className="relative h-96 w-full md:h-[500px] lg:h-[600px]">
        <iframe
          src={mapUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Location Map"
          className="absolute inset-0"
        />
      </div>
    </section>
  );
}
