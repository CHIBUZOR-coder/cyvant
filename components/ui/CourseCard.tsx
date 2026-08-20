"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect, useCallback } from "react";
import type { Course } from "@/types";

const LEVEL_STYLES: Record<Course["level"], string> = {
  Beginner:     "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
  Intermediate: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
  Advanced:     "bg-violet-500/15 text-violet-400 border border-violet-500/30",
};

const TIER_STYLES: Record<1 | 2 | 3, { bar: string; label: string }> = {
  1: { bar: "bg-[#007dff]",   label: "text-blue-600 dark:text-blue-400" },
  2: { bar: "bg-indigo-600", label: "text-indigo-600 dark:text-indigo-400" },
  3: { bar: "bg-violet-600", label: "text-violet-600 dark:text-violet-400" },
};

function CheckIcon() {
  return (
    <svg viewBox="0 0 12 12" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 6l2.5 2.5L10 3.5" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="8" cy="8" r="6.5" />
      <path d="M8 5v3.2l2 1.3" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

export default function CourseCard({ course, index = 0 }: { course: Course; index?: number }) {
  const [open, setOpen] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const levelStyle = LEVEL_STYLES[course.level];
  const tierStyle = TIER_STYLES[course.tier];

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollDown(el.scrollHeight - el.scrollTop - el.clientHeight > 8);
  }, []);

  useEffect(() => {
    if (open) {
      // Give the DOM time to render before checking scroll
      const t = setTimeout(checkScroll, 60);
      return () => clearTimeout(t);
    }
  }, [open, checkScroll]);

  return (
    <>
      <motion.li
        className="relative flex flex-col rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 overflow-hidden shadow-sm hover:shadow-md hover:border-blue-200 dark:hover:border-blue-500/50 transition-all duration-200"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: index * 0.08 }}
        whileHover={{ y: -4 }}
      >
        {/* Tier colour bar */}
        <div className={`h-1 w-full ${tierStyle.bar}`} />

        <div className="p-6 flex flex-col flex-1">
        {/* Floating badges */}
        {course.isStartHere && (
          <span className="absolute top-4 right-4 rounded-full bg-[#007dff] px-2.5 py-0.5 text-xs font-bold text-white shadow">
            Start Here
          </span>
        )}
        {course.isMostPopular && (
          <span className="absolute top-4 right-4 rounded-full bg-amber-500 px-2.5 py-0.5 text-xs font-bold text-white shadow">
            Most Popular
          </span>
        )}

        {/* Tier + level row */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs font-bold uppercase tracking-widest ${tierStyle.label}`}>
            Tier {course.tier}
          </span>
          <span className="text-gray-300 dark:text-gray-600 text-xs">·</span>
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${levelStyle}`}>
            <CheckIcon />
            {course.level}
          </span>
        </div>

        <h3 className="mt-4 text-lg font-bold text-gray-900 dark:text-white leading-snug">{course.title}</h3>

        {course.description && (
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3 flex-1">{course.description}</p>
        )}

        <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-sm text-gray-400 dark:text-gray-500">
            <ClockIcon />
            {course.duration}
          </div>
          <button
            onClick={() => setOpen(true)}
            className="cursor-pointer text-sm font-semibold text-[#007dff] dark:text-blue-400 hover:text-[#0066d9] dark:hover:text-blue-300 transition-colors"
          >
            Details →
          </button>
        </div>
        </div>{/* end p-6 wrapper */}
      </motion.li>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <div className="absolute inset-0 bg-black/60 dark:bg-black/75 backdrop-blur-sm" />

            {/* Outer wrapper: relative, clips the gradient */}
            <motion.div
              className="relative w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Scrollable content */}
              <div
                ref={scrollRef}
                onScroll={checkScroll}
                className="scrollbar-modal max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8"
              >
                <button
                  onClick={() => setOpen(false)}
                  className="cursor-pointer absolute top-4 right-4 z-10 text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                  aria-label="Close modal"
                >
                  <CloseIcon />
                </button>

                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-xs font-bold uppercase tracking-widest ${tierStyle.label}`}>Tier {course.tier}</span>
                  <span className="text-gray-300 dark:text-gray-600 text-xs">·</span>
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${levelStyle}`}>
                    <CheckIcon />
                    {course.level}
                  </span>
                  {course.isMostPopular && (
                    <span className="rounded-full bg-amber-500 px-2.5 py-0.5 text-xs font-bold text-white">Most Popular</span>
                  )}
                </div>

                <h2 className="mt-4 text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white leading-tight">{course.title}</h2>

                {course.description && (
                  <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{course.description}</p>
                )}

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 px-4 py-3">
                    <div className="flex items-center gap-1.5 text-gray-400 mb-1">
                      <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 7v5l3 2" />
                      </svg>
                      <span className="text-xs text-gray-500">Duration</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{course.duration}</p>
                  </div>
                  <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 px-4 py-3">
                    <div className="flex items-center gap-1.5 text-gray-400 mb-1">
                      <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="6" width="20" height="12" rx="2" />
                        <circle cx="12" cy="12" r="2" />
                        <path d="M6 12h.01M18 12h.01" />
                      </svg>
                      <span className="text-xs text-gray-500">Starting From</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {course.startingPrice > 0
                        ? `₦${course.startingPrice.toLocaleString("en-NG")}`
                        : "Price on request"}
                    </p>
                  </div>
                </div>

                {course.prerequisites && course.prerequisites.length > 0 && (
                  <div className="mt-5">
                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">Prerequisites</p>
                    <ul className="space-y-1.5">
                      {course.prerequisites.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                          <span className="mt-0.5 text-blue-600 dark:text-blue-400 shrink-0">→</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {course.whatYouLearn && course.whatYouLearn.length > 0 && (
                  <div className="mt-5">
                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">What You&apos;ll Learn</p>
                    <div className="flex flex-wrap gap-2">
                      {course.whatYouLearn.map((item, i) => (
                        <span
                          key={i}
                          className="rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 px-3 py-1 text-xs text-[#007dff] dark:text-blue-300"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {course.capstone && (
                  <div className="mt-5">
                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">Capstone Projects</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{course.capstone}</p>
                  </div>
                )}

                {course.advancedElective && (
                  <div className="mt-5 rounded-xl bg-violet-50 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20 px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-1">Optional Add-on</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{course.advancedElective}</p>
                  </div>
                )}

                {course.certificationAlignment && course.certificationAlignment.length > 0 && (
                  <div className="mt-5">
                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">Certification Alignment</p>
                    <div className="flex flex-wrap gap-2">
                      {course.certificationAlignment.map((cert, i) => (
                        <span key={i} className="rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 py-1 text-xs text-gray-600 dark:text-gray-300">
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {course.careerPaths && course.careerPaths.length > 0 && (
                  <div className="mt-5">
                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">Career Paths</p>
                    <div className="flex flex-wrap gap-2">
                      {course.careerPaths.map((path, i) => (
                        <span key={i} className="rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-3 py-1 text-xs text-emerald-700 dark:text-emerald-400">
                          {path}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <Link
                  href={`/courses/${course.slug}/inquire`}
                  className="mt-7 block w-full rounded-xl bg-[#007dff] px-6 py-3.5 text-center text-sm font-semibold text-white hover:bg-[#007dff] transition-colors shadow-lg shadow-blue-900/20"
                >
                  Apply Now. Our team will be in touch.
                </Link>
              </div>

              {/* Scroll-hint — fades out once user reaches bottom */}
              <div
                aria-hidden
                className={`pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-white dark:from-slate-900 to-transparent rounded-b-2xl flex items-end justify-center pb-4 transition-opacity duration-300 ${canScrollDown ? "opacity-100" : "opacity-0"}`}
              >
                <svg
                  className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-bounce drop-shadow-md"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
