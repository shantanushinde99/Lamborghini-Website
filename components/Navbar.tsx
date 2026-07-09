"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { revueltoData } from "@/data/carData";

const PREMIUM_EASE = [0.16, 1, 0.3, 1] as const;

function MagneticLink({ label }: { label: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Spring physics — gives that rubbery, physical pull-back feel
  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Pull strength (how far the element stretches toward cursor)
    const pullX = (e.clientX - centerX) * 0.35;
    const pullY = (e.clientY - centerY) * 0.35;

    x.set(pullX);
    y.set(pullY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const l = label.toLowerCase();
    if (l === "story") {
      // Scroll to Phase 3 (Form) ~ halfway through the 3D scrub
      window.scrollTo({ top: window.innerHeight * 5, behavior: "smooth" });
    } else if (l === "features") {
      // Scroll to Phase 8 (Features) ~ near the end of 3D scrub
      window.scrollTo({ top: window.innerHeight * 20, behavior: "smooth" });
    } else if (l === "specs") {
      document.getElementById("specs")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.a
      ref={ref}
      href={`#${label.toLowerCase()}`}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className="text-[11px] tracking-[0.3em] uppercase font-bold transition-colors duration-300 hover:text-[var(--color-lambo-orange)] inline-block cursor-pointer"
      data-cursor="nav"
    >
      <span style={{ fontFamily: "var(--font-outfit)", color: "inherit" }}>
        {label}
      </span>
    </motion.a>
  );
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setIsScrolled(y > 60);

      if (y > 200) {
        setIsHidden(y > lastScrollY.current);
      } else {
        setIsHidden(false);
      }

      lastScrollY.current = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{
        y: isHidden ? -100 : 0,
      }}
      transition={{ duration: 0.5, ease: PREMIUM_EASE }}
      className={`fixed top-0 left-0 w-full z-50 py-4 px-6 md:px-10 transition-all duration-300 ${isScrolled ? "glass-panel" : "bg-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img
            src="/images/Lambo Logo-Photoroom.png"
            alt="Lamborghini"
            className="w-7 h-7 object-contain"
          />
          <span
            className="text-sm tracking-[0.35em] uppercase font-bold"
            style={{
              fontFamily: "var(--font-outfit)",
              color: "var(--color-foreground)",
            }}
          >
            Lamborghini
          </span>
        </div>

        {/* Desktop Nav — Magnetic Links */}
        <nav className="hidden md:flex gap-8">
          {revueltoData.navLinks.map((label) => (
            <MagneticLink key={label} label={label} />
          ))}
        </nav>

        {/* Model Badge */}
        <div className="hidden md:block">
          <span
            className="text-[10px] tracking-[0.4em] uppercase"
            style={{
              fontFamily: "var(--font-outfit)",
              color: "var(--color-lambo-orange)",
            }}
          >
            {revueltoData.model} — {revueltoData.edition}
          </span>
        </div>
      </div>
    </motion.header>
  );
}
