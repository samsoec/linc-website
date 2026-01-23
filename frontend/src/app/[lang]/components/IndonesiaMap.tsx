"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { IndonesiaMapSection, MapInfo } from "@/types/generated";
import { DynamicHeroIcon, KeyIcon } from "./DynamicIcon";
import { useDraggableScroll } from "./useDraggableScroll";
import { useDictionary } from "@/contexts/DictionaryContext";

interface IndonesiaMapProps {
  data: IndonesiaMapSection;
}

// Indonesia geographic bounds (approximate)
const INDONESIA_BOUNDS = {
  minLat: -11.0, // Southernmost (Rote Island)
  maxLat: 6.0, // Northernmost (Sabang)
  minLng: 95.0, // Westernmost (Sabang)
  maxLng: 141.0, // Easternmost (Papua)
};

// SVG viewBox dimensions
const SVG_WIDTH = 1706;
const SVG_HEIGHT = 611;

/**
 * Convert geographic coordinates (lat/lng) to percentage position on the map
 * This ensures markers scale correctly at any screen size
 */
function coordsToPercent(lat: number, lng: number): { left: number; top: number } {
  const { minLat, maxLat, minLng, maxLng } = INDONESIA_BOUNDS;

  // Calculate percentage from left (longitude)
  const left = ((lng - minLng) / (maxLng - minLng)) * 100;

  // Calculate percentage from top (latitude - inverted because SVG y-axis is top-down)
  const top = ((maxLat - lat) / (maxLat - minLat)) * 100;

  return { left, top };
}

interface LocationMarkerProps {
  mapInfo: MapInfo;
  markerIcon?: string;
  isActive: boolean;
  onHover: (mapInfo: MapInfo | null, element: HTMLElement | null) => void;
  onClick: (mapInfo: MapInfo) => void;
  allLocations: MapInfo[]; // For collision detection
}

