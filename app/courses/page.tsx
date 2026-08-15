import type { Metadata } from "next";
import { courses } from "@/data/courses";
import DarkSection from "@/components/ui/DarkSection";
import CourseList from "@/components/ui/CourseList";

export const metadata: Metadata = {
  title: "Courses",
  description: "Explore CYVANT's Cybersecurity and AI course catalog. Foundations to Engineering level.",
};

export default function CoursesPage() {
  return (
    <div className="bg-white dark:bg-slate-950">
      <DarkSection className="px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-4">Our Courses</p>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Cybersecurity courses. Every level.
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300 max-w-2xl">
            Built to take you from no background to job-ready. Look for the{" "}
            <span className="rounded-full bg-blue-700 text-white px-2 py-0.5 text-xs font-bold">Start Here</span>{" "}
            badge if you&apos;re not sure where to begin.
          </p>
        </div>
      </DarkSection>

      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-700 dark:text-blue-400 mb-2">Academy 1</p>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Cybersecurity Academy</h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">From awareness to hands-on defence.</p>
        </div>
        <CourseList courses={courses} />
      </div>
    </div>
  );
}
