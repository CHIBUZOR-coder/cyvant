import type { Metadata } from "next";
import { testimonials } from "@/data/testimonials";
import type { Testimonial } from "@/types";
import FadeIn from "@/components/ui/FadeIn";

export const metadata: Metadata = {
  title: "Testimonials",
  description: "Real outcomes from real CYVANT graduates.",
};

function TestimonialCard({ t, index }: { t: Testimonial; index: number }) {
  return (
    <FadeIn delay={index * 0.08}>
      <li className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-sm h-full">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 shrink-0 flex items-center justify-center text-gray-400 text-xs">
            [Photo]
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
            <p className="text-xs text-blue-700 font-medium">{t.role}</p>
            <p className="text-xs text-gray-500">{t.company}</p>
          </div>
        </div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Outcome</p>
        <p className="text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2 mb-4 leading-relaxed">
          {t.outcome}
        </p>
        <blockquote className="text-sm text-gray-600 italic leading-relaxed flex-1 border-l-2 border-blue-200 pl-3">
          &ldquo;{t.quote}&rdquo;
        </blockquote>
      </li>
    </FadeIn>
  );
}

export default function TestimonialsPage() {
  const verified = testimonials.filter((t) => t.permissionOnFile);

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-slate-900 px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <FadeIn delay={0}>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-4">Student Outcomes</p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Real people, real results.
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-6 text-base text-gray-300 sm:text-lg">
              Every testimonial below is verified and shared with the student&apos;s written permission.
              No unconfirmed claims, ever.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        {verified.length === 0 ? (
          <FadeIn>
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 mb-6">
                <span className="text-blue-400 text-2xl">🎓</span>
              </div>
              <p className="text-gray-900 font-semibold text-lg">Testimonials coming soon</p>
              <p className="text-gray-500 mt-2 text-sm">Our first verified cohort is underway.</p>
            </div>
          </FadeIn>
        ) : (
          <ul
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            role="list"
            aria-label="Student testimonials"
          >
            {verified.map((t, index) => (
              <TestimonialCard key={t.id} t={t} index={index} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
