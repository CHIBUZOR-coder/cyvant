"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay },
});

export default function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-slate-900 px-6 pt-24 pb-32 sm:pt-32 sm:pb-40 lg:px-8">
      {/* Blue gradient glow — top */}
      <div aria-hidden="true" className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div
          className="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr from-blue-600 to-blue-400 opacity-25 sm:left-[calc(50%-30rem)] sm:w-288.75"
          style={{ clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" }}
        />
      </div>

      <div className="mx-auto max-w-3xl text-center">
        {/* Price pill */}
        <motion.div className="mb-8 flex justify-center" {...fadeUp(0)}>
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-1.5 text-sm text-blue-300">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
            Programs from ₦[PLACEHOLDER],000
          </span>
        </motion.div>

        <motion.h1
          className="text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl"
          {...fadeUp(0.1)}
        >
          Understand breach{" "}
          <span className="text-blue-400">before blame</span>
        </motion.h1>

        <motion.p
          className="mt-8 text-base leading-8 text-slate-300 sm:text-lg max-w-2xl mx-auto"
          {...fadeUp(0.2)}
        >
          AI and cybersecurity education built for Africa, ready for the world.
          Learn by doing, build real skills, and open doors to careers that matter.
        </motion.p>

        <motion.div
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
          {...fadeUp(0.3)}
        >
          {/* Primary CTA — white button on dark bg */}
          <Link
            href="/courses"
            className="w-full sm:w-auto rounded-xl bg-white px-8 py-4 text-base font-semibold text-blue-700 shadow-lg hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all duration-200"
            aria-label="Start Your Journey — Explore Courses"
          >
            Start Your Journey →
          </Link>
          {/* Secondary CTA */}
          <Link
            href="/contact"
            className="w-full sm:w-auto rounded-xl border border-white/20 px-8 py-4 text-base font-medium text-white hover:bg-white/10 transition-all duration-200 text-center"
          >
            Talk to us first
          </Link>
        </motion.div>
      </div>

      {/* Blue gradient glow — bottom */}
      <div aria-hidden="true" className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
        <div
          className="relative left-[calc(50%+3rem)] aspect-1155/678 w-144.5 -translate-x-1/2 bg-linear-to-tr from-blue-700 to-blue-400 opacity-20 sm:left-[calc(50%+36rem)] sm:w-288.75"
          style={{ clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" }}
        />
      </div>
    </section>
  );
}
