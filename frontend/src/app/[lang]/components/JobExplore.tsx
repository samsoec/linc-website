"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { MapPinIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { fetchAPI } from "../utils/fetch-api";
import type { Job, JobExploreSection } from "@/types/generated";
import Loader from "./Loader";

interface JobExploreProps {
  data: JobExploreSection;
}

interface JobCardProps {
  job: Job;
}

function JobCard({ job }: JobCardProps) {
  return (
    <div className="group relative flex items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white p-6 md:p-4 transition-colors duration-300">
      {/* Left side: Job info */}
      <div className="flex-1 gap-1">
        {/* Job Division */}
        {job.jobDivision && <p className="text-sm text-gray-500">{job.jobDivision.name}</p>}

        {/* Job Name */}
        <h3 className="text-lg font-semibold text-gray-900 transition-colors group-hover:text-accent">
          {job.name}
        </h3>

        {/* Location - Mobile only */}
        {job.location && (
          <div className="flex items-center gap-2 text-sm text-gray-600 md:hidden mt-2">
            <MapPinIcon className="h-4 w-4 flex-shrink-0" />
            <span>{job.location.name}</span>
          </div>
        )}
      </div>

      {/* Location - Desktop only */}
      {job.location && (
        <div className="items-center gap-2 text-sm text-gray-600 hidden md:flex min-w-64">
          <MapPinIcon className="h-4 w-4 flex-shrink-0" />
          <span>{job.location?.name}</span>
        </div>
      )}

      {/* Right side: Apply Now - Desktop only */}
      <Link
        href={`/career/${job.slug}`}
        className="hidden md:flex items-center gap-2 text-sm font-medium text-accent transition-colors hover:text-accent-dark"
      >
        <span>Apply Now</span>
        <ChevronRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Link>

      {/* Mobile: Entire card is clickable */}
      <Link
        href={`/career/${job.slug}`}
        className="absolute inset-0 md:hidden"
        aria-label={`View ${job.name}`}
      />
    </div>
  );
}

export default function JobExplore({ data }: JobExploreProps) {
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { itemPerPage = 10 } = data;

  // Get search params for filtering
  const divisionFilter = searchParams.get("division") || "";
  const locationFilter = searchParams.get("location") || "";

  useEffect(() => {
    async function fetchJobs() {
      setIsLoading(true);
      try {
        const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
        const options = { headers: { Authorization: `Bearer ${token}` } };

        // Build filters based on search params
        const filters: Record<string, unknown> = {};
        if (divisionFilter) {
          filters.jobDivision = { slug: { $eq: divisionFilter } };
        }
        if (locationFilter) {
          filters.location = { name: { $eq: locationFilter } };
        }

        const response = await fetchAPI(
          "/jobs",
          {
            sort: { createdAt: "desc" },
            populate: {
              location: {
                fields: ["name"],
              },
              jobDivision: {
                fields: ["name", "slug"],
              },
            },
            fields: ["name", "slug", "dueDate"],
            filters: Object.keys(filters).length > 0 ? filters : undefined,
          },
          options
        );

        setJobs(response.data || []);
        setCurrentPage(1); // Reset to first page when filters change
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchJobs();
  }, [divisionFilter, locationFilter]);

  if (isLoading) {
    return (
      <div className="w-full py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="py-12 flex justify-center">
            <Loader />
          </div>
        </div>
      </div>
    );
  }

  if (!jobs || jobs.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">No job openings available at the moment.</p>
      </div>
    );
  }

  // Calculate pagination
  const totalPages = Math.ceil(jobs.length / (itemPerPage || 10));
  const startIndex = (currentPage - 1) * (itemPerPage || 10);
  const endIndex = startIndex + (itemPerPage || 10);
  const currentJobs = jobs.slice(startIndex, endIndex);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of job list
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Job List */}
        <div className="space-y-4 mb-12">
          {currentJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            {/* Page Numbers */}
            {getPageNumbers().map((page, index) => {
              if (page === "...") {
                return (
                  <span key={`ellipsis-${index}`} className="px-2 text-gray-500">
                    ...
                  </span>
                );
              }

              const pageNum = page as number;
              const isActive = pageNum === currentPage;

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`flex h-9 min-w-[2.25rem] items-center justify-center px-3 text-sm font-medium transition-all ${
                    isActive ? "text-accent" : "text-gray-700 hover:text-accent"
                  }`}
                  aria-label={`Go to page ${pageNum}`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {pageNum}
                </button>
              );
            })}

            {/* Next Button */}
            {currentPage < totalPages && (
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                className="flex h-9 w-9 items-center justify-center text-gray-700 transition-all hover:text-accent"
                aria-label="Next page"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