function LocationMarker({
  mapInfo,
  markerIcon,
  isActive,
  onHover,
  onClick,
  allLocations,
}: LocationMarkerProps) {
  const location = mapInfo.location;
  const markerRef = useRef<HTMLButtonElement>(null);

  const { left, top } = location
    ? coordsToPercent(location.latitude, location.longitude)
    : { left: 0, top: 0 };

  // Calculate label position to avoid overlaps
  const labelPosition = useMemo(() => {
    if (!location) return null;
    const { markerTitle, markerSubtitle } = mapInfo;
    if (!markerTitle && !markerSubtitle) return null;

    // Check nearby markers to determine best label position
    const nearbyMarkers = allLocations.filter((m) => {
      if (!m.location || m.id === mapInfo.id) return false;
      const { left: otherLeft, top: otherTop } = coordsToPercent(
        m.location.latitude,
        m.location.longitude
      );
      const distance = Math.sqrt(Math.pow(left - otherLeft, 2) + Math.pow(top - otherTop, 2));
      return distance < 15; // Within 15% distance
    });

    // Default: right side
    let position = "right";

    // If marker is on right edge, place label on left
    if (left > 80) {
      position = "left";
    }
    // If there are nearby markers on the right, try left
    else if (
      nearbyMarkers.some((m) => {
        const { left: otherLeft } = coordsToPercent(m.location!.latitude, m.location!.longitude);
        return otherLeft > left;
      })
    ) {
      position = "left";
    }

    return position;
  }, [mapInfo, left, top, allLocations, location]);

  if (!location) return null;

  return (
    <>
      <button
        ref={markerRef}
        className="group absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
        style={{ left: `${left}%`, top: `${top}%` }}
        onMouseEnter={() => onHover(mapInfo, markerRef.current)}
        onMouseLeave={() => onHover(null, null)}
        onClick={() => onClick(mapInfo)}
        aria-label={`View ${location.name} location`}
      >
        {/* Outer ring */}
        <span
          className={`absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 transition-all duration-300 md:h-6 md:w-6 ${
            isActive ? "border-accent bg-accent/20 scale-125" : "border-accent/60 bg-white/80"
          }`}
        />

        {/* Inner dot / Icon */}
        <span
          className={`relative flex h-3 w-3 items-center justify-center rounded-full transition-all duration-300 md:h-4 md:w-4 ${
            markerIcon ? "bg-transparent" : isActive ? "bg-accent scale-110" : "bg-accent"
          }`}
        >
          {markerIcon && (
            <DynamicHeroIcon
              iconName={markerIcon as KeyIcon}
              className="h-3 w-3 md:h-4 md:w-4 text-accent"
              variant="solid"
              library="fa"
            />
          )}
        </span>
      </button>

      {/* Marker Label */}
      {labelPosition && (mapInfo.markerTitle || mapInfo.markerSubtitle) && (
        <div
          className={`pointer-events-none absolute z-[5] whitespace-nowrap ${
            labelPosition === "right" ? "left-full ml-3" : "right-full mr-3"
          }`}
          style={{ left: `${left}%`, top: `${top}%`, transform: "translateY(-50%)" }}
        >
          <div className="px-3 py-1.5">
            {mapInfo.markerTitle && (
              <p className="text-sm font-semibold text-accent">{mapInfo.markerTitle}</p>
            )}
            {mapInfo.markerSubtitle && (
              <p className="text-xs font-semibold text-gray-600">{mapInfo.markerSubtitle}</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

interface LocationTooltipProps {
  mapInfo: MapInfo;
  markerElement: HTMLElement | null;
}

function LocationTooltip({ mapInfo, markerElement }: LocationTooltipProps) {
  const { t } = useDictionary();
  const location = mapInfo.location;
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!markerElement) return;

    const updatePosition = () => {
      const rect = markerElement.getBoundingClientRect();
      setPosition({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    };

    updatePosition();

    // Update on scroll/resize
    const scrollContainer = markerElement.closest(".scrollbar-hide");
    scrollContainer?.addEventListener("scroll", updatePosition);
    window.addEventListener("resize", updatePosition);

    return () => {
      scrollContainer?.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
    };
  }, [markerElement]);

  // Calculate tooltip transform to prevent cropping at edges
  const tooltipTransform = useMemo(() => {
    if (!position) return "-translate-x-1/2";
    const viewportWidth = window.innerWidth;
    const tooltipWidth = 450; // Approximate tooltip width

    if (position.x < tooltipWidth / 2) {
      return "translate-x-0"; // Align to left
    } else if (position.x > viewportWidth - tooltipWidth / 2) {
      return "-translate-x-full"; // Align to right
    }
    return "-translate-x-1/2"; // Center (default)
  }, [position]);

  // Calculate tooltip position (above or below marker) to prevent cropping at bottom
  const { tooltipTop, shouldTranslateY } = useMemo(() => {
    if (!position) {
      return {
        tooltipTop: 0,
        shouldTranslateY: false,
      };
    }

    const viewportHeight = window.innerHeight;
    const tooltipHeight = 250; // Approximate tooltip height
    const isBottom = position.y > viewportHeight - tooltipHeight - 30;

    return {
      tooltipTop: isBottom ? position.y - 30 : position.y + 30,
      shouldTranslateY: isBottom,
    };
  }, [position]);

  if (!location || !position) return null;

  const tooltipContent = (
    <div
      className={`pointer-events-none fixed z-[60] hidden md:block ${tooltipTransform} ${shouldTranslateY ? "-translate-y-full" : ""}`}
      style={{
        left: `${position.x}px`,
        top: `${tooltipTop}px`,
      }}
    >
      <div className="min-w-[400px] max-w-[500px] rounded-lg border border-accent bg-white p-5 shadow-xl">
        {/* Zone Header */}
        <h4 className="mb-4 text-lg font-semibold text-accent">{location.name}</h4>

        {/* MapInfo items in 2-column grid */}
        {mapInfo.item && mapInfo.item.length > 0 && (
          <div
            className={`grid ${mapInfo.item.length > 3 ? "grid-cols-2" : "grid-cols-1"} gap-x-6 gap-y-4`}
          >
            {mapInfo.item.map((infoItem, idx) => (
              <div key={infoItem.id || idx}>
                <p className="mb-1 text-sm font-semibold text-gray-800">{infoItem.subtitle}</p>
                {infoItem.item && infoItem.item.length > 0 && (
                  <div className="space-y-0.5">
                    {infoItem.item.map((highlight, hIdx) => (
                      <div
                        key={highlight.id || hIdx}
                        className="flex items-baseline justify-between gap-2 text-sm"
                      >
                        <span
                          className={`${highlight.caption?.toLowerCase().includes("bulk") ? "text-accent" : "text-gray-600"}`}
                        >
                          {highlight.value}
                        </span>
                        <span
                          className={`text-right ${highlight.caption?.toLowerCase().includes("bulk") ? "text-accent" : "text-gray-600"}`}
                        >
                          {highlight.caption}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {(!mapInfo.item || mapInfo.item.length === 0) && (
          <p className="text-gray-600">{t("search.noResultsFound")}</p>
        )}
      </div>
    </div>
  );

  return createPortal(tooltipContent, document.body);
}

interface MapInfoModalProps {
  mapInfo: MapInfo;
  onClose: () => void;
}

function MapInfoModal({ mapInfo, onClose }: MapInfoModalProps) {
  const location = mapInfo.location;
  const { t } = useDictionary();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  if (!location) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 md:hidden"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20 md:right-8 md:top-8"
        aria-label="Close"
      >
        <XMarkIcon className="h-8 w-8" />
      </button>

      {/* Card content */}
      <div className="relative w-full max-w-lg animate-slide-up rounded-lg border border-accent bg-white p-6 shadow-2xl">
        {/* Zone Header */}
        <h4 className="mb-4 text-xl font-semibold text-accent">{location.name}</h4>

        {/* MapInfo items */}
        {mapInfo.item && mapInfo.item.length > 0 && (
          <div className="space-y-5">
            {mapInfo.item.map((infoItem, idx) => (
              <div key={infoItem.id || idx}>
                <p className="mb-1.5 text-base font-semibold text-gray-800">{infoItem.subtitle}</p>
                {infoItem.item && infoItem.item.length > 0 && (
                  <div className="space-y-1">
                    {infoItem.item.map((highlight, hIdx) => (
                      <div
                        key={highlight.id || hIdx}
                        className="flex items-baseline justify-between gap-4 text-sm"
                      >
                        <span
                          className={
                            highlight.value?.toLowerCase().includes("bulk")
                              ? "text-accent"
                              : "text-gray-600"
                          }
                        >
                          {highlight.value}
                        </span>
                        <span
                          className={
                            highlight.value?.toLowerCase().includes("bulk")
                              ? "text-accent"
                              : "text-gray-600"
                          }
                        >
                          : {highlight.caption}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {(!mapInfo.item || mapInfo.item.length === 0) && (
          <p className="text-gray-600">{t("search.noResultsFound")}</p>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

interface CustomScrollbarProps {
  scrollRef: React.RefObject<HTMLElement | null>;
  scrollProgress: number;
}

function CustomScrollbar({ scrollRef, scrollProgress }: CustomScrollbarProps) {
  const handleTrackClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!scrollRef.current) return;
      const track = e.currentTarget;
      const rect = track.getBoundingClientRect();
      const clickPosition = (e.clientX - rect.left) / rect.width;
      const maxScroll = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
      scrollRef.current.scrollTo({
        left: clickPosition * maxScroll,
        behavior: "smooth",
      });
    },
    [scrollRef]
  );

  return (
    <div className="mt-6 flex justify-center px-4">
      <div
        className="h-2 w-32 cursor-pointer rounded-full bg-gray-200 md:w-48"
        onClick={handleTrackClick}
      >
        <div
          className="h-full rounded-full bg-accent transition-all duration-150"
          style={{ width: `${Math.max(30, scrollProgress)}%` }}
        />
      </div>
    </div>
  );
}

export default function IndonesiaMap({ data }: IndonesiaMapProps) {
  const { heading, subheading, description, markerIcon, locations } = data;
  const [hoveredMapInfo, setHoveredMapInfo] = useState<MapInfo | null>(null);
  const [hoveredMarkerElement, setHoveredMarkerElement] = useState<HTMLElement | null>(null);
  const [selectedMapInfo, setSelectedMapInfo] = useState<MapInfo | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollContainerRef = useDraggableScroll<HTMLDivElement>();
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const handleMarkerHover = useCallback((mapInfo: MapInfo | null, element: HTMLElement | null) => {
    setHoveredMapInfo(mapInfo);
    setHoveredMarkerElement(element);
  }, []);

  // Handle horizontal scroll progress
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const maxScroll = container.scrollWidth - container.clientWidth;
      if (maxScroll > 0) {
        const progress = (container.scrollLeft / maxScroll) * 100;
        setScrollProgress(progress);
      }
    };

    container.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial calculation

    return () => container.removeEventListener("scroll", handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMarkerClick = useCallback((mapInfo: MapInfo) => {
    setSelectedMapInfo(mapInfo);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedMapInfo(null);
  }, []);

  // Filter out locations without valid coordinates
  const validLocations =
    locations?.filter((loc) => loc.location?.latitude && loc.location?.longitude) || [];

  if (validLocations.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-white py-16 md:py-24">
      {/* Header */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
      </div>

      {/* Map Container - Horizontal scroll on desktop showing 75% */}
      <div
        ref={scrollContainerRef}
        className="relative overflow-x-auto overflow-y-hidden scrollbar-hide"
      >
        <div
          ref={mapContainerRef}
          className="relative mx-auto w-[350%] md:w-[250%] lg:w-[125%]"
          style={{ aspectRatio: `${SVG_WIDTH}/${SVG_HEIGHT}` }}
        >
          {/* SVG Map Background */}
          <Image
            src="/indo-map.svg"
            alt="Indonesia Map"
            fill
            className="object-contain"
            draggable={false}
            priority
            onDragStart={(e) => e.preventDefault()}
          />

          {/* Location Markers */}
          {validLocations.map((mapInfo) => (
            <LocationMarker
              key={mapInfo.id}
              mapInfo={mapInfo}
              markerIcon={markerIcon}
              isActive={hoveredMapInfo?.id === mapInfo.id}
              onHover={handleMarkerHover}
              onClick={handleMarkerClick}
              allLocations={validLocations}
            />
          ))}
        </div>
      </div>

      {/* Desktop Tooltip - Rendered outside scroll container to prevent clipping */}
      {!!data.hoverable && hoveredMapInfo && hoveredMarkerElement && (
        <LocationTooltip mapInfo={hoveredMapInfo} markerElement={hoveredMarkerElement} />
      )}

      {/* Mobile Modal */}
      {!!data.hoverable && selectedMapInfo && (
        <MapInfoModal mapInfo={selectedMapInfo} onClose={handleCloseModal} />
      )}

      {/* Custom Scrollbar */}
      <CustomScrollbar scrollRef={scrollContainerRef} scrollProgress={scrollProgress} />
    </section>
  );
}
