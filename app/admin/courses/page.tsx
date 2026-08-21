export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import type { Course as PrismaCourse } from "@prisma/client";
import type { Course } from "@/types";
import type { Metadata } from "next";
import CourseManager from "@/components/admin/CourseManager";

export const metadata: Metadata = { title: "Courses: CYVANT Admin" };

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

export default async function CoursesAdminPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const rows = await db.course.findMany({
    orderBy: [{ tier: "asc" }, { startingPrice: "asc" }],
  });
  const courses = rows.map(mapCourse);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-5 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-white">Courses</h1>
        <p className="text-gray-400 mt-1 text-sm">Manage the course catalogue shown on the public site.</p>
      </div>
      <CourseManager initialCourses={courses} />
    </div>
  );
}
