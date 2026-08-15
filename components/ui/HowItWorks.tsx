"use client";

import { motion } from "framer-motion";

const STEPS = [
  { label: "Learn", desc: "Core concepts" },
  { label: "Practice", desc: "Hands-on labs" },
  { label: "Build", desc: "Real projects" },
  { label: "Present", desc: "Show your work" },
  { label: "Defend", desc: "Peer review" },
  { label: "Portfolio", desc: "Verified output" },
  { label: "Opportunity", desc: "Career outcomes" },
];

export default function HowItWorks() {
  return (
    <section className="bg-white dark:bg-slate-950 border-b border-gray-100 dark:border-gray-800 py-20 px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.p
          className="text-center text-xs font-semibold uppercase tracking-widest text-blue-700 dark:text-blue-400 mb-12"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          How It Works
        </motion.p>

        {/* Mobile: vertical stacked list */}
        <ol className="lg:hidden flex flex-col max-w-xs mx-auto" aria-label="Program steps">
          {STEPS.map((step, index) => (
            <motion.li
              key={step.label}
              className="flex items-start gap-4"
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.07 }}
            >
              <div className="flex flex-col items-center">
                <motion.div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-700 text-white font-bold text-sm shadow-sm cursor-default"
                  whileHover={{ scale: 1.25, backgroundColor: "#1e40af" }}
                  whileTap={{ scale: 0.92 }}
                  transition={{ type: "spring", stiffness: 400, damping: 12 }}
                >
                  {index + 1}
                </motion.div>
                {index < STEPS.length - 1 && (
                  <div className="w-px flex-1 min-h-10 bg-blue-200 dark:bg-blue-800 my-1" aria-hidden="true" />
                )}
              </div>
              <div className="pb-5 pt-1">
                <p className="text-sm font-semibold text-slate-800 dark:text-white">{step.label}</p>
                <p className="text-xs text-slate-400 dark:text-gray-500 mt-0.5">{step.desc}</p>
              </div>
            </motion.li>
          ))}
        </ol>

        {/* Desktop: horizontal row */}
        <ol className="hidden lg:flex items-start justify-center" aria-label="Program steps">
          {STEPS.map((step, index) => (
            <li key={step.label} className="flex items-center">
              <motion.div
                className="flex flex-col items-center text-center w-24 group"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.07 }}
              >
                <motion.div
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-700 text-white font-bold text-sm shadow-sm cursor-default"
                  whileHover={{ scale: 1.3, backgroundColor: "#1e40af", boxShadow: "0 0 0 6px rgba(59,130,246,0.2)" }}
                  whileTap={{ scale: 0.92 }}
                  transition={{ type: "spring", stiffness: 380, damping: 10 }}
                >
                  {index + 1}
                </motion.div>
                <p className="mt-2 text-sm font-semibold text-slate-800 dark:text-white">{step.label}</p>
                <p className="text-xs text-slate-400 dark:text-gray-500 mt-0.5">{step.desc}</p>
              </motion.div>
              {index < STEPS.length - 1 && (
                <div className="w-6 h-px bg-blue-200 dark:bg-blue-800 mx-1 mb-6" aria-hidden="true" />
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
