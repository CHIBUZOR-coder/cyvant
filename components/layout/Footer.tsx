"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import ParticleCanvas from "@/components/ui/ParticleCanvas";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/courses", label: "Courses" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/faq", label: "FAQ" },
];

const LEGAL_LINKS = [
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy Policy" },
];

const column = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number], delay: i * 0.12 },
  }),
};

function AnimatedLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="group relative inline-block text-sm text-[#007dff] hover:text-white transition-colors duration-200">
      {children}
      <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-white transition-all duration-300 group-hover:w-full" />
    </Link>
  );
}

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-gray-950 text-[#007dff]">
      <ParticleCanvas />

      {/* Top divider glow */}
      <div className="relative z-10 h-px w-full bg-linear-to-r from-transparent via-blue-700/40 to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-8 sm:gap-12 sm:grid-cols-3">

          {/* Brand */}
          <motion.div
            className="sm:col-span-1"
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={column}
          >
            <motion.div whileHover={{ scale: 1.04 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
              <Link href="/" className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                <span className="text-white">CY</span><span className="text-blue-400">VANT</span>
              </Link>
            </motion.div>
            <p className="mt-4 text-sm leading-6">
              AI and cybersecurity education built for Africa, ready for the world.
            </p>
            <p className="mt-6 text-xs text-blue-400/60">
              © {new Date().getFullYear()} CYVANT. All rights reserved.
            </p>
          </motion.div>

          {/* Navigation */}
          <motion.div
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={column}
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-white mb-5">
              Navigate
            </p>
            <ul className="space-y-3">
              {NAV_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <AnimatedLink href={href}>{label}</AnimatedLink>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact & Legal */}
          <motion.div
            custom={2}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={column}
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-white mb-5">
              Get in Touch
            </p>
            <ul className="space-y-3">
              {LEGAL_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <AnimatedLink href={href}>{label}</AnimatedLink>
                </li>
              ))}
              <li>
                <motion.div
                  whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(29,78,216,0.35)" }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="inline-block mt-3 rounded-md"
                >
                  <Link
                    href="/courses"
                    className="block rounded-md bg-[#007dff] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0066d9] transition-colors"
                  >
                    Explore Courses →
                  </Link>
                </motion.div>
              </li>
            </ul>
            <p className="mt-8 text-xs text-blue-400/60 leading-5">
              Data handled in accordance with the Nigerian Data Protection Regulation (NDPR).
            </p>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
