"use client";

import { useRef, useEffect, useCallback } from "react";
import { type MotionValue, useMotionValueEvent } from "framer-motion";
import { revueltoData } from "@/data/carData";
import { getPhaseProgress } from "@/lib/utils";

interface RevueltoScrollCanvasProps {
  scrollYProgress: MotionValue<number>;
  onReady?: () => void;
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
  onReady,
}: RevueltoScrollCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const allImagesRef = useRef<Map<string, HTMLImageElement[]>>(new Map());
  const lastFrameKeyRef = useRef<string>("");
  const loadedRef = useRef(false);

  // Initialize the image arrays on the client side inside useEffect to avoid SSR ReferenceError on "Image"
  useEffect(() => {
    if (allImagesRef.current.size === 0) {
      PHASES.forEach((phase) => {
        const images: HTMLImageElement[] = [];
        for (let i = 0; i < FRAME_COUNT; i++) {
          images.push(new Image());
        }
        allImagesRef.current.set(phase.folder, images);
      });
    }
  }, []);

  const getFramePath = useCallback(
    (folder: string, index: number) => {
      const padded = String(index).padStart(6, "0");
      return `https://ik.imagekit.io/shantanushinde99/images/images/${folder}/frame_${padded}.webp?updatedAt=1783524769050`;
    },[]
  );

  const loadFrameRange = useCallback((folder: string, start: number, end: number, stride: number = 1): Promise<void> => {
    const images = allImagesRef.current.get(folder);
    if (!images) return Promise.resolve();

    const promises = [];
    for (let i = start; i <= end; i += stride) {
      const img = images[i];
      if (!img.src) {
        promises.push(
          new Promise<void>((resolve) => {
            img.onload = () => resolve();
            img.onerror = () => resolve(); // prevent blocking on error
            img.src = getFramePath(folder, i);
          })
        );
      }
    }
    return Promise.all(promises).then(() => {});
  }, [getFramePath]);

  const drawFrame = useCallback((folder: string, frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const key = `${folder}-${frameIndex}`;
    if (key === lastFrameKeyRef.current) return; // Perf guard
    lastFrameKeyRef.current = key;

    const images = allImagesRef.current.get(folder);
    if (!images) return;

    let targetImg = images[frameIndex];

    // CLOSEST FRAME FALLBACK: If current frame isn't loaded, find the closest loaded frame
    if (!targetImg || !targetImg.complete || targetImg.naturalWidth === 0) {
      let fallback = null;
      // Search backwards first (most recent frame seen)
      for (let i = frameIndex - 1; i >= 0; i--) {
        if (images[i] && images[i].complete && images[i].naturalWidth !== 0) {
          fallback = images[i];
          break;
        }
      }
      // If none found backwards, search forwards
      if (!fallback) {
        for (let i = frameIndex + 1; i < FRAME_COUNT; i++) {
           if (images[i] && images[i].complete && images[i].naturalWidth !== 0) {
             fallback = images[i];
             break;
           }
        }
      }
      
      // If absolutely NO frames are loaded for this folder, don't wipe the canvas, just return
      if (!fallback) return; 
      targetImg = fallback;
    }

    const dpr = window.devicePixelRatio || 1;
    const cssWidth = canvas.width / dpr;
    const cssHeight = canvas.height / dpr;

    // White studio background
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, cssWidth, cssHeight);

    // Cover-fit the image
    const imgAspect = targetImg.naturalWidth / targetImg.naturalHeight;
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

    ctx.drawImage(targetImg, drawX, drawY, drawWidth, drawHeight);
  }, []);

  // Progressive preloading of image assets
  useEffect(() => {
    let active = true;

    async function runPreload() {
      // 1. Load critical first 30 frames of the first phase to get visual feedback ASAP
      await loadFrameRange(PHASES[0].folder, 0, 29);
      if (!active) return;
      
      // Draw first frame immediately
      drawFrame(PHASES[0].folder, 0);
      loadedRef.current = true;
      onReady?.();

      // 2. STRIDED PRELOAD: Load every 10th frame of all phases to create a low-fps fallback across the entire experience
      for (let p = 0; p < PHASES.length; p++) {
        await loadFrameRange(PHASES[p].folder, 0, FRAME_COUNT - 1, 10);
        if (!active) return;
      }

      // 3. Load all remaining frames sequentially to upgrade to 60fps
      for (let p = 0; p < PHASES.length; p++) {
        await loadFrameRange(PHASES[p].folder, 0, FRAME_COUNT - 1, 1);
        if (!active) return;
      }
    }

    runPreload();

    return () => {
      active = false;
    };
  }, [loadFrameRange, drawFrame, onReady]);

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
