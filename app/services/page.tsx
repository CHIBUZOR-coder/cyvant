import type { Metadata } from "next";
import FadeIn from "@/components/ui/FadeIn";
import DarkSection from "@/components/ui/DarkSection";
import ServiceCard from "@/components/ui/ServiceCard";
import { db } from "@/lib/db";
import { SERVICE_ICONS } from "@/lib/service-icons";
import type { ServiceIconKey } from "@/lib/service-icons";

export const metadata: Metadata = {
  title: "Services",
  description: "Corporate cybersecurity training, curriculum design, and consulting from CYVANT.",
};

export default async function ServicesPage() {
  const services = await db.service.findMany({
    where: { published: true },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });

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
        {services.length === 0 ? (
          <p className="text-center text-gray-400 py-12">No services available yet.</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
            {services.map(({ id, slug, number, title, description, cta, icon }, index) => (
              <FadeIn key={id} delay={index * 0.1}>
                <ServiceCard
                  id={slug}
                  number={number}
                  title={title}
                  description={description}
                  cta={cta}
                  icon={SERVICE_ICONS[icon as ServiceIconKey] ?? SERVICE_ICONS.shield}
                />
              </FadeIn>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
