import type { Metadata } from "next";
import { testimonials } from "@/data/testimonials";
import FadeIn from "@/components/ui/FadeIn";
import TestimonialCarousel from "@/components/ui/TestimonialCarousel";

export const metadata: Metadata = {
  title: "Testimonials",
  description: "Real outcomes from real CYVANT graduates.",
};

export default function TestimonialsPage() {
  const verified = testimonials.filter((t) => t.permissionOnFile);

  return (
    <div className="bg-gray-950 min-h-screen">
      {/* Hero */}
      <section className="px-6 pt-24 pb-16 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <FadeIn delay={0}>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-4">
              Student Outcomes
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Testimonials
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-5 text-base text-gray-400 sm:text-lg">
              Hear from our successful students
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Carousel */}
      <section className="mx-auto max-w-5xl px-6 pb-28 lg:px-8">
        {verified.length === 0 ? (
          <FadeIn>
            <div className="text-center py-20">
              <p className="text-white font-semibold text-lg">Testimonials coming soon</p>
              <p className="text-gray-500 mt-2 text-sm">Our first verified cohort is underway.</p>
            </div>
          </FadeIn>
        ) : (
          <FadeIn delay={0.3}>
            <TestimonialCarousel testimonials={verified} />
          </FadeIn>
        )}
      </section>
    </div>
  );
}
