"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

interface ScrollToHashProps {
  /**
   * Offset from the top of the viewport (in pixels)
   * Useful for fixed headers
   * @default 80
   */
  offset?: number;
  /**
   * Scroll behavior
   * @default "smooth"
   */
  behavior?: ScrollBehavior;
}

/**
 * Component that handles smooth scrolling to hash anchors.
 * Place this component in your layout to enable smooth scrolling
 * to sections when navigating to URLs with hash (e.g., /about#teams)
 */
export default function ScrollToHash({ 
  offset = 80, 
  behavior = "smooth" 
}: ScrollToHashProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Get the hash from the URL
    const hash = window.location.hash;
    
    if (hash) {
      // Remove the '#' from the hash
      const elementId = hash.slice(1);
      
      // Small delay to ensure the DOM is ready (especially for lazy-loaded components)
      const scrollToElement = () => {
        const element = document.getElementById(elementId);
        
        if (element) {
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - offset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: behavior,
          });
        }
      };

      // Try immediately
      scrollToElement();
      
      // Also try after a short delay for lazy-loaded content
      const timeoutId = setTimeout(scrollToElement, 100);
      
      // And another attempt for slower content
      const timeoutId2 = setTimeout(scrollToElement, 500);
      
      return () => {
        clearTimeout(timeoutId);
        clearTimeout(timeoutId2);
      };
    }
  }, [pathname, searchParams, offset, behavior]);

  // This component doesn't render anything
  return null;
}

/**
 * Utility function to scroll to a specific element by ID
 * Can be used programmatically from other components
 */
export function scrollToSection(
  elementId: string, 
  options: { offset?: number; behavior?: ScrollBehavior } = {}
) {
  const { offset = 80, behavior = "smooth" } = options;
  
  const element = document.getElementById(elementId);
  
  if (element) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY - offset;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: behavior,
    });
  }
}
