"use client";

import { useRef, useEffect } from "react";
import { motion, useInView, useMotionTemplate, useMotionValue } from "framer-motion";
import { revueltoData } from "@/data/carData";
import gsap from "gsap";

const PREMIUM_EASE = [0.16, 1, 0.3, 1] as const;

function AnimatedNumber({ value }: { value: string }) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(nodeRef, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView || !nodeRef.current) return;

    // Parse numeric value, ignoring commas and symbols like >
    const rawNum = value.replace(/[^0-9.]/g, "");
    if (!rawNum) return; // if it's text like "V12 NA", don't animate

    const num = parseFloat(rawNum);
    const hasDecimal = value.includes(".");
    const hasComma = value.includes(",");
    const prefix = value.includes(">") ? ">" : "";

    gsap.fromTo(
      nodeRef.current,
      { innerHTML: 0 },
      {
        innerHTML: num,
        duration: 2,
        ease: "power3.out",
        snap: { innerHTML: hasDecimal ? 0.1 : 1 },
        onUpdate: function () {
          if (!nodeRef.current) return;
          const currentVal = Number(this.targets()[0].innerHTML);
          let displayStr = hasDecimal ? currentVal.toFixed(1) : Math.round(currentVal).toString();

          if (hasComma) {
            // Add comma as thousands separator
            displayStr = displayStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          }

          nodeRef.current.innerHTML = prefix + displayStr;
        },
      }
    );
  }, [isInView, value]);

  return (
    <div
      ref={nodeRef}
      className="text-2xl md:text-3xl font-bold transition-colors duration-300 group-hover:text-[var(--color-lambo-orange)]"
      style={{ fontFamily: "var(--font-outfit)", color: "var(--color-foreground)" }}
    >
      {value}
    </div>
  );
}

export default function SpecsGrid() {
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  // Mouse tracking for spotlight effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <section
      id="specs"
      ref={containerRef}
      className="relative w-full bg-[var(--color-background)] py-24 md:py-32 px-8 md:px-16"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: PREMIUM_EASE }}
            className="text-[10px] tracking-[0.5em] uppercase mb-4"
            style={{
              fontFamily: "var(--font-outfit)",
              color: "var(--color-lambo-orange)",
            }}
          >
            Technical Data
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: PREMIUM_EASE, delay: 0.1 }}
            className="text-3xl md:text-5xl font-black uppercase tracking-tight"
            style={{ fontFamily: "var(--font-outfit)", color: "var(--color-foreground)" }}
          >
            SPECIFICATIONS
          </motion.h2>
        </div>

        {/* Grid with Spotlight */}
        <div
          className="relative group/grid"
          onMouseMove={handleMouseMove}
        >
          {/* Spotlight background mask */}
          <motion.div
            className="absolute -inset-px bg-gradient-to-r from-[var(--color-lambo-orange)] to-[var(--color-lambo-orange)] opacity-0 group-hover/grid:opacity-100 transition duration-300 rounded-sm pointer-events-none"
            style={{
              background: useMotionTemplate`
                radial-gradient(
                  400px circle at ${mouseX}px ${mouseY}px,
                  rgba(227, 82, 5, 0.15),
                  transparent 80%
                )
              `,
            }}
          />

          <div className="relative grid grid-cols-2 md:grid-cols-4 gap-px bg-black/10 border border-[var(--color-foreground)]/10">
            {revueltoData.specs.map((spec, idx) => (
              <motion.div
                key={spec.label}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.6,
                  ease: PREMIUM_EASE,
                  delay: idx * 0.08,
                }}
                className="bg-[var(--color-background)] p-6 md:p-8 group hover:bg-[var(--color-foreground)]/5 transition-colors duration-300 cursor-default relative z-10"
              >
                <div
                  className="text-[10px] tracking-[0.4em] uppercase mb-3 transition-colors duration-300 group-hover:text-[var(--color-lambo-orange)]"
                  style={{
                    fontFamily: "var(--font-rajdhani)",
                    color: "#999999",
                  }}
                >
                  {spec.label}
                </div>

                {/* Animated GSAP Counter */}
                <AnimatedNumber value={spec.value} />

                <div
                  className="text-xs tracking-[0.3em] uppercase mt-1"
                  style={{
                    fontFamily: "var(--font-rajdhani)",
                    color: "#999999",
                  }}
                >
                  {spec.unit}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
