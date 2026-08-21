export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import type { Course as PrismaCourse } from "@prisma/client";
import type { Course } from "@/types";

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

export async function GET() {
  try {
    const courses = await db.course.findMany({
      where: { published: true },
      orderBy: [{ tier: "asc" }, { startingPrice: "asc" }],
    });
    return NextResponse.json(courses.map(mapCourse));
  } catch {
    return NextResponse.json({ error: "Failed to load courses." }, { status: 500 });
  }
}
