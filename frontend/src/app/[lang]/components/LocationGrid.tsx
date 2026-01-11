import { MapPinIcon, EnvelopeIcon, PhoneIcon } from "@heroicons/react/24/outline";
import type { LocationGridSection, Location } from "@/types/generated";

interface LocationGridProps {
  data: LocationGridSection;
}

interface LocationCardProps {
  location: Location;
}

function LocationCard({ location }: LocationCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm transition-shadow duration-300 hover:shadow-md">
      {/* Location Icon and Title */}
      <div className="mb-4 flex items-start gap-3">
        <MapPinIcon className="h-6 w-6 flex-shrink-0 text-gray-900" />
        <h3 className="text-xl font-semibold text-gray-900">{location.title}</h3>
      </div>

      {/* Address */}
      <p className="mb-6 text-sm leading-relaxed text-gray-600 sm:text-base">
        {location.address}
      </p>

      {/* Contact Information */}
      <div className="space-y-3">
        {/* Email */}
        {location.emails && location.emails.length > 0 && (
          <div className="flex items-start gap-3">
            <EnvelopeIcon className="h-5 w-5 flex-shrink-0 text-accent" />
            <div className="flex flex-col gap-1">
              {location.emails.map((email, index) => (
                <a
                  key={index}
                  href={`mailto:${email.email}`}
                  className="text-sm text-accent hover:underline sm:text-base"
                >
                  {email.email}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Phone Numbers */}
        {location.phoneNumbers && location.phoneNumbers.length > 0 && (
          <div className="flex items-start gap-3">
            <PhoneIcon className="h-5 w-5 flex-shrink-0 text-accent" />
            <div className="flex flex-col gap-1">
              {location.phoneNumbers.map((phone, index) => (
                <a
                  key={index}
                  href={`tel:${phone.phoneNumber.replace(/\s/g, "")}`}
                  className="text-sm text-accent hover:underline sm:text-base"
                >
                  {phone.phoneNumber}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LocationGrid({ data }: LocationGridProps) {
  const { heading, subheading, items } = data;

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center md:mb-16">
          {subheading && (
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.4em] text-accent">
              {subheading}
            </p>
          )}
          {heading && (
            <>
              <h2 className="mb-4 text-3xl font-semibold text-gray-900 md:text-4xl lg:text-5xl">
                {heading}
              </h2>
              {/* Accent Line */}
              <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-accent" />
            </>
          )}
        </div>

        {/* Location Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          {items.map((location, index) => (
            <LocationCard key={location.id || index} location={location} />
          ))}
        </div>
      </div>
    </section>
  );
}
