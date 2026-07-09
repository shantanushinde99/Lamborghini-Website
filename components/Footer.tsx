"use client";

import { revueltoData } from "@/data/carData";

export default function Footer() {
  return (
    <footer className="relative w-full bg-white py-16 px-8 md:px-16">
      {/* Top orange gradient divider */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--color-lambo-orange), transparent)",
        }}
      />

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        {/* Left */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <img
              src="https://ik.imagekit.io/shantanushinde99/Images/Lambo%20Logo-Photoroom.png"
              alt="Lamborghini"
              className="w-8 h-8 object-contain"
            />
            <span
              className="text-sm tracking-[0.35em] uppercase font-bold"
              style={{ fontFamily: "var(--font-outfit)", color: "#111111" }}
            >
              {revueltoData.brand}
            </span>
          </div>
          <p
            className="text-xs tracking-[0.2em] uppercase"
            style={{ fontFamily: "var(--font-rajdhani)", color: "#999999" }}
          >
            AUTOMOBILI LAMBORGHINI S.P.A. — {revueltoData.origin}
          </p>
          <p
            className="text-xs tracking-[0.15em] mt-1"
            style={{ fontFamily: "var(--font-rajdhani)", color: "#CCCCCC" }}
          >
            {revueltoData.tagline}
          </p>
        </div>

        {/* Right */}
        <div className="flex flex-col items-start md:items-end gap-3">
          <a
            href="#story"
            className="px-6 py-3 text-white text-xs tracking-[0.3em] uppercase font-bold transition-all duration-300 hover:brightness-110"
            style={{
              fontFamily: "var(--font-outfit)",
              backgroundColor: "var(--color-lambo-orange)",
            }}
          >
            Configure Your Revuelto
          </a>
        </div>
      </div>

      {/* Bottom */}
      <div className="max-w-6xl mx-auto mt-12 pt-6 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <p
          className="text-[10px] tracking-[0.2em] uppercase"
          style={{ fontFamily: "var(--font-rajdhani)", color: "#CCCCCC" }}
        >
          Portfolio Project — Not an official Lamborghini website
        </p>
        <p
          className="text-[10px] tracking-[0.2em] uppercase"
          style={{ fontFamily: "var(--font-rajdhani)", color: "#CCCCCC" }}
        >
          Next.js · Tailwind v4 · GSAP · Framer Motion · Lenis
        </p>
      </div>
    </footer>
  );
}
