"use client";
import { useEffect, useRef } from "react";

/**
 * Custom hook to enable mouse drag scrolling on a container
 */
export function useDraggableScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      startXRef.current = e.pageX - element.offsetLeft;
      scrollLeftRef.current = element.scrollLeft;
      element.style.cursor = "grabbing";
      element.style.userSelect = "none";
    };

    const handleMouseLeave = () => {
      isDraggingRef.current = false;
      element.style.cursor = "grab";
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      element.style.cursor = "grab";
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      e.preventDefault();
      const x = e.pageX - element.offsetLeft;
      const walk = (x - startXRef.current) * 1.2; // Scroll speed multiplier
      element.scrollLeft = scrollLeftRef.current - walk;
    };

    element.style.cursor = "grab";

    element.addEventListener("mousedown", handleMouseDown);
    element.addEventListener("mouseleave", handleMouseLeave);
    element.addEventListener("mouseup", handleMouseUp);
    element.addEventListener("mousemove", handleMouseMove);

    return () => {
      element.removeEventListener("mousedown", handleMouseDown);
      element.removeEventListener("mouseleave", handleMouseLeave);
      element.removeEventListener("mouseup", handleMouseUp);
      element.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return ref;
}
