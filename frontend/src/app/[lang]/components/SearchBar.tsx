"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  MagnifyingGlassIcon,
  ArrowTurnDownLeftIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { fetchAPI } from "../utils/fetch-api";
import { useDictionary } from "@/contexts/DictionaryContext";

interface Location {
  id: number;
  name: string;
}

interface JobDivision {
  id: number;
  name: string;
  slug: string;
}

interface SearchBarProps {
  size?: "default" | "small";
  navigateTo?: string;
  isLocationSearchEnabled?: boolean;
  isDivisionSearchEnabled?: boolean;
}

export default function SearchBar({
  size = "default",
  navigateTo,
  isLocationSearchEnabled = false,
  isDivisionSearchEnabled = false,
}: SearchBarProps) {
  const { t, lang } = useDictionary();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialLocation = searchParams.get("location") || "";
  const initialDivision = searchParams.get("division") || "";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [selectedDivision, setSelectedDivision] = useState(initialDivision);
  const [locations, setLocations] = useState<Location[]>([]);
  const [divisions, setDivisions] = useState<JobDivision[]>([]);

  // Fetch locations if enabled
  useEffect(() => {
    if (!isLocationSearchEnabled) return;

    async function fetchLocations() {
      try {
        const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
        const options = { headers: { Authorization: `Bearer ${token}` } };
        const response = await fetchAPI("/locations", { fields: ["name"] }, options);
        setLocations(response.data || []);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    }
    fetchLocations();
  }, [isLocationSearchEnabled]);

  // Fetch job divisions if enabled
  useEffect(() => {
    if (!isDivisionSearchEnabled) return;

    async function fetchDivisions() {
      try {
        const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
        const options = { headers: { Authorization: `Bearer ${token}` } };
        const response = await fetchAPI("/job-divisions", { fields: ["name", "slug"] }, options);
        setDivisions(response.data || []);
      } catch (error) {
        console.error("Error fetching job divisions:", error);
      }
    }
    fetchDivisions();
  }, [isDivisionSearchEnabled]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();

    if (searchQuery.trim()) {
      params.set("q", searchQuery.trim());
    }
    if (selectedDivision) {
      params.set("division", selectedDivision);
    }
    if (selectedLocation) {
      params.set("location", selectedLocation);
    }

    // If navigateTo is provided, construct full path with language prefix
    // Otherwise, just update query params on current page
    const queryString = params.toString();
    if (navigateTo) {
      router.push(`/${lang}${navigateTo}${queryString ? `?${queryString}` : ""}`);
    } else {
      router.push(`?${queryString}`);
    }
  };

  const isSmall = size === "small";
  const hasFilters = isLocationSearchEnabled || isDivisionSearchEnabled;

  // Large version with filters
  if (!isSmall && hasFilters) {
    return (
      <form onSubmit={handleSearch} className="w-full mt-8 max-w-4xl">
        <div className="flex items-center rounded-full border border-gray-200 bg-white shadow-lg overflow-hidden">
          {/* Division Select */}
          {isDivisionSearchEnabled && (
            <div className="relative flex-1 border-r border-gray-200">
              <select
                value={selectedDivision}
                onChange={(e) => setSelectedDivision(e.target.value)}
                className="w-full appearance-none bg-transparent py-4 pl-6 pr-10 text-gray-900 focus:outline-none cursor-pointer"
              >
                <option value="">{t("filters.allDivisions")}</option>
                {divisions.map((division) => (
                  <option key={division.id} value={division.slug}>
                    {division.name}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          )}

          {/* Location Select */}
          {isLocationSearchEnabled && (
            <div className="relative flex-1 border-r border-gray-200">
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full appearance-none bg-transparent py-4 pl-6 pr-10 text-gray-900 focus:outline-none cursor-pointer"
              >
                <option value="">{t("filters.allLocations")}</option>
                {locations.map((location) => (
                  <option key={location.id} value={location.name}>
                    {location.name}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          )}

          {/* Enter hint and Search button */}
          <div className="flex items-center gap-2 px-2">
            <span className="text-sm text-gray-400 hidden sm:block">
              {t("common.enter")} <ArrowTurnDownLeftIcon className="inline h-4 w-4" />
            </span>
            <button
              type="submit"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white transition-colors hover:bg-accent-dark"
              aria-label={t("common.search")}
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </form>
    );
  }

  // Default search bar (text input only)
  return (
    <form onSubmit={handleSearch} className={`w-full ${isSmall ? "" : "mt-8 max-w-2xl"}`}>
      <div className="relative flex items-center">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search updates..."
          className={`w-full rounded-full border border-gray-200 bg-white text-gray-900 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent ${
            isSmall ? "py-3 pl-4 pr-12 text-sm" : "py-4 pl-6 pr-32 text-base shadow-lg border-0"
          }`}
        />
        <div className={`absolute flex items-center gap-2 ${isSmall ? "right-1" : "right-2"}`}>
          {!isSmall && (
            <span className="text-sm text-gray-400">
              Enter <ArrowTurnDownLeftIcon className="inline h-4 w-4" />
            </span>
          )}
          <button
            type="submit"
            className={`flex items-center justify-center rounded-full bg-accent text-white transition-colors hover:bg-accent-dark ${
              isSmall ? "h-8 w-8" : "h-12 w-12"
            }`}
            aria-label="Search"
          >
            <MagnifyingGlassIcon className={isSmall ? "h-4 w-4" : "h-5 w-5"} />
          </button>
        </div>
      </div>
    </form>
  );
}
