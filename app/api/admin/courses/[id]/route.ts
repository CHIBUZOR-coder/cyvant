import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
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

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    await db.course.delete({ where: { id } });
    revalidatePath("/courses");
    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to delete course.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    const body = await req.json();

    const course = await db.course.update({
      where: { id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.academy !== undefined && { academy: body.academy }),
        ...(body.tier !== undefined && { tier: Number(body.tier) }),
        ...(body.path !== undefined && { path: body.path || null }),
        ...(body.level !== undefined && { level: body.level }),
        ...(body.duration !== undefined && { duration: body.duration }),
        ...(body.format !== undefined && { format: body.format }),
        ...(body.startingPrice !== undefined && { startingPrice: Number(body.startingPrice) }),
        ...(body.isStartHere !== undefined && { isStartHere: body.isStartHere }),
        ...(body.isMostPopular !== undefined && { isMostPopular: body.isMostPopular }),
        ...(body.featured !== undefined && { featured: body.featured }),
        ...(body.published !== undefined && { published: body.published }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.prerequisites !== undefined && { prerequisites: body.prerequisites }),
        ...(body.whatYouLearn !== undefined && { whatYouLearn: body.whatYouLearn }),
        ...(body.capstone !== undefined && { capstone: body.capstone }),
        ...(body.advancedElective !== undefined && { advancedElective: body.advancedElective }),
        ...(body.certificationAlignment !== undefined && { certificationAlignment: body.certificationAlignment }),
        ...(body.careerPaths !== undefined && { careerPaths: body.careerPaths }),
      },
    });

    revalidatePath("/courses");
    revalidatePath("/");
    return NextResponse.json(mapCourse(course));
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update course.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
