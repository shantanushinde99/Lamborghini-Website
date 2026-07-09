"use client";

import { useRef, Suspense, lazy, useState } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

import Preloader from "@/components/Preloader";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SuspenseLoader from "@/components/SuspenseLoader";

import RevueltoScrollCanvas from "@/components/RevueltoScrollCanvas";
import RevueltoExperience from "@/components/RevueltoExperience";

const SpecsGrid = lazy(() => import("@/components/SpecsGrid"));
const VelocityDashboard = lazy(() => import("@/components/VelocityDashboard"));

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasReady, setCanvasReady] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const letterboxHeight = useTransform(
    scrollYProgress,
    [0, 0.2, 0.4, 0.6, 0.9, 1],
    ["0vh", "0vh", "12vh", "12vh", "0vh", "0vh"]
  );

  const gridBackgroundY = useTransform(scrollYProgress, [0, 1], ["0px", "4000px"]);

  return (
    <main className="relative w-full bg-[var(--color-background)] text-[var(--color-foreground)]">
      <Preloader isAssetReady={canvasReady} />
      <Navbar />

      <div ref={containerRef} className="relative" style={{ height: "2700vh" }}>
        <div className="sticky top-0 left-0 w-full h-screen overflow-hidden floor-grid-container bg-[var(--color-background)]">
          
          <motion.div 
            className="absolute bottom-0 left-0 w-full h-[60vh] floor-grid opacity-30"
            style={{ backgroundPositionY: gridBackgroundY }}
          />

          <RevueltoScrollCanvas scrollYProgress={scrollYProgress} onReady={() => setCanvasReady(true)} />

          {/* Large Lambo Logo (Top Right below Navbar) */}
          <div className="absolute top-8 right-8 md:right-12 z-40 pointer-events-none">
            <img
              src="https://ik.imagekit.io/shantanushinde99/images/images/Lambo%20Logo-Photoroom.png"
              alt="Lamborghini Logo"
              className="w-48 h-48 object-contain opacity-100"
            />
          </div>

          <RevueltoExperience scrollYProgress={scrollYProgress} />

          <Suspense fallback={<SuspenseLoader />}>
            <VelocityDashboard scrollYProgress={scrollYProgress} />
          </Suspense>

          <div className="absolute inset-0 scanlines pointer-events-none z-[5]" />

          <motion.div
            className="absolute top-0 left-0 w-full bg-[#050505] z-20 pointer-events-none"
            style={{ height: letterboxHeight }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-full bg-[#050505] z-20 pointer-events-none"
            style={{ height: letterboxHeight }}
          />
        </div>
      </div>

      <Suspense fallback={<SuspenseLoader />}>
        <SpecsGrid />
      </Suspense>
      <Footer />
    </main>
  );
}
