import type { Metadata } from "next";
import Link from "next/link";
import FaqAccordion from "@/components/ui/FaqAccordion";
import FadeIn from "@/components/ui/FadeIn";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers to the most common questions about CYVANT courses and programs.",
};

const FAQ_ITEMS = [
  {
    question: "Do I need a tech background to join?",
    answer: "[PLACEHOLDER: Clear, honest answer. State that no prior tech background is required for Foundations courses, and explain the pathway.]",
  },
  {
    question: "How much time does this require weekly?",
    answer: "[PLACEHOLDER: Time commitment per track — be specific, e.g. X hours/week for Foundations, Y hours for Engineering.]",
  },
  {
    question: "What certification or credential do I get?",
    answer: "[PLACEHOLDER: Describe the certificate, what it proves, and whether it maps to any external frameworks.]",
  },
  {
    question: "Is there career support after the program?",
    answer: "[PLACEHOLDER: Describe post-graduation support — job placement, alumni network, portfolio review, referrals.]",
  },
  {
    question: "What's the payment structure?",
    answer: "[PLACEHOLDER: Describe payment options — upfront, instalment plan, discount schemes. Be transparent.]",
  },
  {
    question: "How is this different from self-study or other platforms?",
    answer: "[PLACEHOLDER: Explain the CYVANT difference — structured cohort, practical projects, mentor access, Africa-specific context, verified outcomes.]",
  },
];

export default function FaqPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-slate-900 px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <FadeIn delay={0}>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-4">FAQ</p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Questions, answered.
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-6 text-base text-gray-300 sm:text-lg">
              Can&apos;t find what you&apos;re looking for?{" "}
              <Link href="/contact" className="text-blue-400 hover:text-blue-300 underline underline-offset-4">
                Talk to us directly
              </Link>
              .
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-20 lg:px-8">
        <FadeIn>
          <FaqAccordion items={FAQ_ITEMS} />
        </FadeIn>

        {/* Fallback CTA */}
        <FadeIn delay={0.1}>
          <div className="mt-16 rounded-2xl bg-slate-900 p-6 sm:p-10 text-center">
            <p className="text-white font-semibold text-lg mb-2">Still have questions?</p>
            <p className="text-gray-400 text-sm mb-6">We&apos;ll reply within 24 hours.</p>
            <Link
              href="/contact"
              className="inline-block rounded-xl bg-blue-700 px-7 py-3 text-sm font-semibold text-white hover:bg-blue-800 transition-colors"
            >
              Talk to us →
            </Link>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
