"use client";

import { useState, useEffect, useRef } from "react";
import { type MotionValue, motion, AnimatePresence } from "framer-motion";
import { revueltoData } from "@/data/carData";
import { getPhaseProgress } from "@/lib/utils";

interface RevueltoExperienceProps {
  scrollYProgress: MotionValue<number>;
}

const PHASES = revueltoData.phases;

declare global {
  interface Window {
    __autoScrollActive?: boolean;
  }
}

const PREMIUM_EASE = [0.16, 1, 0.3, 1] as const;

const phaseEnter = {
  initial: { y: 30, opacity: 0, filter: "blur(8px)" },
  animate: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: PREMIUM_EASE, staggerChildren: 0.08 },
  },
  exit: {
    y: -20,
    opacity: 0,
    filter: "blur(4px)",
    transition: { duration: 0.4, ease: PREMIUM_EASE },
  },
};

const childVariant = {
  initial: { y: 20, opacity: 0, filter: "blur(6px)" },
  animate: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: PREMIUM_EASE },
  },
  exit: {
    y: -10,
    opacity: 0,
    filter: "blur(4px)",
    transition: { duration: 0.3, ease: PREMIUM_EASE },
  },
};

/**
 * 9-phase HUD overlay. Subscribes to scrollYProgress and determines
 * the active phase. Uses AnimatePresence mode="wait" for clean phase transitions.
 */
