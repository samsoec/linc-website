"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MagnifyingGlassIcon, ArrowTurnDownLeftIcon } from "@heroicons/react/24/outline";

interface SearchBarProps {
  size?: "default" | "small";
}

export default function SearchBar({ size = "default" }: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());

    if (searchQuery.trim()) {
      params.set("q", searchQuery.trim());
    } else {
      params.delete("q");
    }

    // Reset to first page when searching
    params.delete("page");

    router.push(`/blog?${params.toString()}`);
  };

  const isSmall = size === "small";

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
