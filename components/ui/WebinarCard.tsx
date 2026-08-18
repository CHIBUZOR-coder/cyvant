"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import WebinarForm from "@/components/forms/WebinarForm";

export interface WebinarData {
  id: string;
  title: string;
  subtitle: string | null;
  date: string;
  time: string | null;
  description: string | null;
  formatSummary: string | null;
  thumbnailImage: string | null;
  registrationOpen: boolean;
  qualifyingQuestion: string;
  recordingUrl: string | null;
  recordingPermissionConfirmed: boolean;
  recapContent: string | null;
  isPast: boolean;
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" stroke="currentColor" strokeWidth={2} fill="none" strokeLinecap="round">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-NG", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

export default function WebinarCard({ webinar, index = 0 }: { webinar: WebinarData; index?: number }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.div
        className="relative flex flex-col rounded-2xl border border-white/5 bg-gray-900 overflow-hidden h-full"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: index * 0.07 }}
        whileHover={{ y: -4 }}
      >
        {/* Thumbnail */}
        {webinar.thumbnailImage && (
          <div className="relative w-full h-44 shrink-0">
            <Image src={webinar.thumbnailImage} alt={webinar.title} fill className="object-cover" />
            <div className="absolute inset-0 bg-linear-to-t from-gray-900/70 to-transparent" />
          </div>
        )}

        <div className="p-6 flex flex-col flex-1 gap-4">
          {/* Status badge */}
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              webinar.isPast
                ? "bg-gray-700/70 text-gray-400"
                : "bg-blue-500/15 text-blue-400 border border-blue-500/30"
            }`}>
              {webinar.isPast ? "Past" : "Upcoming"}
            </span>
            {!webinar.isPast && !webinar.registrationOpen && (
              <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                Registration opening soon
              </span>
            )}
          </div>

          {/* Title */}
          <div>
            <h3 className="text-lg font-bold text-white leading-snug">{webinar.title}</h3>
            {webinar.subtitle && (
              <p className="text-blue-300 text-sm mt-1">{webinar.subtitle}</p>
            )}
          </div>

          {/* Meta */}
          <div className="flex flex-col gap-1 text-xs text-gray-400">
            <span>📅 {formatDate(webinar.date)}</span>
            {webinar.time && <span>🕕 {webinar.time}</span>}
            {!webinar.isPast && webinar.formatSummary && <span>🎙 {webinar.formatSummary}</span>}
          </div>

          {/* Body text */}
          {!webinar.isPast && webinar.description && (
            <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">{webinar.description}</p>
          )}
          {webinar.isPast && webinar.recapContent && (
            <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">{webinar.recapContent}</p>
          )}

          {/* CTA */}
          <div className="mt-auto pt-2">
            {webinar.isPast ? (
              webinar.recordingUrl && webinar.recordingPermissionConfirmed ? (
                <a
                  href={webinar.recordingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer inline-flex items-center gap-2 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Watch Recording
                </a>
              ) : (
                <span className="text-xs text-gray-600">Recording not available</span>
              )
            ) : webinar.registrationOpen ? (
              <button
                onClick={() => setOpen(true)}
                className="cursor-pointer w-full rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
              >
                Register Now →
              </button>
            ) : (
              <p className="text-sm text-gray-500 text-center py-1">Registration opens soon</p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Registration Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <motion.div
              className="relative w-full max-w-md"
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-gray-900 p-6 sm:p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-1">Register</p>
                    <h2 className="text-xl font-bold text-white leading-snug">{webinar.title}</h2>
                    {webinar.subtitle && (
                      <p className="text-blue-300 text-sm mt-0.5">{webinar.subtitle}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-2">
                      📅 {formatDate(webinar.date)}{webinar.time ? ` · ${webinar.time}` : ""}
                    </p>
                  </div>
                  <button
                    onClick={() => setOpen(false)}
                    className="cursor-pointer ml-4 shrink-0 text-gray-500 hover:text-white transition-colors mt-1"
                    aria-label="Close registration form"
                  >
                    <CloseIcon />
                  </button>
                </div>
                <WebinarForm
                  webinarId={webinar.id}
                  webinarTitle={webinar.title}
                  qualifyingQuestion={webinar.qualifyingQuestion}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
