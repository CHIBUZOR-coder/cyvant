import type { Metadata } from "next";
import Link from "next/link";
import FadeIn from "@/components/ui/FadeIn";

export const metadata: Metadata = {
  title: "About",
  description: "Meet the team behind CYVANT and learn why we exist.",
};

const VALUES = [
  {
    title: "Depth over credentials",
    description: "We teach you to think like a defender, not just pass a certification.",
  },
  {
    title: "Africa-first, world-ready",
    description: "Built for the Nigerian and African context, with global standards and career outcomes.",
  },
  {
    title: "Honesty over hype",
    description: "No inflated outcome claims. Every testimonial is confirmed. Every promise is kept.",
  },
  {
    title: "Accessible, not dumbed down",
    description: "No prior tech background required — but we respect your intelligence.",
  },
  {
    title: "Outcomes over enrolments",
    description: "We measure success by what graduates do after CYVANT, not by how many sign up.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-slate-900 px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <FadeIn delay={0}>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-4">About Us</p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Built to change who gets into tech
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-6 text-base leading-8 text-gray-300 sm:text-lg">
              [PLACEHOLDER: Mission statement — 1–2 sentences on what CYVANT is and who it is for.]
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Founder */}
      <section className="py-20 px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <FadeIn>
            <h2 className="text-2xl font-bold text-gray-900 mb-10">Our Founder</h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="flex flex-col sm:flex-row gap-8 items-start">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-gray-100 shrink-0 overflow-hidden ring-1 ring-gray-200 flex items-center justify-center text-gray-400 text-xs text-center p-2">
                [Real photo needed]
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">Emmanuel Tavershima</h3>
                <p className="mt-3 text-gray-600 leading-7">
                  [PLACEHOLDER: Emmanuel&apos;s background, credentials, and why he founded CYVANT.]
                </p>
                <div className="mt-5 flex gap-4">
                  <a
                    href="https://linkedin.com/in/[PLACEHOLDER]"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-700 hover:text-blue-600 transition-colors"
                    aria-label="Emmanuel Tavershima on LinkedIn"
                  >
                    LinkedIn ↗
                  </a>
                  <a
                    href="https://github.com/[PLACEHOLDER]"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-700 hover:text-blue-600 transition-colors"
                    aria-label="Emmanuel Tavershima on GitHub"
                  >
                    GitHub ↗
                  </a>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Team */}
      <section className="bg-gray-50 py-20 px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <FadeIn>
            <h2 className="text-2xl font-bold text-gray-900 mb-10">Our Team</h2>
          </FadeIn>
          <div className="grid sm:grid-cols-2 gap-6">
            {["Content Creator", "Digital Marketer"].map((role, i) => (
              <FadeIn key={role} delay={i * 0.1}>
                <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm h-full">
                  <div className="w-14 h-14 rounded-xl bg-blue-50 border border-blue-100 mb-4 flex items-center justify-center text-blue-400 text-xs">
                    [Photo]
                  </div>
                  <p className="font-semibold text-gray-900">[PLACEHOLDER: Name]</p>
                  <p className="text-sm text-blue-700 font-medium mt-0.5">{role}</p>
                  <p className="mt-2 text-sm text-gray-500 leading-6">[PLACEHOLDER: Short bio]</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <FadeIn>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Why CYVANT Exists</h2>
            <p className="text-gray-600 leading-8 text-lg">
              [PLACEHOLDER: Company story — why CYVANT was founded, what gap it fills in the African tech education market.]
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Values */}
      <section className="bg-slate-900 py-20 px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <FadeIn>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-4">Our values</p>
            <h2 className="text-2xl font-bold text-white mb-12">What We Stand For</h2>
          </FadeIn>
          <ul className="grid sm:grid-cols-2 gap-6" role="list">
            {VALUES.map(({ title, description }, i) => (
              <FadeIn key={title} delay={i * 0.07}>
                <li className="rounded-2xl border border-white/10 bg-white/5 p-6 h-full">
                  <div className="w-2 h-2 rounded-full bg-blue-400 mb-4" />
                  <p className="font-semibold text-white">{title}</p>
                  <p className="mt-2 text-sm text-gray-400 leading-6">{description}</p>
                </li>
              </FadeIn>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 lg:px-8 text-center">
        <FadeIn>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Ready to start?</h2>
          <Link
            href="/courses"
            className="inline-block rounded-xl bg-blue-700 px-8 py-3.5 text-sm font-semibold text-white shadow-lg hover:bg-blue-800 transition-colors"
          >
            Explore Courses →
          </Link>
        </FadeIn>
      </section>
    </div>
  );
}
