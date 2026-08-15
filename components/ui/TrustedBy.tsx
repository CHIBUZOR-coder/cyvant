"use client";

import { motion } from "framer-motion";

const LOGOS = [
  { name: "Access Bank", abbr: "AB" },
  { name: "GTBank", abbr: "GT" },
  { name: "Flutterwave", abbr: "FW" },
  { name: "Andela", abbr: "AN" },
  { name: "Interswitch", abbr: "IS" },
  { name: "Sterling Bank", abbr: "SB" },
  { name: "TechAdvance", abbr: "TA" },
  { name: "Paystack", abbr: "PS" },
  { name: "Konga", abbr: "KG" },
  { name: "Carbon", abbr: "CB" },
];

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

function LogoItem({ name, abbr }: { name: string; abbr: string }) {
  return (
    <div className="flex shrink-0 items-center gap-3 rounded-xl border border-white/8 bg-white/4 px-5 py-3 mx-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-900/50 text-xs font-bold text-blue-300">
        {abbr}
      </div>
      <span className="text-sm font-medium text-gray-400 whitespace-nowrap">{name}</span>
    </div>
  );
}

export default function TrustedBy() {
  return (
    <section className="bg-slate-950 py-20 overflow-hidden border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 mb-12 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease }}
          className="text-2xl sm:text-3xl font-bold text-white"
        >
          Trusted by leading organisations
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease, delay: 0.1 }}
          className="mt-3 text-gray-400 text-sm"
        >
          Our graduates work at top companies worldwide
        </motion.p>
      </div>

      {/* Marquee */}
      <div className="relative">
        {/* Left fade */}
        <div aria-hidden className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-linear-to-r from-slate-950 to-transparent" />
        {/* Right fade */}
        <div aria-hidden className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-linear-to-l from-slate-950 to-transparent" />

        <motion.div
          className="flex"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {/* Duplicate list for seamless loop */}
          {[...LOGOS, ...LOGOS].map((logo, i) => (
            <LogoItem key={`${logo.abbr}-${i}`} name={logo.name} abbr={logo.abbr} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
