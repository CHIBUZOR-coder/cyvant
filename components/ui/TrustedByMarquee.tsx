"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export interface PartnerItem {
  id: string;
  name: string;
  logoUrl: string;
  website?: string | null;
}

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

function LogoCard({ partner }: { partner: PartnerItem }) {
  const inner = (
    <div className="flex shrink-0 items-center justify-center rounded-xl border border-white/8 bg-white/4 px-8 py-4 mx-3 min-w-[160px] h-[72px]">
      <Image
        src={partner.logoUrl}
        alt={partner.name}
        width={160}
        height={48}
        className="max-h-10 w-auto object-contain"
        unoptimized={partner.logoUrl.startsWith("/")}
      />
    </div>
  );

  if (partner.website) {
    return (
      <a href={partner.website} target="_blank" rel="noopener noreferrer" aria-label={partner.name}>
        {inner}
      </a>
    );
  }
  return inner;
}

const SCROLL_THRESHOLD = 5;

export default function TrustedByMarquee({ partners }: { partners: PartnerItem[] }) {
  if (partners.length === 0) return null;

  const useMarquee = partners.length > SCROLL_THRESHOLD;

  const header = (
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
        Companies that trust CYVANT to build their cyber-aware teams
      </motion.p>
    </div>
  );

  if (!useMarquee) {
    return (
      <section className="bg-slate-950 py-20 border-t border-white/5">
        {header}
        <div className="flex flex-wrap justify-center gap-4 px-6">
          {partners.map((partner) => (
            <LogoCard key={partner.id} partner={partner} />
          ))}
        </div>
      </section>
    );
  }

  // Duplicate for seamless loop (animate -50%)
  const items = [...partners, ...partners];
  const duration = Math.max(25, partners.length * 6);

  return (
    <section className="bg-slate-950 py-20 overflow-hidden border-t border-white/5">
      {header}

      <div className="relative">
        <div aria-hidden className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-linear-to-r from-slate-950 to-transparent" />
        <div aria-hidden className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-linear-to-l from-slate-950 to-transparent" />

        <motion.div
          className="flex"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration, repeat: Infinity, ease: "linear" }}
        >
          {items.map((partner, i) => (
            <LogoCard key={`${partner.id}-${i}`} partner={partner} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
