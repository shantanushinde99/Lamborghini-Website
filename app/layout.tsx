import type { Metadata } from "next";
import { Outfit, Rajdhani, Syncopate } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const syncopate = Syncopate({
  variable: "--font-syncopate",
  weight: ["400", "700"],
  subsets: ["latin"],
});

import CustomCursor from "@/components/CustomCursor";

export const metadata: Metadata = {
  title: "Lamborghini Revuelto | Engineered Without Compromise",
  description: "A complete, production-ready, single-page luxury car showcase for the Lamborghini Revuelto.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${rajdhani.variable} ${syncopate.variable} antialiased`}
    >
      <body className="bg-[var(--color-background)] text-[var(--color-foreground)] min-h-screen flex flex-col font-outfit">
        <CustomCursor />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
