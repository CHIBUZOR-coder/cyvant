"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface Props {
  id: string;
  number: string;
  title: string;
  description: string;
  cta: string;
  icon: ReactNode;
}

export default function ServiceCard({ id, number, title, description, cta, icon }: Props) {
  return (
    <motion.li
      className="group flex flex-col rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-sm h-full"
      data-service-id={id}
      initial="rest"
      whileHover="hover"
      animate="rest"
      variants={{
        rest: { y: 0, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" },
        hover: { y: -6, boxShadow: "0 16px 40px rgba(29,78,216,0.12)" },
      }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
    >
      <div className="flex items-center gap-4 mb-5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 dark:bg-slate-800 border border-transparent transition-all duration-300 group-hover:border-blue-300/70 group-hover:shadow-[0_0_12px_rgba(96,165,250,0.55)]">
          {icon}
        </div>
        <p className="text-xs font-bold text-[#007dff] dark:text-blue-400 tracking-widest">{number}</p>
      </div>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{title}</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 leading-7 flex-1">{description}</p>
      <div className="mt-6">
        <Link
          href={`/contact?service=${id}`}
          className="inline-flex items-center gap-2 rounded-lg bg-[#007dff] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0066d9] transition-colors"
          aria-label={`${cta}: ${title}`}
        >
          {cta} →
        </Link>
      </div>
    </motion.li>
  );
}
