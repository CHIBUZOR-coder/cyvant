import type { Metadata } from "next";
import { Suspense } from "react";
import GeneralContactForm from "@/components/forms/GeneralContactForm";
import DiscoveryCallForm from "@/components/forms/DiscoveryCallForm";
import FadeIn from "@/components/ui/FadeIn";
import DarkSection from "@/components/ui/DarkSection";

export const metadata: Metadata = {
  title: "Contact",
  description: "Book a discovery call or send us a message — CYVANT team responds within 24 hours.",
};

export default function ContactPage() {
  return (
    <div className="bg-white dark:bg-slate-950">
      <DarkSection className="px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <FadeIn delay={0}>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-4">Contact</p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
              Let&apos;s talk
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-4 text-gray-300">
              Not sure which course is right for you? Book a free 20 minute discovery call
              and we&apos;ll help you figure it out. Or just send us a message.
            </p>
          </FadeIn>
        </div>
      </DarkSection>

      <div className="mx-auto max-w-2xl px-6 py-16 lg:px-8 space-y-20">

        {/* Discovery Call */}
        <section aria-labelledby="book-call-heading">
          <FadeIn>
            <h2 id="book-call-heading" className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Book a free discovery call
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
              20 minutes. No pressure. We&apos;ll help you find the right path.
            </p>
            <Suspense>
              <DiscoveryCallForm />
            </Suspense>
          </FadeIn>
        </section>

        <hr className="border-gray-200 dark:border-gray-700" />

        {/* General Contact */}
        <section aria-labelledby="general-contact-heading">
          <FadeIn>
            <h2 id="general-contact-heading" className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Send us a message
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
              Have a question? We&apos;ll get back to you within 24 hours.
            </p>
            <Suspense>
              <GeneralContactForm />
            </Suspense>
          </FadeIn>
        </section>

      </div>
    </div>
  );
}
