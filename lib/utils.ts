import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Clamp a value between min and max */
export function clampValue(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Given a global scroll progress (0–1) and a phase's [start, end] range,
 * returns the local progress within that phase (0–1).
 * Returns -1 if scroll is before the phase, 2 if after.
 */
export function getPhaseProgress(
  scrollProgress: number,
  range: [number, number]
): number {
  const [start, end] = range;
  if (scrollProgress < start) return -1;
  if (scrollProgress > end) return 2;
  return (scrollProgress - start) / (end - start);
}
