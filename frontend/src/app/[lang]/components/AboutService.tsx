"use client";

import ReactMarkdown from "react-markdown";
import type { AboutServiceSection } from "@/types/generated";
import type { Components } from "react-markdown";
import React from "react";

interface AboutServiceProps {
  data: AboutServiceSection;
}

/**
 * Parses list items using Option A format:
 * - **Title** - Description text
 * - **Title Only** (no dash/description)
 *
 * Renders as a card grid with title and optional description.
 */
export default function AboutService({ data }: AboutServiceProps) {
  const { heading, subheading, content } = data;

  if (!content) {
    return null;
  }

  // Custom components for ReactMarkdown to transform ul/li into card grid
  const components: Components = {
    // Transform <ul> into a flexbox grid with automatic centering at all breakpoints
    ul: ({ children }) => {
      const sanitizedChildren = React.Children.toArray(children).filter((child) => {
        return React.isValidElement(child);
      });

      // Using flexbox with justify-center automatically centers incomplete rows at all breakpoints
      return (
        <div className="my-8 flex flex-wrap justify-center gap-6">
          {sanitizedChildren.map((child, index) => (
            <div key={index} className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
              {child}
            </div>
          ))}
        </div>
      );
    },
    // Transform <li> into a card, parsing Option A format
    li: ({ children }) => {
      const childArray = React.Children.toArray(children);

      let title: React.ReactNode = null;
      let description: React.ReactNode = null;

      // Find the <strong> element for title and collect remaining content as description
      const descriptionParts: React.ReactNode[] = [];
      let foundTitle = false;

      childArray.forEach((child) => {
        // Check if this is a <strong> element (ReactMarkdown uses the actual HTML element)
        const isStrong =
          React.isValidElement(child) &&
          (child.type === "strong" ||
            (typeof child.type === "function" && child.type.name === "strong"));

        if (isStrong && !foundTitle) {
          // This is the title (React has already parsed the **text** into <strong>)
          title = (child as React.ReactElement<{ children: React.ReactNode }>).props.children;
          foundTitle = true;
        } else if (foundTitle) {
          // After finding title, collect everything as description
          if (typeof child === "string") {
            const trimmed = child.trim();
            // Check if there's a dash separator and remove it
            if (trimmed.startsWith("-") || trimmed.startsWith("–") || trimmed.startsWith("—")) {
              const afterDash = trimmed.replace(/^[-–—]\s*/, "");
              if (afterDash) {
                descriptionParts.push(afterDash);
              }
            } else if (trimmed) {
              descriptionParts.push(child);
            }
          } else {
            descriptionParts.push(child);
          }
        } else if (!foundTitle) {
          // No strong tag found, this might be title-only content
          descriptionParts.push(child);
        }
      });

      // If we found a title with description parts, use them
      if (foundTitle && descriptionParts.length > 0) {
        description = descriptionParts;
      }

      // If no strong tag found, treat entire content as title
      if (!title) {
        title = children;
      }

      return (
        <div className="group rounded-lg border border-gray-100 bg-white p-6">
          {title && (
            <h3
              className={`text-lg font-semibold text-primary transition-colors group-hover:text-accent ${description ? "" : "text-center"}`}
            >
              {title}
            </h3>
          )}
          {description && <p className="mt-2 text-gray-600">{description}</p>}
        </div>
      );
    },
    // Regular paragraph styling
    p: ({ children }) => <p className="mb-4 text-gray-600 leading-relaxed">{children}</p>,
    // Strong text (outside of list items)
    strong: ({ children }) => <strong className="font-semibold text-primary">{children}</strong>,
  };

  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-8">
          {subheading && (
            <p className="mb-3 text-sm uppercase tracking-[0.4em] text-accent">{subheading}</p>
          )}
          {heading && (
            <>
              <h2 className="text-3xl font-semibold leading-tight text-primary md:text-4xl lg:text-5xl">
                {heading}
              </h2>
              <div className="mt-6 h-1 w-16 rounded-full bg-accent" />
            </>
          )}
        </div>

        {/* Content with custom markdown rendering */}
        <div className="prose prose-lg max-w-none">
          <ReactMarkdown components={components}>{content}</ReactMarkdown>
        </div>
      </div>
    </section>
  );
}
