"use client";

import ReactMarkdown from "react-markdown";
import type { ServiceInfoSection } from "@/types/generated";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

interface ServiceInfoProps {
  data: ServiceInfoSection;
}

export default function ServiceInfo({ data }: ServiceInfoProps) {
  const { heading, subheading, informations, closing } = data;

  if (!informations || informations.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center md:mb-16">
          {subheading && (
            <p className="mb-3 text-sm uppercase tracking-[0.4em] text-accent">{subheading}</p>
          )}
          {heading && (
            <>
              <h2 className="text-3xl font-semibold text-primary md:text-4xl lg:text-5xl">
                {heading}
              </h2>
              <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-accent" />
            </>
          )}
        </div>

        {/* Information Sections */}
        <div className="space-y-12 md:space-y-16">
          {informations.map((info, index) => (
            <div key={info.id || index} className="grid gap-4 md:grid-cols-3">
              {/* Title */}
              {info.title && (
                <h3 className="mb-6 text-2xl font-semibold text-primary md:text-3xl md:col-span-1">
                  {info.title}
                </h3>
              )}

              {/* Description with List */}
              {info.description && (
                <div className="prose prose-lg max-w-none text-gray-600 md:col-span-2">
                  <ReactMarkdown
                    components={{
                      ul: ({ children }) => (
                        <ul className="mt-6 grid list-none gap-4 md:grid-cols-2">{children}</ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="mt-6 grid list-none gap-4 md:grid-cols-2">{children}</ol>
                      ),
                      li: ({ children }) => (
                        <li className="flex items-start gap-3">
                          <ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-accent mt-0.5" />
                          <span className="text-gray-700">{children}</span>
                        </li>
                      ),
                      p: ({ children }) => <p className="text-gray-600">{children}</p>,
                      h1: ({ children }) => (
                        <h1 className="mb-4 text-3xl font-semibold text-primary md:text-4xl">
                          {children}
                        </h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="mb-4 text-2xl font-semibold text-primary md:text-3xl">
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="mb-3 text-xl font-semibold text-primary md:text-2xl">
                          {children}
                        </h3>
                      ),
                      h4: ({ children }) => (
                        <h4 className="mb-2 text-lg font-semibold text-primary md:text-xl">
                          {children}
                        </h4>
                      ),
                      strong: ({ children }) => (
                        <strong className="font-semibold text-primary">{children}</strong>
                      ),
                    }}
                  >
                    {info.description}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Closing - Red horizontal line with optional text */}
        {closing && (
          <div className="mt-12 md:mt-16">
            <div className="h-1 w-16 rounded-full bg-accent" />
            <div className="mt-6 prose prose-sm max-w-none text-gray-600">
              <ReactMarkdown>{closing}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
