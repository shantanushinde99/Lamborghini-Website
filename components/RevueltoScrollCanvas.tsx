"use client";

import { useRef, useEffect, useCallback } from "react";
import { type MotionValue, useMotionValueEvent } from "framer-motion";
import { revueltoData } from "@/data/carData";
import { getPhaseProgress } from "@/lib/utils";

interface RevueltoScrollCanvasProps {
  scrollYProgress: MotionValue<number>;
}

const FRAME_COUNT = 240;
const PHASES = revueltoData.phases;

/**
 * High-DPI canvas that scrubs through image sequences based on scroll.
 * Preloads ALL frames from ALL phase folders into memory.
 * Only redraws when the frameIndex actually changes (perf guard).
 * White background fill before drawing each frame (white studio aesthetic).
 */
export default function RevueltoScrollCanvas({
  scrollYProgress,
}: RevueltoScrollCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const allImagesRef = useRef<Map<string, HTMLImageElement[]>>(new Map());
  const lastFrameKeyRef = useRef<string>("");
  const loadedRef = useRef(false);

  const drawFrame = useCallback((folder: string, frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const key = `${folder}-${frameIndex}`;
    if (key === lastFrameKeyRef.current) return; // Perf guard
    lastFrameKeyRef.current = key;

    const dpr = window.devicePixelRatio || 1;
    const cssWidth = canvas.width / dpr;
    const cssHeight = canvas.height / dpr;

    // White studio background
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, cssWidth, cssHeight);

    const images = allImagesRef.current.get(folder);
    if (!images) return;

    const img = images[frameIndex];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    // Cover-fit the image
    const imgAspect = img.naturalWidth / img.naturalHeight;
    const canvasAspect = cssWidth / cssHeight;

    let drawWidth: number, drawHeight: number, drawX: number, drawY: number;

    if (imgAspect > canvasAspect) {
      drawHeight = cssHeight;
      drawWidth = cssHeight * imgAspect;
      drawX = (cssWidth - drawWidth) / 2;
      drawY = 0;
    } else {
      drawWidth = cssWidth;
      drawHeight = cssWidth / imgAspect;
      drawX = 0;
      drawY = (cssHeight - drawHeight) / 2;
    }

    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
  }, []);

  const getFramePath = useCallback(
    (folder: string, index: number) => {
      const padded = String(index).padStart(6, "0");
      return `https://ik.imagekit.io/shantanushinde99/images/images/${folder}/frame_${padded}.webp?updatedAt=1783524769050`;
    },[]
  );

  // Preload all frames for all phases
  useEffect(() => {
    const imageMap = new Map<string, HTMLImageElement[]>();

    PHASES.forEach((phase) => {
      const images: HTMLImageElement[] = [];
      for (let i = 0; i < FRAME_COUNT; i++) {
        const img = new Image();
        img.src = getFramePath(phase.folder, i);
        images.push(img);
      }
      imageMap.set(phase.folder, images);
    });

    allImagesRef.current = imageMap;
    loadedRef.current = true;

    // Draw first frame once loaded
    const firstPhaseImages = imageMap.get(PHASES[0].folder);
    if (firstPhaseImages && firstPhaseImages[0]) {
      firstPhaseImages[0].onload = () => {
        drawFrame(PHASES[0].folder, 0);
      };
    }
  }, [getFramePath, drawFrame]);

  // High-DPI canvas setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);



  // Subscribe to scroll progress
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (!loadedRef.current) return;

    // Determine which phase we're in and the local progress
    let activeFolder = PHASES[0].folder;
    let localProgress = 0;

    for (const phase of PHASES) {
      const p = getPhaseProgress(latest, phase.scrollRange);
      if (p >= 0 && p <= 1) {
        activeFolder = phase.folder;
        localProgress = p;
        break;
      } else if (p > 1) {
        // Past this phase — show last frame
        activeFolder = phase.folder;
        localProgress = 1;
      }
    }

    const frameIndex = Math.min(
      Math.floor(localProgress * (FRAME_COUNT - 1)),
      FRAME_COUNT - 1
    );

    drawFrame(activeFolder, frameIndex);
  });

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full"
      style={{ width: "100%", height: "100%" }}
    />
  );
}
