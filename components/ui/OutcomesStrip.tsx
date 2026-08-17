"use client";

import { motion } from "framer-motion";
import type { GraduateOutcome } from "@/types";

interface Props {
  outcomes: GraduateOutcome[];
}

export default function OutcomesStrip({ outcomes }: Props) {
  const verified = outcomes.filter((o) => o.permissionConfirmed);

  if (verified.length === 0) {
    return null;
  }

  return (
    <section className="bg-gray-50 dark:bg-slate-900 px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-7xl">
        <motion.h2
          className="text-center text-sm font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-10"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          Where Our Graduates Work
        </motion.h2>
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-wrap justify-center gap-3 sm:gap-4 lg:gap-6" role="list">
          {verified.map((outcome, index) => (
            <motion.li
              key={outcome.id}
              className="flex flex-col items-center text-center bg-white dark:bg-slate-800 rounded-lg px-4 py-4 shadow-sm border border-gray-100 dark:border-gray-700"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.07 }}
            >
              <p className="font-semibold text-gray-900 dark:text-white text-sm">{outcome.name}</p>
              <p className="text-blue-700 dark:text-blue-400 text-xs mt-1">{outcome.role}</p>
              <p className="text-gray-500 dark:text-gray-400 text-xs">{outcome.company}</p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
