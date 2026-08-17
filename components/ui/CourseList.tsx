"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CourseCard from "./CourseCard";
import type { Course } from "@/types";

const INITIAL_COUNT = 3;

export default function CourseList({ courses }: { courses: Course[] }) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? courses : courses.slice(0, INITIAL_COUNT);
  const hidden = courses.length - INITIAL_COUNT;

  return (
    <div>
      <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6" role="list" aria-label="Courses">
        <AnimatePresence initial={false}>
          {visible.map((course, index) => (
            <CourseCard key={course.id} course={course} index={index} />
          ))}
        </AnimatePresence>
      </ul>

      {courses.length > INITIAL_COUNT && (
        <div className="mt-10 flex justify-center">
          <button
            onClick={() => setShowAll((prev) => !prev)}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-900 px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-700 dark:hover:text-blue-400 transition-colors shadow-sm"
          >
            {showAll ? (
              <>
                Show Less
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 15l7-7 7 7" />
                </svg>
              </>
            ) : (
              <>
                See More
                <span className="rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 text-xs font-bold px-2 py-0.5">
                  +{hidden}
                </span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 9l-7 7-7-7" />
                </svg>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
