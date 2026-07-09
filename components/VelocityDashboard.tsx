"use client";

import { useRef, useState, useEffect } from "react";
import { type MotionValue } from "framer-motion";

interface VelocityDashboardProps {
  scrollYProgress: MotionValue<number>;
}

export default function VelocityDashboard({
  scrollYProgress,
}: VelocityDashboardProps) {
  const [rpm, setRpm] = useState(800);
  const [speed, setSpeed] = useState(0);
  const [gear, setGear] = useState("N");
  const [isRedline, setIsRedline] = useState(false);
  const lastValue = useRef(0);
  const lastTime = useRef(0);
  const smoothRpm = useRef(800);
  const smoothSpeed = useRef(0);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      const now = Date.now();
      if (lastTime.current === 0) lastTime.current = now;
      const dt = Math.max(now - lastTime.current, 1);
      const dv = Math.abs(latest - lastValue.current);

      const velocity = (dv / dt) * 100000;

      const targetRpm = Math.min(800 + velocity * 15, 9500);
      const targetSpeed = Math.min(velocity * 6, 350);

      smoothRpm.current += (targetRpm - smoothRpm.current) * 0.15;
      smoothSpeed.current += (targetSpeed - smoothSpeed.current) * 0.12;

      setRpm(Math.round(smoothRpm.current));
      setSpeed(Math.round(smoothSpeed.current));
      setIsRedline(smoothRpm.current > 7500);

      // Gear based on scroll section (9 phases = N, 1-8)
      const section = Math.floor(latest * 9);
      const gears = ["N", "1", "2", "3", "4", "5", "6", "7", "8"];
      setGear(gears[Math.min(section, 8)]);

      lastValue.current = latest;
      lastTime.current = now;
    });

    const decay = setInterval(() => {
      smoothRpm.current += (800 - smoothRpm.current) * 0.05;
      smoothSpeed.current += (0 - smoothSpeed.current) * 0.04;
      setRpm(Math.round(smoothRpm.current));
      setSpeed(Math.round(smoothSpeed.current));
      setIsRedline(smoothRpm.current > 7500);
    }, 50);

    return () => {
      unsubscribe();
      clearInterval(decay);
    };
  }, [scrollYProgress]);



  return (
    <div className="absolute right-8 md:right-12 top-1/2 -translate-y-1/2 z-30 pointer-events-none hidden md:flex flex-col items-center gap-5">
      
      <div className="flex flex-col items-center gap-1">
        <div
          className="text-[8px] tracking-[0.5em] uppercase"
          style={{ fontFamily: "var(--font-rajdhani)", color: "var(--color-foreground)" }}
        >
          RPM
        </div>
        <div
          className={`text-sm font-bold tracking-wider tabular-nums transition-colors duration-150 ${
            isRedline ? "text-[var(--color-lambo-orange)]" : "text-[var(--color-foreground)]"
          }`}
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          {rpm.toLocaleString()}
        </div>
      </div>

      {/* Gear */}
      <div className="flex flex-col items-center">
        <div
          className="text-[8px] tracking-[0.5em] uppercase"
          style={{ fontFamily: "var(--font-rajdhani)", color: "var(--color-foreground)" }}
        >
          GEAR
        </div>
        <div
          className="text-2xl font-black"
          style={{
            fontFamily: "var(--font-outfit)",
            color: isRedline ? "var(--color-lambo-orange)" : "var(--color-foreground)",
          }}
        >
          {gear}
        </div>
      </div>

      {/* Speed */}
      <div className="flex flex-col items-center">
        <div
          className="text-[8px] tracking-[0.5em] uppercase"
          style={{ fontFamily: "var(--font-rajdhani)", color: "var(--color-foreground)" }}
        >
          KM/H
        </div>
        <div
          className={`text-2xl font-black tabular-nums transition-colors duration-150 ${
            isRedline ? "text-[var(--color-lambo-orange)]" : "text-[var(--color-foreground)]"
          }`}
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          {speed}
        </div>
      </div>
    </div>
  );
}
