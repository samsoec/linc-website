"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import type { FaqSection } from "@/types/generated";
import { PlusIcon, MinusIcon } from "@heroicons/react/24/outline";

interface FaqProps {
  data: FaqSection;
}

export default function Faq({ data }: FaqProps) {
  const [openIndex, setOpenIndex] = useState<number>(0);

  const { heading, subheading, items } = data;

  if (!items || items.length === 0) {
    return null;
  }

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center md:mb-12">
          {subheading && (
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.4em] text-accent">
              {subheading}
            </p>
          )}
          {heading && (
            <h2 className="mb-4 text-3xl font-semibold text-gray-900 md:text-4xl lg:text-5xl">
              {heading}
            </h2>
          )}

          {/* Accent Line */}
          <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-accent" />
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={item.id || index} className="overflow-hidden border-b border-gray-200">
              {/* Question Button */}
              <button
                onClick={() => toggleItem(index)}
                className="flex w-full items-start justify-between gap-4 py-6 text-left transition-colors hover:text-accent"
              >
                <h3 className="text-lg font-semibold text-gray-900 md:text-xl">{item.question}</h3>
                <span className="flex-shrink-0 text-gray-600 transition-transform duration-300">
                  {openIndex === index ? (
                    <MinusIcon className="h-6 w-6" />
                  ) : (
                    <PlusIcon className="h-6 w-6" />
                  )}
                </span>
              </button>

              {/* Answer Content */}
              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  openIndex === index ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="pb-6">
                    <div className="prose prose-sm max-w-none text-gray-600 md:prose-base prose-ul:ml-0 prose-ul:list-disc prose-ul:pl-5 prose-li:marker:text-gray-600">
                      <ReactMarkdown
                        components={{
                          ul: ({ children }) => (
                            <ul className="list-disc space-y-2 pl-5">{children}</ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="list-decimal space-y-2 pl-5">{children}</ol>
                          ),
                          li: ({ children }) => <li className="text-gray-600">{children}</li>,
                          p: ({ children }) => <p className="mb-4">{children}</p>,
                        }}
                      >
                        {item.answer}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
