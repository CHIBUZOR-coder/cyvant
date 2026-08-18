import type { Metadata } from "next";
import { db } from "@/lib/db";
import Link from "next/link";
import WebinarCard from "@/components/ui/WebinarCard";
import WebinarNotifyForm from "@/components/forms/WebinarNotifyForm";
import FadeIn from "@/components/ui/FadeIn";

export const metadata: Metadata = {
  title: "Webinars",
  description: "Join CYVANT live webinars on cybersecurity and AI. Register for upcoming sessions or watch past recordings.",
};

export const dynamic = "force-dynamic";

export default async function WebinarsPage() {
  const now = new Date();

  const [upcoming, past] = await Promise.all([
    db.webinar.findMany({
      where: { date: { gte: now } },
      orderBy: { date: "asc" },
    }).catch(() => []),
    db.webinar.findMany({
      where: { date: { lt: now } },
      orderBy: { date: "desc" },
    }).catch(() => []),
  ]);

  const hasWebinars = upcoming.length > 0 || past.length > 0;

  return (
    <div className="bg-gray-950 min-h-screen">
      {/* ── Hero ── */}
      <section className="px-4 pt-16 pb-10 sm:px-6 sm:pt-20 sm:pb-14 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <FadeIn>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-4">Live Sessions</p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Webinars
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-5 text-base text-gray-400 sm:text-lg">
              Free live sessions on cybersecurity, AI, and career transitions. Click Register to secure your spot. It&apos;s free.
            </p>
          </FadeIn>
        </div>
      </section>

      {!hasWebinars ? (
        /* ── No webinars yet ── */
        <section className="mx-auto max-w-md px-4 pb-24 sm:px-6 lg:px-8">
          <FadeIn delay={0.3}>
            <div className="rounded-2xl border border-white/5 bg-gray-900 p-8">
              <p className="text-xl font-bold text-white mb-1 text-center">No webinars yet</p>
              <p className="text-gray-400 text-sm leading-relaxed text-center mb-8">
                We&apos;re planning our next live session. Drop your details below and we&apos;ll notify you the moment registration opens.
              </p>
              <WebinarNotifyForm />
            </div>
          </FadeIn>
        </section>
      ) : (
        <div className="mx-auto max-w-6xl px-4 pb-24 sm:px-6 lg:px-8 space-y-16">

          {/* ── Upcoming ── */}
          {upcoming.length > 0 && (
            <section>
              <FadeIn>
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-xl font-bold text-white">Upcoming</h2>
                  <span className="inline-flex items-center rounded-full bg-blue-500/15 border border-blue-500/30 px-2.5 py-0.5 text-xs font-semibold text-blue-400">
                    {upcoming.length}
                  </span>
                </div>
              </FadeIn>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {upcoming.map((w, i) => (
                  <FadeIn key={w.id} delay={i * 0.07}>
                    <WebinarCard
                      index={i}
                      webinar={{
                        id: w.id,
                        title: w.title,
                        subtitle: w.subtitle,
                        date: w.date.toISOString(),
                        time: w.time,
                        description: w.description,
                        formatSummary: w.formatSummary,
                        thumbnailImage: w.thumbnailImage,
                        registrationOpen: w.registrationOpen,
                        qualifyingQuestion: w.qualifyingQuestion,
                        recordingUrl: w.recordingUrl,
                        recordingPermissionConfirmed: w.recordingPermissionConfirmed,
                        recapContent: w.recapContent,
                        isPast: false,
                      }}
                    />
                  </FadeIn>
                ))}
              </div>
            </section>
          )}

          {/* ── Past ── */}
          {past.length > 0 && (
            <section>
              <FadeIn>
                <h2 className="text-xl font-bold text-white mb-6">Past Webinars</h2>
              </FadeIn>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {past.map((w, i) => (
                  <FadeIn key={w.id} delay={i * 0.07}>
                    <WebinarCard
                      index={i}
                      webinar={{
                        id: w.id,
                        title: w.title,
                        subtitle: w.subtitle,
                        date: w.date.toISOString(),
                        time: w.time,
                        description: w.description,
                        formatSummary: w.formatSummary,
                        thumbnailImage: w.thumbnailImage,
                        registrationOpen: w.registrationOpen,
                        qualifyingQuestion: w.qualifyingQuestion,
                        recordingUrl: w.recordingUrl,
                        recordingPermissionConfirmed: w.recordingPermissionConfirmed,
                        recapContent: w.recapContent,
                        isPast: true,
                      }}
                    />
                  </FadeIn>
                ))}
              </div>
            </section>
          )}

        </div>
      )}
    </div>
  );
}
