"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, type ReactNode } from "react";
import ParticleCanvas from "./ParticleCanvas";

const TERMINAL_LINES = [
  { text: "Initialising secure shell...", color: "text-gray-500" },
  { text: "Connection established.", color: "text-gray-400" },
  { text: "root@cyvant:~$  nmap -sV --script vuln 192.168.1.0/24", color: "text-yellow-400" },
  { text: "Starting Nmap scan...", color: "text-gray-500" },
  { text: "[+] Host 192.168.1.12 is UP", color: "text-emerald-400" },
  { text: "[!] CVE-2023-4966 detected — patching...", color: "text-red-400" },
  { text: "[✓] Patch applied successfully.", color: "text-emerald-400" },
];

function LaptopTerminalSlide() {
  const [visibleLines, setVisibleLines] = useState(1);

  useEffect(() => {
    if (visibleLines >= TERMINAL_LINES.length) return;
    const t = setTimeout(() => setVisibleLines((n) => n + 1), 700);
    return () => clearTimeout(t);
  }, [visibleLines]);

  return (
    <div className="absolute inset-0 flex items-end justify-center bg-[#080808] pb-6 px-4">
      {/* Laptop body */}
      <div className="w-full max-w-sm">
        {/* Screen */}
        <div className="rounded-t-xl border border-gray-700 bg-black overflow-hidden">
          {/* Menu bar */}
          <div className="flex items-center gap-1.5 bg-[#1a1a1a] px-3 py-2 border-b border-gray-800">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span className="ml-2 text-[10px] text-gray-500 font-mono">root@cyvant — bash</span>
          </div>
          {/* Terminal output */}
          <div className="font-mono text-[11px] leading-5 px-4 py-4 min-h-45 sm:min-h-50 space-y-0.5">
            {TERMINAL_LINES.slice(0, visibleLines).map((line, i) => (
              <p key={i} className={line.color}>{line.text}</p>
            ))}
            {/* Prompt with blinking cursor */}
            <p className="text-yellow-400 flex items-center gap-0.5">
              root@cyvant:~${" "}
              <span className="inline-block w-2 h-3.5 bg-yellow-400 animate-pulse ml-0.5" />
            </p>
          </div>
        </div>
        {/* Hinge */}
        <div className="h-1.5 bg-[#222] rounded-b-sm border-x border-b border-gray-700" />
        {/* Base */}
        <div className="h-3 bg-[#1c1c1c] rounded-b-xl border-x border-b border-gray-700 mx-2" />
      </div>
    </div>
  );
}

const TAGLINES = [
  ["Understand breach", "before blame"],
  ["See how systems", "actually fail"],
  ["Work from", "consequences backward"],
  ["Defend what exists,", "not what should exist"],
];

type Slide =
  | { id: string; src: string; alt: string; fallbackGradient: string; label: string; custom?: never }
  | { id: string; src?: never; alt: string; fallbackGradient: string; label: string; custom: ReactNode };

const SLIDES: Slide[] = [
  {
    id: "expert",
    src: "https://images.unsplash.com/photo-1709099317886-13dff6d5982d?w=900&q=80",
    alt: "African man at computer in the dark",
    fallbackGradient: "linear-gradient(135deg, #050d1a 0%, #0f2744 100%)",
    label: "BUILT FOR AFRICA.\nREADY FOR THE WORLD.",
  },
  {
    id: "ipad",
    src: "/images/hologram-hacker.jpg",
    alt: "Hologram hacker security visual",
    fallbackGradient: "linear-gradient(135deg, #07111f 0%, #0a1f3a 100%)",
    label: "DETECT.\nDEFEND. DOMINATE.",
  },
  {
    id: "terminal",
    alt: "Laptop terminal showing root@cyvant",
    fallbackGradient: "linear-gradient(135deg, #080808 0%, #111 100%)",
    label: "REAL LABS.\nREAL SKILLS.",
    custom: <LaptopTerminalSlide />,
  },
];

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

