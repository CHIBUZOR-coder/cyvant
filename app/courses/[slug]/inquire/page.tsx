import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { courses } from "@/data/courses";
import CourseInquiryForm from "@/components/forms/CourseInquiryForm";
import DarkSection from "@/components/ui/DarkSection";
import FadeIn from "@/components/ui/FadeIn";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return courses.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = courses.find((c) => c.slug === slug);
  if (!course) return {};
  return {
    title: `Inquire — ${course.title}`,
    description: `Get in touch about the ${course.title} course at CYVANT.`,
  };
}

export default async function CourseInquirePage({ params }: Props) {
  const { slug } = await params;
  const course = courses.find((c) => c.slug === slug);
  if (!course) notFound();

  return (
    <div className="bg-white">
      <DarkSection className="px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-xl">
          <FadeIn delay={0}>
            <Link
              href="/courses"
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-blue-400 hover:text-blue-300 mb-6 transition-colors"
            >
              ← All Courses
            </Link>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {course.title}
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-4 text-gray-300">
              Fill in your details and we&apos;ll get back to you within 24 hours with everything you need to get started.
            </p>
          </FadeIn>
        </div>
      </DarkSection>

      <section className="mx-auto max-w-xl px-6 py-16 lg:px-8">
        <FadeIn>
          <Suspense>
            <CourseInquiryForm initialCourse={course.title} />
          </Suspense>
        </FadeIn>
      </section>
    </div>
  );
}
