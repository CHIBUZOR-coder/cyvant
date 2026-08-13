import type { Metadata } from "next";
import { Suspense } from "react";
import GeneralContactForm from "@/components/forms/GeneralContactForm";
import FadeIn from "@/components/ui/FadeIn";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the CYVANT team.",
};

export default function ContactPage() {
  return (
    <div className="bg-white">
      <section className="bg-slate-900 px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-xl">
          <FadeIn delay={0}>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-4">Contact</p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
              Talk to us
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-4 text-gray-300">
              Have a question? We&apos;ll get back to you within 24 hours.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="mx-auto max-w-xl px-6 py-16 lg:px-8">
        <FadeIn>
          <Suspense>
            <GeneralContactForm />
          </Suspense>
        </FadeIn>
      </section>
    </div>
  );
}