export default function HeroSection() {
  const [tagIdx, setTagIdx] = useState(0);
  const [imgIdx, setImgIdx] = useState(0);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const t = setInterval(() => setTagIdx((i) => (i + 1) % TAGLINES.length), 3500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setImgIdx((i) => (i + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  const slide = SLIDES[imgIdx];

  return (
    <section className="relative isolate overflow-hidden bg-slate-950 flex items-center px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:min-h-[90vh]">
      <ParticleCanvas />

      <div aria-hidden className="pointer-events-none absolute -top-40 left-1/3 -z-10 h-96 w-96 rounded-full bg-blue-700/20 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute bottom-0 right-1/4 -z-10 h-72 w-72 rounded-full bg-violet-700/15 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.7fr_1fr] gap-6 md:gap-10 lg:gap-16 items-center">

          {/* ── Left: cycling text ───────────────────────────────── */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease }}
              className="text-sm sm:text-base text-gray-400 mb-3 font-medium"
            >
              Join{" "}
              <span className="text-blue-400 font-bold tracking-wide">CYVANT</span>{" "}
              to
            </motion.p>

            {/* Fixed-height box prevents layout shift during tagline swap */}
            <div className="relative h-28 sm:h-32 md:h-36 lg:h-40 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.h1
                  key={tagIdx}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  transition={{ duration: 0.5, ease }}
                  className="absolute text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold leading-tight text-blue-400"
                >
                  {TAGLINES[tagIdx][0]}
                  <br />
                  {TAGLINES[tagIdx][1]}
                </motion.h1>
              </AnimatePresence>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease, delay: 0.2 }}
              className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-300 leading-7 max-w-md"
            >
              Practical technology training designed to take you from learning to building, demonstrating, and becoming industry-ready.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease, delay: 0.3 }}
              className="mt-6 sm:mt-8 flex flex-wrap gap-3 sm:gap-4"
            >
              <Link
                href="/courses"
                className="rounded-xl bg-blue-600 px-6 sm:px-7 py-3 sm:py-3.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-lg shadow-blue-900/40"
              >
                Kickstart Your Career
              </Link>
              <Link
                href="/contact"
                className="rounded-xl border border-white/20 px-6 sm:px-7 py-3 sm:py-3.5 text-sm font-medium text-white hover:bg-white/10 transition-colors"
              >
                Contact Us
              </Link>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-5 sm:mt-7 text-xs sm:text-sm text-gray-400 font-medium"
            >
              Programs starting from{" "}
              <span className="text-blue-400 font-semibold">₦100,000</span>
              {" "}· Learn Locally. Compete Globally.
            </motion.p>
          </div>

          {/* ── Right: cycling image panel ───────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.15 }}
            className="relative w-full"
          >
            <div className="relative h-56 sm:h-64 md:h-80 lg:h-104.5 rounded-2xl overflow-hidden border border-white/10">
              <div
                aria-hidden
                className="absolute inset-0"
                style={{ background: slide.fallbackGradient }}
              />

              <AnimatePresence mode="wait">
                <motion.div
                  key={slide.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7 }}
                  className="absolute inset-0"
                >
                  {slide.custom
                    ? slide.custom
                    : !imgErrors[slide.id] && slide.src && (
                        <Image
                          src={slide.src}
                          alt={slide.alt}
                          fill
                          className="object-cover"
                          priority={imgIdx === 0}
                          onError={() =>
                            setImgErrors((prev) => ({ ...prev, [slide.id]: true }))
                          }
                        />
                      )}
                </motion.div>
              </AnimatePresence>

              <div aria-hidden className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent z-10" />

              <div className="absolute bottom-0 inset-x-0 z-20 px-4 sm:px-6 py-4 sm:py-5">
                <p className="text-xs font-bold tracking-widest text-blue-300/70 whitespace-pre-line">
                  {slide.label}
                </p>
              </div>

              <div className="absolute top-4 right-4 z-20 h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
            </div>

            <div className="flex justify-center gap-2 mt-3 sm:mt-4">
              {SLIDES.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => setImgIdx(i)}
                  aria-label={`Slide ${i + 1}`}
                  className="h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width: imgIdx === i ? 24 : 6,
                    backgroundColor: imgIdx === i ? "#60a5fa" : "rgba(255,255,255,0.2)",
                  }}
                />
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
