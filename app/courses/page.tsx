import type { Metadata } from "next";
import CourseCard from "@/components/ui/CourseCard";
import { courses } from "@/data/courses";

export const metadata: Metadata = {
  title: "Courses",
  description: "Explore CYVANT's Cybersecurity and AI course catalog. Foundations to Engineering level.",
};

const cyberCourses = courses.filter((c) => c.academy === "cybersecurity");
const aiCourses = courses.filter((c) => c.academy === "ai");

export default function CoursesPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-slate-900 px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-4">Our Courses</p>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Two academies. Every level.
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300 max-w-2xl">
            Built to take you from no background to job-ready. Look for the{" "}
            <span className="rounded-full bg-blue-700 text-white px-2 py-0.5 text-xs font-bold">Start Here</span>{" "}
            badge if you&apos;re not sure where to begin.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 space-y-20">
        {/* Cybersecurity Academy */}
        <div>
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-700 mb-2">Academy 1</p>
            <h2 className="text-2xl font-bold text-gray-900">Cybersecurity Academy</h2>
            <p className="mt-2 text-gray-500">From awareness to hands-on defence.</p>
          </div>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" role="list" aria-label="Cybersecurity courses">
            {cyberCourses.map((course, index) => (
              <CourseCard key={course.id} course={course} index={index} />
            ))}
          </ul>
        </div>

        {/* AI Academy */}
        <div>
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-700 mb-2">Academy 2</p>
            <h2 className="text-2xl font-bold text-gray-900">AI Academy</h2>
            <p className="mt-2 text-gray-500">Understand, build, and apply AI — from concept to production.</p>
          </div>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" role="list" aria-label="AI courses">
            {aiCourses.map((course, index) => (
              <CourseCard key={course.id} course={course} index={index} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