export default function RevueltoExperience({
  scrollYProgress,
}: RevueltoExperienceProps) {
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);
  const [scrollValue, setScrollValue] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);
  const exhaustAudioRef = useRef<HTMLAudioElement>(null);

  const activePhase = PHASES[activePhaseIndex];
  const localProgress = getPhaseProgress(scrollValue, activePhase.scrollRange);

  // Audio Sync Logic
  useEffect(() => {
    const audio = exhaustAudioRef.current;
    if (!audio) return;

    const isExhaustPhase = activePhaseIndex === 6;
    const isAutoScroll = window.__autoScrollActive;

    if (isExhaustPhase && isAutoScroll) {
      if (audio.paused) {
        if (!isNaN(audio.duration)) {
          audio.currentTime = localProgress * audio.duration;
        }
        audio.play().catch(() => { });
      }

      // Dynamic precise sync:
      if (!isNaN(audio.duration)) {
         const targetTime = localProgress * audio.duration;
         const diff = targetTime - audio.currentTime;

         // Smoothly adjust playback rate to stay locked on the exact visual frame.
         // Base rate is roughly 1.95 for the 360px/s scroll speed.
         const baseRate = 1.95; 
         let adjustedRate = baseRate + (diff * 2); 
         
         // Clamp to prevent audio from sounding broken
         adjustedRate = Math.max(0.5, Math.min(adjustedRate, 4.0));
         
         // If we somehow drift too far (e.g. tab unfocused), hard snap. Otherwise, dynamically speed up/slow down.
         if (Math.abs(diff) > 0.4) {
            audio.currentTime = targetTime;
         } else {
            audio.playbackRate = adjustedRate;
         }
      }
    } else {
      if (!audio.paused) {
        audio.pause();
      }
    }
  }, [activePhaseIndex, localProgress, scrollValue]);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      setScrollValue(latest);

      for (let i = PHASES.length - 1; i >= 0; i--) {
        const p = getPhaseProgress(latest, PHASES[i].scrollRange);
        if (p >= 0 && p <= 1.5) {
          if (i !== activePhaseIndex) {
            setActivePhaseIndex(i);

            // Trigger Glitch
            setIsGlitching(true);
            setTimeout(() => setIsGlitching(false), 400);
          }
          break;
        }
      }
    });
    return unsubscribe;
  }, [scrollYProgress, activePhaseIndex]);

  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      {/* Hidden Exhaust Audio Element */}
      <audio ref={exhaustAudioRef} src="https://ik.imagekit.io/shantanushinde99/images/images/Exhaust.mp3" preload="auto" />

      {/* Left side subtle background gradient for text contrast */}
      <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-[#FAFAFA]/90 via-[#FAFAFA]/40 to-transparent pointer-events-none -z-10" />

      {/* Top-left: Phase Label */}
      <div className="absolute top-24 left-8 md:left-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePhase.id + "-label"}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0, transition: { duration: 0.5, ease: PREMIUM_EASE } }}
            exit={{ opacity: 0, x: -10, transition: { duration: 0.3 } }}
            className="phase-label"
            style={{ fontFamily: "var(--font-outfit)", textShadow: "0 0 10px white" }}
          >
            {activePhase.label}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Main Content Panel — Bottom Left */}
      <div className="absolute bottom-16 md:bottom-20 left-8 md:left-12 max-w-lg">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePhase.id}
            variants={phaseEnter}
            initial="initial"
            animate="animate"
            exit="exit"
            className="corner-bracket p-4"
          >
            <motion.h1
              variants={childVariant}
              className={`text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-[0.95] ${isGlitching ? 'glitch' : ''}`}
              style={{ fontFamily: "var(--font-outfit)", color: "#CC0000" }}
              data-text={activePhase.title}
            >
              {activePhase.title}
            </motion.h1>

            <motion.h2
              variants={childVariant}
              className="text-lg md:text-xl tracking-[0.5em] uppercase mt-2"
              style={{
                fontFamily: "var(--font-outfit)",
                color: "var(--color-lambo-orange)",
              }}
            >
              {activePhase.subtitle}
            </motion.h2>

            <motion.p
              variants={childVariant}
              className="text-sm md:text-base mt-4 leading-relaxed max-w-md font-semibold"
              style={{ fontFamily: "var(--font-rajdhani)", color: "var(--color-foreground)" }}
            >
              {activePhase.description}
            </motion.p>

            <motion.div
              variants={childVariant}
              className="mt-4 text-[10px] md:text-xs tracking-[0.3em] uppercase font-semibold"
              style={{
                fontFamily: "var(--font-outfit)",
                color: "var(--color-lambo-orange)",
              }}
            >
              {activePhase.accent}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>



      {/* Bottom-right: Auto Scroll Control */}
      <div className="absolute bottom-8 right-8 md:right-12 pointer-events-auto">
        <button
          onClick={() => {
            if (window.__autoScrollActive) {
              window.__autoScrollActive = false;
            } else {
              window.__autoScrollActive = true;
              let lastTime = performance.now();
              const speedPxPerSec = 360; // Exact equivalent of 6px at 60FPS
              
              const scroll = (time: number) => {
                if (!window.__autoScrollActive) return;
                const dt = time - lastTime;
                lastTime = time;
                
                // Stop automatically if reached the bottom of the page
                if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 10) {
                  window.__autoScrollActive = false;
                  // Trigger re-render to update the button UI
                  setScrollValue((prev) => prev + 0.00001);
                  return;
                }

                // Prevent massive jumps if the tab becomes inactive
                if (dt < 100) {
                  window.scrollBy({ top: (speedPxPerSec * dt) / 1000 });
                }
                
                requestAnimationFrame(scroll);
              };
              requestAnimationFrame((time) => {
                lastTime = time;
                scroll(time);
              });
            }
            setScrollValue((prev) => prev + 0.00001);
          }}
          className="group flex items-center gap-3 cursor-pointer px-5 py-3 border-2 border-[var(--color-foreground)]/80 hover:border-[var(--color-foreground)] hover:bg-[var(--color-foreground)]/5 transition-all duration-300"
        >
          <div
            className={`w-5 h-5 flex items-center justify-center`}
          >
            {(typeof window !== "undefined" && window.__autoScrollActive) ? (
              <div className="w-3 h-3 bg-[#CC0000]" />
            ) : (
              <div
                className="w-0 h-0 ml-[2px]"
                style={{
                  borderLeft: "8px solid var(--color-foreground)",
                  borderTop: "5px solid transparent",
                  borderBottom: "5px solid transparent",
                }}
              />
            )}
          </div>
          <span
            className="text-xs tracking-[0.35em] uppercase font-black transition-colors duration-300"
            style={{
              fontFamily: "var(--font-outfit)",
              color: (typeof window !== "undefined" && window.__autoScrollActive)
                ? "#CC0000"
                : "var(--color-foreground)",
            }}
          >
            {(typeof window !== "undefined" && window.__autoScrollActive)
              ? "STOP"
              : "AUTO SCROLL"}
          </span>
        </button>
      </div>

      {/* Scroll Hint — Phase 1 only */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        animate={{
          opacity: scrollValue < 0.05 ? 1 : 0,
          y: scrollValue < 0.05 ? 0 : 20,
        }}
        transition={{ duration: 0.4, ease: PREMIUM_EASE }}
      >
        <div
          className="w-px h-8 origin-top"
          style={{
            backgroundColor: "var(--color-lambo-orange)",
            animation: "pulseDown 2s ease-in-out infinite",
          }}
        />
        <span
          className="text-[10px] tracking-[0.5em] uppercase"
          style={{
            fontFamily: "var(--font-outfit)",
            color: "var(--color-lambo-orange)",
          }}
        >
          SCROLL
        </span>
      </motion.div>
    </div>
  );
}
