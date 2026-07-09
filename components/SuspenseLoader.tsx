"use client";

import { motion } from "framer-motion";

export default function SuspenseLoader() {
  return (
    <div className="flex items-center justify-center w-full h-[60vh] bg-[var(--color-background)]">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="flex flex-col items-center gap-4"
      >
        <div className="w-12 h-12 border-t-2 border-[var(--color-lambo-orange)] border-r-2 border-transparent rounded-full animate-spin" />
        <span className="text-[10px] tracking-[0.4em] uppercase text-[var(--color-lambo-orange)] font-bold phase-label">
          Initializing
        </span>
      </motion.div>
    </div>
  );
}
