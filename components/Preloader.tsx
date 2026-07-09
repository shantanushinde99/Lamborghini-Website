"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, Environment, Float, Center } from "@react-three/drei";

import * as THREE from "three";

function Emblem3D() {
  const { scene } = useGLTF("https://ik.imagekit.io/shantanushinde99/Images/lamborghini_emblem.glb");
  const groupRef = useRef<THREE.Group>(null);

  // Simple rotation effect in the preloader
  useGSAP(() => {
    if (!groupRef.current) return;
    gsap.to(groupRef.current.rotation, {
      y: Math.PI * 2,
      duration: 8,
      ease: "none",
      repeat: -1,
    });
  }, []);

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={groupRef} position={[-0.8, 0, 0]}>
        <Center>
          <primitive object={scene} scale={45} position={[0, -0.2, 0]} />
        </Center>
      </group>
    </Float>
  );
}
// Preload the model only on the client side to avoid Next.js SSR crashes
if (typeof window !== "undefined") {
  useGLTF.preload("https://ik.imagekit.io/shantanushinde99/Images/lamborghini_emblem.glb");
}

const PREMIUM_EASE = [0.16, 1, 0.3, 1] as const;

export default function Preloader({
  isAssetReady,
  onComplete,
}: {
  isAssetReady: boolean;
  onComplete?: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const progressObj = useRef({ value: 0 });

  // Lock scroll while preloader is active
  useEffect(() => {
    document.body.style.overflow = "hidden";
    // Also disable touch scrolling on mobile
    const preventScroll = (e: TouchEvent) => e.preventDefault();
    document.addEventListener("touchmove", preventScroll, { passive: false });
    return () => {
      document.removeEventListener("touchmove", preventScroll);
    };
  }, []);

  // Sync animation progress with asset loading
  useEffect(() => {
    const target = isAssetReady ? 100 : 90;
    const duration = isAssetReady ? 0.8 : 3.0;

    const tween = gsap.to(progressObj.current, {
      value: target,
      duration: duration,
      ease: "power2.out",
      overwrite: "auto",
      onUpdate: () => {
        setProgress(Math.round(progressObj.current.value));
      },
      onComplete: () => {
        if (target === 100) {
          setIsReady(true);
        }
      },
    });

    return () => {
      tween.kill();
    };
  }, [isAssetReady]);

  const handleStart = () => {
    // Slide away
    gsap.to(containerRef.current, {
      yPercent: -100,
      duration: 1,
      ease: "power4.inOut",
      onComplete: () => {
        document.body.style.overflow = "auto";
        onComplete?.();
      },
    });
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-white"
    >
      {/* Scanlines */}
      <div className="absolute inset-0 scanlines pointer-events-none" />

      <div className="relative z-10 text-center flex flex-col items-center">
        {/* 3D Lamborghini Emblem */}
        <div className="w-[100vw] h-64 md:h-[400px] mb-2 relative" style={{ cursor: "none" }}>
          <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
            <ambientLight intensity={2.5} />
            <directionalLight position={[10, 10, 10]} intensity={3} />
            <Environment preset="city" />
            <Emblem3D />
          </Canvas>
        </div>

        <h1
          className="text-2xl md:text-4xl uppercase tracking-[0.5em] mb-1 font-bold mt-4"
          style={{ fontFamily: "var(--font-outfit)", color: "#111111" }}
        >
          Lamborghini
        </h1>
        <p
          className="text-xs tracking-[0.8em] uppercase mb-16"
          style={{
            fontFamily: "var(--font-rajdhani)",
            color: "#999999",
          }}
        >
          Revuelto
        </p>

        {/* Progress or Button */}
        <div className="h-16 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {!isReady ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center"
              >
                <div className="flex items-center gap-4">
                  <div className="w-40 h-[1.5px] bg-black/10 relative overflow-hidden">
                    <motion.div
                      className="absolute top-0 left-0 h-full"
                      style={{ backgroundColor: "var(--color-lambo-orange)" }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.1 }}
                    />
                  </div>
                  <span
                    className="text-base font-semibold tracking-[0.3em] w-12 text-right"
                    style={{ fontFamily: "var(--font-outfit)", color: "#111111" }}
                  >
                    {progress}%
                  </span>
                </div>
                <span
                  className="text-[9px] tracking-[0.5em] uppercase mt-3"
                  style={{
                    fontFamily: "var(--font-rajdhani)",
                    color: "#CCCCCC",
                  }}
                >
                  {progress < 20 && "BOOTING HYBRID SYSTEM..."}
                  {progress >= 20 && progress < 45 && "CALIBRATING V12 TIMING..."}
                  {progress >= 45 && progress < 70 && "SYNCING DUAL-CLUTCH..."}
                  {progress >= 70 && progress < 90 && "AERODYNAMICS ONLINE."}
                  {progress >= 90 && "SYSTEM READY."}
                </span>
              </motion.div>
            ) : (
              <motion.button
                key="start"
                initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.5, ease: PREMIUM_EASE }}
                onClick={handleStart}
                className="group relative px-10 py-4 overflow-hidden border border-black cursor-pointer"
                data-cursor="start"
              >
                <div
                  className="absolute inset-0 bg-black translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-out"
                />
                <span
                  className="relative z-10 text-xs tracking-[0.4em] uppercase font-bold text-black group-hover:text-white transition-colors duration-500"
                  style={{ fontFamily: "var(--font-outfit)" }}
                >
                  INITIALIZE TELEMETRY
                </span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
