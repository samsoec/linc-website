"use client";

import { useEffect, useRef, ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  /**
   * Animation type
   * @default "fade-up"
   */
  animation?: "fade-up" | "fade-down" | "fade-left" | "fade-right" | "fade" | "zoom-in" | "zoom-out";
  /**
   * Animation duration in milliseconds
   * @default 600
   */
  duration?: number;
  /**
   * Delay before animation starts in milliseconds
   * @default 0
   */
  delay?: number;
  /**
   * Threshold for intersection observer (0-1)
   * @default 0.1
   */
  threshold?: number;
  /**
   * Root margin for intersection observer
   * @default "0px 0px -100px 0px"
   */
  rootMargin?: string;
  /**
   * Whether to animate only once
   * @default true
   */
  once?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Component that reveals its children with animation when scrolling into view
 * Uses Intersection Observer API for performance
 */
export default function ScrollReveal({
  children,
  animation = "fade-up",
  duration = 600,
  delay = 0,
  threshold = 0.1,
  rootMargin = "0px 0px -50px 0px",
  once = true,
  className = "",
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Create intersection observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add visible class when element enters viewport
            element.classList.add("scroll-reveal-visible");
            
            // If once is true, stop observing after first reveal
            if (once) {
              observer.unobserve(element);
            }
          } else if (!once) {
            // Remove visible class when element leaves viewport (only if once is false)
            element.classList.remove("scroll-reveal-visible");
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    // Start observing
    observer.observe(element);

    // Cleanup
    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [threshold, rootMargin, once]);

  // Build animation styles
  const animationStyles = {
    "--scroll-reveal-duration": `${duration}ms`,
    "--scroll-reveal-delay": `${delay}ms`,
  } as React.CSSProperties;

  return (
    <div
      ref={ref}
      className={`scroll-reveal scroll-reveal-${animation} ${className}`}
      style={animationStyles}
    >
      {children}
    </div>
  );
}
