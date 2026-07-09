"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (!cursorRef.current) return;

    // Use GSAP quickTo for zero-latency tracking
    const xTo = gsap.quickTo(cursorRef.current, "x", { duration: 0.15, ease: "power3" });
    const yTo = gsap.quickTo(cursorRef.current, "y", { duration: 0.15, ease: "power3" });

    const moveCursor = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check if hovering over interactive elements
      if (
        target.closest('[data-cursor]') || 
        target.tagName.toLowerCase() === 'a' || 
        target.tagName.toLowerCase() === 'button'
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="hidden md:flex fixed top-0 left-0 pointer-events-none z-[9999] items-center justify-center -translate-x-1/2 -translate-y-1/2"
    >
      <div
        className={`rounded-full transition-all duration-300 ease-out ${
          isHovering 
            ? "w-10 h-10 border border-[var(--color-lambo-orange)] bg-transparent" 
            : "w-3 h-3 bg-[var(--color-lambo-orange)]"
        }`}
      />
    </div>
  );
}
