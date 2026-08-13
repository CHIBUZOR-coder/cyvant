import type { Metadata } from "next";
import Link from "next/link";
import FadeIn from "@/components/ui/FadeIn";

export const metadata: Metadata = {
  title: "Services",
  description: "Corporate cybersecurity training, curriculum design, and consulting from CYVANT.",
};

const SERVICES = [
  {
    id: "corporate-training",
    number: "01",
    title: "Corporate Cybersecurity Awareness Training",
    description:
      "[PLACEHOLDER: Description of the corporate training offering — audience, format, outcomes, duration.]",
    cta: "Request a quote",
  },
  {
    id: "custom-curriculum",
    number: "02",
    title: "Custom Curriculum & Team Upskilling",
    description:
      "[PLACEHOLDER: Bespoke programs designed for specific teams or skill gaps.]",
    cta: "Talk to us",
  },
  {
    id: "partnership-consulting",
    number: "03",
    title: "Partnership, Speaking & Consulting",
    description:
      "[PLACEHOLDER: Speaking engagements, advisory roles, partnerships with organisations.]",
    cta: "Talk to us",
  },
];

export default function ServicesPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-slate-900 px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <FadeIn delay={0}>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-4">Services</p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Beyond the classroom
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-6 text-base leading-8 text-gray-300 sm:text-lg">
              CYVANT works directly with organisations to build cyber-aware, AI-ready teams.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
          {SERVICES.map(({ id, number, title, description, cta }, index) => (
            <FadeIn key={id} delay={index * 0.1}>
              <li
                className="flex flex-col rounded-2xl border border-gray-200 p-6 shadow-sm hover:border-blue-200 hover:shadow-md transition-all duration-200 h-full"
                data-service-id={id}
              >
                <p className="text-xs font-bold text-blue-700 tracking-widest mb-3">{number}</p>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">{title}</h2>
                <p className="text-gray-600 leading-7 flex-1">{description}</p>
                <div className="mt-6">
                  <Link
                    href={`/contact?service=${id}`}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 transition-colors"
                    aria-label={`${cta} — ${title}`}
                  >
                    {cta} →
                  </Link>
                </div>
              </li>
            </FadeIn>
          ))}
        </ul>
      </section>
    </div>
  );
}
