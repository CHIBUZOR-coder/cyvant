import type { Metadata } from "next";
import { db } from "@/lib/db";
import type { Course as PrismaCourse } from "@prisma/client";
import type { Course } from "@/types";
import DarkSection from "@/components/ui/DarkSection";
import CourseList from "@/components/ui/CourseList";
import CourseCard from "@/components/ui/CourseCard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Courses",
  description: "Explore CYVANT's Cybersecurity Academy — 3-tier structure from Fundamentals to Advanced Specialisation.",
};

function mapCourse(c: PrismaCourse): Course {
  return {
    id: c.id,
    slug: c.slug,
    title: c.title,
    academy: c.academy as Course["academy"],
    tier: c.tier as 1 | 2 | 3,
    path: (c.path ?? undefined) as "A" | "B" | "C" | undefined,
    level: c.level as Course["level"],
    duration: c.duration,
    format: c.format,
    startingPrice: c.startingPrice,
    isStartHere: c.isStartHere,
    isMostPopular: c.isMostPopular,
    featured: c.featured,
    description: c.description ?? undefined,
    prerequisites: (c.prerequisites as string[]) ?? [],
    whatYouLearn: (c.whatYouLearn as string[]) ?? [],
    capstone: c.capstone ?? undefined,
    advancedElective: c.advancedElective ?? undefined,
    certificationAlignment: (c.certificationAlignment as string[]) ?? [],
    careerPaths: (c.careerPaths as string[]) ?? [],
  };
}

async function getCourses(): Promise<Course[]> {
  try {
    const rows = await db.course.findMany({
      where: { published: true },
      orderBy: [{ tier: "asc" }, { startingPrice: "asc" }],
    });
    return rows.map(mapCourse);
  } catch {
    return [];
  }
}

export default async function CoursesPage() {
  const courses = await getCourses();
  const tier1 = courses.filter((c) => c.tier === 1);
  const tier2 = courses.filter((c) => c.tier === 2);
  const tier3 = courses.filter((c) => c.tier === 3);

  return (
    <div className="bg-white dark:bg-slate-950">

      {/* ── Hero ── */}
      <DarkSection className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-4">Cybersecurity Academy</p>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Cybersecurity courses. Every level.
          </h1>
          <p className="mt-6 text-base leading-8 text-gray-300 max-w-2xl sm:text-lg">
            A structured 3-tier pathway — from zero background to advanced specialisation. Start at Tier 1 and work your way up, or jump in where your skills match.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm">
            <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-blue-300">Tier 1 — Fundamentals</span>
            <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-blue-300">Tier 2 — Intermediate Tracks</span>
            <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-violet-300">Tier 3 — Specialisations</span>
          </div>
        </div>
      </DarkSection>

      {/* ── Tier 1 ── */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="rounded-full bg-blue-700 px-3 py-0.5 text-xs font-bold text-white">Tier 1</span>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-700 dark:text-blue-400">Start Here</p>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Cyber Security Fundamentals</h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">No background required. This is the entry point for everyone.</p>
        </div>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6" role="list">
          {tier1.map((course, i) => (
            <CourseCard key={course.id} course={course} index={i} />
          ))}
        </ul>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="border-t border-gray-100 dark:border-gray-800" />
      </div>

      {/* ── Tier 2 ── */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="rounded-full bg-blue-600 px-3 py-0.5 text-xs font-bold text-white">Tier 2</span>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-700 dark:text-blue-400">Intermediate Tracks</p>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Choose Your Track</h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400 max-w-2xl">
            After Fundamentals, build depth in the areas that match your interests. Tracks can be taken in parallel. Practical labs included across all courses.
          </p>
        </div>
        <CourseList courses={tier2} />
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="border-t border-gray-100 dark:border-gray-800" />
      </div>

      {/* ── Tier 3 ── */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 pb-20 sm:pb-28">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="rounded-full bg-violet-700 px-3 py-0.5 text-xs font-bold text-white">Tier 3</span>
            <p className="text-xs font-semibold uppercase tracking-widest text-violet-700 dark:text-violet-400">Advanced Specialisation</p>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Choose One Path</h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400 max-w-2xl">
            After completing Fundamentals and Security+, students choose a specialisation. Each path includes 1-to-1 mentorship, career support, and a capstone project. 16 weeks each.
          </p>
        </div>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6" role="list">
          {tier3.map((course, i) => (
            <CourseCard key={course.id} course={course} index={i} />
          ))}
        </ul>
      </section>
    </div>
  );
}
