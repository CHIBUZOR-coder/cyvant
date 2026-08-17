import type { Metadata } from "next";
import { db } from "@/lib/db";
import WebinarForm from "@/components/forms/WebinarForm";
import FadeIn from "@/components/ui/FadeIn";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Webinars",
  description: "Join CYVANT live webinars on cybersecurity and AI. Register for upcoming sessions or watch past recordings.",
};

export const dynamic = "force-dynamic";

function formatDate(date: Date) {
  return date.toLocaleDateString("en-NG", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

export default async function WebinarsPage() {
  const now = new Date();

  const upcoming = await db.webinar.findFirst({
    where: { date: { gte: now } },
    orderBy: { date: "asc" },
  }).catch(() => null);

  const past = await db.webinar.findMany({
    where: { date: { lt: now } },
    orderBy: { date: "desc" },
  }).catch(() => []);

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
              Free live sessions on cybersecurity, AI, and career transitions. Join us and ask questions in real time.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── Upcoming ── */}
      <section className="mx-auto max-w-5xl px-4 pb-12 sm:px-6 sm:pb-16 lg:px-8">
        {upcoming ? (
          <FadeIn delay={0.3}>
            <div className="rounded-2xl border border-blue-500/20 bg-gray-900 overflow-hidden">
              {upcoming.thumbnailImage && (
                <div className="relative w-full h-40 sm:h-56 lg:h-72">
                  <Image src={upcoming.thumbnailImage} alt={upcoming.title} fill className="object-cover" />
                </div>
              )}
              <div className="p-5 sm:p-8 lg:p-10 grid lg:grid-cols-2 gap-6 lg:gap-10">
                <div className="flex flex-col gap-5">
                  <div>
                    <span className="inline-block text-xs font-semibold uppercase tracking-widest text-blue-400 mb-3">Upcoming</span>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-tight">{upcoming.title}</h2>
                    {upcoming.subtitle && <p className="mt-2 text-blue-300 font-medium">{upcoming.subtitle}</p>}
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                    <span>📅 {formatDate(upcoming.date)}</span>
                    {upcoming.time && <span>🕕 {upcoming.time}</span>}
                    {upcoming.formatSummary && <span>🎙 {upcoming.formatSummary}</span>}
                  </div>
                  {upcoming.description && <p className="text-gray-300 leading-7">{upcoming.description}</p>}
                </div>
                <div>
                  {upcoming.registrationOpen ? (
                    <div className="rounded-xl bg-gray-800/60 border border-white/5 p-6">
                      <p className="text-white font-bold text-lg mb-1">Reserve your spot</p>
                      <p className="text-gray-400 text-sm mb-6">Free — limited seats available.</p>
                      <WebinarForm
                        webinarId={upcoming.id}
                        webinarTitle={upcoming.title}
                        qualifyingQuestion={upcoming.qualifyingQuestion}
                      />
                    </div>
                  ) : (
                    <div className="rounded-xl bg-gray-800/60 border border-white/5 p-6 flex flex-col items-center justify-center text-center h-full">
                      <p className="text-white font-semibold text-lg">Registration not yet open</p>
                      <p className="text-gray-400 text-sm mt-2">Check back soon.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </FadeIn>
        ) : (
          <FadeIn delay={0.3}>
            <div className="rounded-2xl border border-white/5 bg-gray-900 p-12 text-center">
              <p className="text-2xl font-bold text-white mb-3">Stay tuned</p>
              <p className="text-gray-400 max-w-md mx-auto">
                No webinar is scheduled yet, but we run regular live sessions. Register below to be the first to know when the next one drops.
              </p>
              <div className="mt-8 max-w-md mx-auto rounded-xl bg-gray-800/60 border border-white/5 p-6">
                <WebinarForm />
              </div>
            </div>
          </FadeIn>
        )}
      </section>

      {/* ── Past webinars ── */}
      {past.length > 0 && (
        <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8">
          <FadeIn>
            <h2 className="text-2xl font-bold text-white mb-8">Past Webinars</h2>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {past.map((w, i) => (
              <FadeIn key={w.id} delay={i * 0.05}>
                <div className="rounded-2xl border border-white/5 bg-gray-900 overflow-hidden flex flex-col">
                  {w.thumbnailImage && (
                    <div className="relative w-full h-40">
                      <Image src={w.thumbnailImage} alt={w.title} fill className="object-cover" />
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-1">
                    <p className="text-xs text-gray-500 mb-2">{formatDate(w.date)}{w.time ? ` · ${w.time}` : ""}</p>
                    <p className="font-bold text-white text-lg leading-snug">{w.title}</p>
                    {w.subtitle && <p className="text-blue-300 text-sm mt-1">{w.subtitle}</p>}
                    {w.recapContent && (
                      <p className="text-gray-400 text-sm mt-3 leading-relaxed line-clamp-3">{w.recapContent}</p>
                    )}
                    {w.recordingUrl && w.recordingPermissionConfirmed && (
                      <a href={w.recordingUrl} target="_blank" rel="noopener noreferrer"
                        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                        ▶ Watch recording
                      </a>
                    )}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
