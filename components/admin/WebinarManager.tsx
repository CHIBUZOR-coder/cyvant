"use client";

import { useRef, useState, useEffect } from "react";
import type { Webinar } from "@prisma/client";

function badge(date: Date) {
  return date >= new Date()
    ? { label: "Upcoming", cls: "bg-blue-500/20 text-blue-300" }
    : { label: "Past", cls: "bg-gray-700 text-gray-400" };
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-NG", {
    day: "numeric", month: "short", year: "numeric",
  });
}

export default function WebinarManager({ initialWebinars }: { initialWebinars: Webinar[] }) {
  const [webinars, setWebinars] = useState<Webinar[]>(initialWebinars);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");

  const [notifyCount, setNotifyCount] = useState<number | null>(null);
  const [notifying, setNotifying] = useState(false);
  const [notifyResult, setNotifyResult] = useState<{ ok: boolean; msg: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/webinars/notify-all")
      .then((r) => r.json())
      .then((d) => setNotifyCount(d.count ?? 0))
      .catch(() => setNotifyCount(0));
  }, []);

  async function handleNotifyAll() {
    if (!notifyCount) return;
    setNotifying(true);
    setNotifyResult(null);
    try {
      const res = await fetch("/api/admin/webinars/notify-all", { method: "POST" });
      const data = await res.json();
      setNotifyResult({ ok: true, msg: `Notified ${data.notified} lead${data.notified !== 1 ? "s" : ""}.${data.failed ? ` (${data.failed} failed)` : ""}` });
    } catch {
      setNotifyResult({ ok: false, msg: "Failed to send notifications. Try again." });
    } finally {
      setNotifying(false);
    }
  }

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [qualifyingQuestion, setQualifyingQuestion] = useState("What's pulling you toward cybersecurity or AI?");
  const [registrationOpen, setRegistrationOpen] = useState(true);
  const [flier, setFlier] = useState<File | null>(null);
  const [flierPreview, setFlierPreview] = useState<string | null>(null);
  const flierRef = useRef<HTMLInputElement>(null);

  function handleFlierChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setFlier(file);
    setFlierPreview(file ? URL.createObjectURL(file) : null);
  }

  async function uploadFlier(): Promise<string | undefined> {
    if (!flier) return undefined;
    const fd = new FormData();
    fd.append("file", flier);
    fd.append("folder", "webinars");
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    if (!res.ok) throw new Error("Flier upload failed.");
    const { url } = await res.json();
    return url;
  }

  function resetForm() {
    setTitle(""); setSubtitle(""); setDate(""); setTime("");
    setDescription(""); setQualifyingQuestion("What's pulling you toward cybersecurity or AI?");
    setRegistrationOpen(true); setFlier(null); setFlierPreview(null); setError("");
    if (flierRef.current) flierRef.current.value = "";
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !date || !time.trim()) {
      setError("Title, date, and time are required.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const thumbnailImage = await uploadFlier();
      const res = await fetch("/api/admin/webinars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, subtitle, date, time, description, qualifyingQuestion, registrationOpen, thumbnailImage }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed");
      const created: Webinar = await res.json();
      setWebinars((prev) => [created, ...prev]);
      resetForm();
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this webinar? This cannot be undone.")) return;
    setDeleting(id);
    try {
      await fetch(`/api/admin/webinars/${id}`, { method: "DELETE" });
      setWebinars((prev) => prev.filter((w) => w.id !== id));
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Notify All */}
        <div className="flex flex-col gap-1">
          <button
            onClick={handleNotifyAll}
            disabled={notifying || !notifyCount}
            className="cursor-pointer inline-flex items-center gap-2 rounded-lg border border-purple-500/40 bg-purple-500/10 px-4 py-2 text-sm font-semibold text-purple-300 hover:bg-purple-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-5-5.917V5a1 1 0 00-2 0v.083A6 6 0 006 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {notifying
              ? "Sending…"
              : notifyCount === null
              ? "Notify Interested Leads"
              : `Notify ${notifyCount} Interested Lead${notifyCount !== 1 ? "s" : ""}`}
          </button>
          {notifyResult && (
            <p className={`text-xs px-1 ${notifyResult.ok ? "text-green-400" : "text-red-400"}`}>
              {notifyResult.msg}
            </p>
          )}
        </div>

        <button
          onClick={() => { setShowForm((v) => !v); resetForm(); }}
          className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
        >
          {showForm ? "Cancel" : "+ Schedule Webinar"}
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <form onSubmit={handleCreate} className="rounded-xl bg-gray-800 border border-white/10 p-6 space-y-4">
          <h2 className="text-white font-semibold text-lg">New Webinar</h2>
          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Title *</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} required
                className="w-full rounded-md bg-gray-900 border border-white/10 px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Subtitle</label>
              <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)}
                className="w-full rounded-md bg-gray-900 border border-white/10 px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Date *</label>
              <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} required
                className="w-full rounded-md bg-gray-900 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Display time (e.g. 6:00 PM WAT) *</label>
              <input value={time} onChange={(e) => setTime(e.target.value)} required placeholder="6:00 PM WAT"
                className="w-full rounded-md bg-gray-900 border border-white/10 px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3}
              className="w-full rounded-md bg-gray-900 border border-white/10 px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none" />
          </div>

          {/* Flier image */}
          <div>
            <label className="block text-xs text-gray-400 mb-1">Webinar flier / banner image</label>
            <div className="flex items-center gap-4">
              {flierPreview && (
                <img src={flierPreview} alt="Flier preview" className="h-20 w-32 rounded-lg object-cover border border-white/10 shrink-0" />
              )}
              <div>
                <input ref={flierRef} type="file" accept="image/*" onChange={handleFlierChange} className="hidden" id="flier-upload" />
                <label htmlFor="flier-upload"
                  className="inline-block cursor-pointer rounded-md border border-gray-600 px-4 py-2 text-sm text-gray-400 hover:border-blue-400 hover:text-blue-400 transition-colors">
                  {flier ? "Change image" : "Upload flier"}
                </label>
                {flier && (
                  <button type="button" onClick={() => { setFlier(null); setFlierPreview(null); if (flierRef.current) flierRef.current.value = ""; }}
                    className="cursor-pointer ml-3 text-xs text-gray-500 hover:text-red-400 transition-colors">Remove</button>
                )}
                <p className="mt-1 text-xs text-gray-600">JPG, PNG or WebP · max 5 MB</p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Qualifying question</label>
            <input value={qualifyingQuestion} onChange={(e) => setQualifyingQuestion(e.target.value)}
              className="w-full rounded-md bg-gray-900 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
            <input type="checkbox" checked={registrationOpen} onChange={(e) => setRegistrationOpen(e.target.checked)}
              className="rounded border-gray-600" />
            Registration open
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => { setShowForm(false); resetForm(); }}
              className="cursor-pointer px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">Cancel</button>
            <button type="submit" disabled={submitting}
              className="cursor-pointer rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50 transition-colors">
              {submitting ? "Saving…" : "Save Webinar"}
            </button>
          </div>
        </form>
      )}

      {/* List */}
      {webinars.length === 0 ? (
        <div className="rounded-xl border border-white/5 bg-gray-900 p-12 text-center">
          <p className="text-gray-400">No webinars scheduled yet.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-white/10 bg-gray-900 divide-y divide-white/5 overflow-hidden">
          {webinars.map((w) => {
            const { label, cls } = badge(w.date);
            return (
              <div key={w.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-6 py-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-white font-semibold truncate">{w.title}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cls}`}>{label}</span>
                    {!w.registrationOpen && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-yellow-500/20 text-yellow-300">Reg. closed</span>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm mt-0.5">{formatDate(w.date)} · {w.time}</p>
                  {w.subtitle && <p className="text-gray-500 text-xs mt-0.5 truncate">{w.subtitle}</p>}
                </div>
                <button
                  onClick={() => handleDelete(w.id)}
                  disabled={deleting === w.id}
                  className="cursor-pointer shrink-0 rounded-md border border-red-500/30 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/10 disabled:opacity-50 transition-colors"
                >
                  {deleting === w.id ? "Deleting…" : "Delete"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
