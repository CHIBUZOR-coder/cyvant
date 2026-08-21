export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import type { Course as PrismaCourse } from "@prisma/client";
import type { Course } from "@/types";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

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
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const courses = await db.course.findMany({
    orderBy: [{ tier: "asc" }, { startingPrice: "asc" }],
  });

  return NextResponse.json(courses.map(mapCourse));
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();

    const {
      title,
      tier,
      path,
      level,
      duration,
      startingPrice,
      academy = "cybersecurity",
      format = "Online, cohort-based",
      isStartHere = false,
      isMostPopular = false,
      featured = false,
      published = true,
      description,
      prerequisites = [],
      whatYouLearn = [],
      capstone,
      advancedElective,
      certificationAlignment = [],
      careerPaths = [],
    } = body;

    if (!title || !tier || !level || !duration) {
      return NextResponse.json({ error: "title, tier, level, and duration are required." }, { status: 400 });
    }

    const slug = body.slug?.trim() || slugify(title);

    const course = await db.course.create({
      data: {
        slug,
        title,
        academy,
        tier: Number(tier),
        path: path || null,
        level,
        duration,
        format,
        startingPrice: Number(startingPrice) || 0,
        isStartHere,
        isMostPopular,
        featured,
        published,
        description: description || null,
        prerequisites,
        whatYouLearn,
        capstone: capstone || null,
        advancedElective: advancedElective || null,
        certificationAlignment,
        careerPaths,
      },
    });

    revalidatePath("/courses");
    revalidatePath("/");
    return NextResponse.json(mapCourse(course), { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to create course.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
