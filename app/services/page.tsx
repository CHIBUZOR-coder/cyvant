import type { Metadata } from "next";
import FadeIn from "@/components/ui/FadeIn";
import DarkSection from "@/components/ui/DarkSection";
import ServiceCard from "@/components/ui/ServiceCard";

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
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
      </svg>
    ),
  },
  {
    id: "custom-curriculum",
    number: "02",
    title: "Custom Curriculum & Team Upskilling",
    description:
      "[PLACEHOLDER: Bespoke programs designed for specific teams or skill gaps.]",
    cta: "Talk to us",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-violet-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 3.741-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
      </svg>
    ),
  },
  {
    id: "partnership-consulting",
    number: "03",
    title: "Partnership, Speaking & Consulting",
    description:
      "[PLACEHOLDER: Speaking engagements, advisory roles, partnerships with organisations.]",
    cta: "Talk to us",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
      </svg>
    ),
  },
];

export default function ServicesPage() {
  return (
    <div className="bg-white dark:bg-slate-950">
      <DarkSection className="px-6 py-24 lg:px-8">
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
      </DarkSection>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
          {SERVICES.map(({ id, number, title, description, cta, icon }, index) => (
            <FadeIn key={id} delay={index * 0.1}>
              <ServiceCard id={id} number={number} title={title} description={description} cta={cta} icon={icon} />
            </FadeIn>
          ))}
        </ul>
      </section>
    </div>
  );
}
