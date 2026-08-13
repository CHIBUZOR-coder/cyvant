"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Course } from "@/types";

interface Props {
  course: Course;
  index?: number;
}

const LEVEL_COLORS: Record<Course["level"], string> = {
  Foundations: "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20",
  Professional: "bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20",
  Engineering: "bg-violet-500/10 text-violet-400 ring-1 ring-violet-500/20",
};

export default function CourseCard({ course, index = 0 }: Props) {
  return (
    <motion.li
      className="relative flex flex-col rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-blue-200 transition-shadow duration-200"
      data-course-id={course.id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ y: -4 }}
    >
      {course.isStartHere && (
        <span
          className="absolute -top-3 left-5 rounded-full bg-blue-700 px-3 py-0.5 text-xs font-bold text-white shadow"
          aria-label="Recommended starting point"
        >
          Start Here
        </span>
      )}

      <div className="flex-1">
        <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${LEVEL_COLORS[course.level]}`}>
          {course.level}
        </span>

        <h3 className="mt-4 text-base font-semibold text-gray-900">{course.title}</h3>

        <dl className="mt-4 space-y-1.5 text-sm">
          <div className="flex gap-3">
            <dt className="font-medium text-gray-400 w-14 shrink-0">Duration</dt>
            <dd className="text-gray-700">{course.duration}</dd>
          </div>
          <div className="flex gap-3">
            <dt className="font-medium text-gray-400 w-14 shrink-0">Format</dt>
            <dd className="text-gray-700">{course.format}</dd>
          </div>
          <div className="flex gap-3" aria-label={`Starting price for ${course.title}`}>
            <dt className="font-medium text-gray-400 w-14 shrink-0">From</dt>
            <dd className="font-bold text-gray-900">
              {course.startingPrice > 0
                ? `₦${course.startingPrice.toLocaleString("en-NG")}`
                : "[₦ price TBD]"}
            </dd>
          </div>
        </dl>
      </div>

      <div className="mt-6 pt-5 border-t border-gray-100">
        <Link
          href={`/courses/${course.slug}/inquire`}
          className="block w-full rounded-lg bg-blue-700 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-blue-800 transition-colors"
          aria-label={`Inquire about ${course.title}`}
        >
          Inquire Now →
        </Link>
      </div>
    </motion.li>
  );
}
