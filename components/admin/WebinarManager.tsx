"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import type { Webinar } from "@prisma/client";
import CyvantSpinner from "@/components/ui/CyvantSpinner";
import Pagination, { PAGE_SIZE } from "@/components/ui/Pagination";

interface Registration {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  qualifyingAnswer: string | null;
  createdAt: string;
}

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

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", {
    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

export default function WebinarManager({ initialWebinars }: { initialWebinars: Webinar[] }) {
  const [webinars, setWebinars] = useState<Webinar[]>(initialWebinars);
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");

  const [notifyCount, setNotifyCount] = useState<number | null>(null);
  const [notifyLeads, setNotifyLeads] = useState<{ id: string; name: string; email: string; createdAt: string }[]>([]);
  const [showNotifyLeads, setShowNotifyLeads] = useState(false);
  const [notifying, setNotifying] = useState(false);
  const [notifyResult, setNotifyResult] = useState<{ ok: boolean; msg: string } | null>(null);

  // Per-webinar registrant state
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [registrants, setRegistrants] = useState<Record<string, Registration[]>>({});
  const [loadingRegs, setLoadingRegs] = useState<string | null>(null);
  const [reminding, setReminding] = useState<string | null>(null);
  const [remindResult, setRemindResult] = useState<Record<string, { ok: boolean; msg: string }>>({});
  const [regCounts, setRegCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    fetch("/api/cyvant-hq/webinars/notify-all")
      .then((r) => r.json())
      .then((d) => {
        setNotifyCount(d.count ?? 0);
        setNotifyLeads(d.leads ?? []);
      })
      .catch(() => setNotifyCount(0));
  }, []);

  // Fetch registration counts for all webinars on mount
  useEffect(() => {
    async function loadCounts() {
      const counts: Record<string, number> = {};
      await Promise.allSettled(
        webinars.map(async (w) => {
          const res = await fetch(`/api/cyvant-hq/webinars/${w.id}/registrations`);
          if (res.ok) {
            const data: Registration[] = await res.json();
            counts[w.id] = data.length;
          }
        })
      );
      setRegCounts(counts);
    }
    if (webinars.length > 0) loadCounts();
  }, [webinars]);

  const fetchRegistrants = useCallback(async (webinarId: string) => {
    if (registrants[webinarId]) return;
    setLoadingRegs(webinarId);
    try {
      const res = await fetch(`/api/cyvant-hq/webinars/${webinarId}/registrations`);
      if (res.ok) {
        const data: Registration[] = await res.json();
        setRegistrants((prev) => ({ ...prev, [webinarId]: data }));
        setRegCounts((prev) => ({ ...prev, [webinarId]: data.length }));
      }
    } finally {
      setLoadingRegs(null);
    }
  }, [registrants]);

  function toggleExpand(webinarId: string) {
    if (expandedId === webinarId) {
      setExpandedId(null);
    } else {
      setExpandedId(webinarId);
      fetchRegistrants(webinarId);
    }
  }

  async function handleRemind(webinarId: string) {
    setReminding(webinarId);
    setRemindResult((prev) => { const n = { ...prev }; delete n[webinarId]; return n; });
    try {
      const res = await fetch(`/api/cyvant-hq/webinars/${webinarId}/remind`, { method: "POST" });
      const data = await res.json();
      setRemindResult((prev) => ({
        ...prev,
        [webinarId]: {
          ok: res.ok,
          msg: res.ok
            ? `Reminder sent to ${data.sent} registrant${data.sent !== 1 ? "s" : ""}.${data.failed ? ` (${data.failed} failed)` : ""}`
            : "Failed to send reminders.",
        },
      }));
    } catch {
      setRemindResult((prev) => ({ ...prev, [webinarId]: { ok: false, msg: "Failed to send reminders." } }));
    } finally {
      setReminding(null);
    }
  }

  async function handleNotifyAll() {
    if (!notifyCount) return;
    setNotifying(true);
    setNotifyResult(null);
    try {
      const res = await fetch("/api/cyvant-hq/webinars/notify-all", { method: "POST" });
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
      const res = await fetch("/api/cyvant-hq/webinars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, subtitle, date, time, description, qualifyingQuestion, registrationOpen, thumbnailImage }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed");
      const created: Webinar = await res.json();
      setWebinars((prev) => [created, ...prev]);
      setRegCounts((prev) => ({ ...prev, [created.id]: 0 }));
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
      await fetch(`/api/cyvant-hq/webinars/${id}`, { method: "DELETE" });
      setWebinars((prev) => prev.filter((w) => w.id !== id));
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="space-y-6">
      {(submitting || !!deleting || notifying || !!reminding) && <CyvantSpinner />}
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Notify All */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleNotifyAll}
              disabled={notifying || !notifyCount}
              className="cursor-pointer inline-flex items-center gap-2 rounded-lg border border-purple-500/40 bg-purple-500/10 px-4 py-2 text-sm font-semibold text-purple-300 hover:bg-purple-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-5-5.917V5a1 1 0 00-2 0v.083A6 6 0 006 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {notifyCount === null
                ? "Notify Interested Leads"
                : `Notify ${notifyCount} Interested Lead${notifyCount !== 1 ? "s" : ""}`}
            </button>
            <button
              onClick={() => setShowNotifyLeads((v) => !v)}
              className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-gray-800 px-3 py-2 text-xs font-medium text-gray-400 hover:text-white hover:border-white/20 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {showNotifyLeads ? "Hide list" : "View list"}
            </button>
          </div>
          {notifyResult && (
            <p className={`text-xs px-1 ${notifyResult.ok ? "text-green-400" : "text-red-400"}`}>
              {notifyResult.msg}
            </p>
          )}
        </div>

        <button
          onClick={() => { setShowForm((v) => !v); resetForm(); }}
          className="cursor-pointer rounded-lg bg-[#007dff] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0066d9] transition-colors"
        >
          {showForm ? "Cancel" : "+ Schedule Webinar"}
        </button>
      </div>

      {/* Interested leads list */}
      {showNotifyLeads && (
        <div className="rounded-xl border border-purple-500/20 bg-gray-900 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
            <p className="text-sm font-semibold text-purple-300">
              Interested Leads
              <span className="ml-2 rounded-full bg-purple-500/20 px-2 py-0.5 text-xs font-bold">{notifyLeads.length}</span>
            </p>
            <p className="text-xs text-gray-500">These people asked to be notified when a webinar opens</p>
          </div>
          {notifyLeads.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-gray-500">No one has signed up to be notified yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Name</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Email</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Signed Up</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {notifyLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-white/2 transition-colors">
                      <td className="px-4 py-3 text-white font-medium">{lead.name}</td>
                      <td className="px-4 py-3 text-gray-400">{lead.email}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {new Date(lead.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Create form */}
      {showForm && (
        <form onSubmit={handleCreate} className="rounded-xl bg-gray-800 border border-white/10 p-6 space-y-4">
          <h2 className="text-white font-semibold text-lg">New Webinar</h2>
          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Title *</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} required
                className="w-full rounded-md bg-gray-900 border border-white/10 px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#007dff]" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Subtitle</label>
              <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)}
                className="w-full rounded-md bg-gray-900 border border-white/10 px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#007dff]" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Date *</label>
              <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} required
                className="w-full rounded-md bg-gray-900 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-[#007dff]" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Display time (e.g. 6:00 PM WAT) *</label>
              <input value={time} onChange={(e) => setTime(e.target.value)} required placeholder="6:00 PM WAT"
                className="w-full rounded-md bg-gray-900 border border-white/10 px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#007dff]" />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3}
              className="w-full rounded-md bg-gray-900 border border-white/10 px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#007dff] resize-none" />
          </div>

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
              className="w-full rounded-md bg-gray-900 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-[#007dff]" />
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
              className="cursor-pointer flex items-center justify-center rounded-lg bg-[#007dff] px-5 py-2 text-sm font-semibold text-white hover:bg-[#0066d9] disabled:opacity-50 transition-colors">
              Save Webinar
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
        <>
        <div className="rounded-xl border border-white/10 bg-gray-900 divide-y divide-white/5 overflow-hidden">
          {webinars.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map((w) => {
            const { label, cls } = badge(w.date);
            const count = regCounts[w.id] ?? 0;
            const isExpanded = expandedId === w.id;
            const wRegistrants = registrants[w.id] ?? [];
            const remind = remindResult[w.id];

            return (
              <div key={w.id}>
                {/* Main row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-6 py-4">
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

                  <div className="flex items-center gap-2 flex-wrap shrink-0">
                    {/* Registrants toggle */}
                    <button
                      onClick={() => toggleExpand(w.id)}
                      className="cursor-pointer inline-flex items-center gap-1.5 rounded-md border border-white/10 px-3 py-1.5 text-xs font-medium text-gray-300 hover:bg-white/5 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5.916-3.506M9 20H4v-2a4 4 0 015.916-3.506M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      {count} registrant{count !== 1 ? "s" : ""}
                      <svg className={`w-3 h-3 transition-transform ${isExpanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Send Reminder */}
                    <button
                      onClick={() => handleRemind(w.id)}
                      disabled={reminding === w.id || count === 0}
                      className="cursor-pointer inline-flex items-center gap-1.5 rounded-md border border-blue-500/30 px-3 py-1.5 text-xs font-medium text-blue-400 hover:bg-blue-500/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Send Reminder
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(w.id)}
                      disabled={deleting === w.id}
                      className="cursor-pointer rounded-md border border-red-500/30 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/10 disabled:opacity-50 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Remind result feedback */}
                {remind && (
                  <div className={`px-4 sm:px-6 pb-3 text-xs ${remind.ok ? "text-green-400" : "text-red-400"}`}>
                    {remind.msg}
                  </div>
                )}

                {/* Expanded registrant list */}
                {isExpanded && (
                  <div className="border-t border-white/5 bg-gray-950/50 px-4 sm:px-6 py-4">
                    {loadingRegs === w.id ? (
                      <p className="text-gray-500 text-sm">Loading registrants…</p>
                    ) : wRegistrants.length === 0 ? (
                      <p className="text-gray-500 text-sm">No registrations yet.</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-left text-xs text-gray-500 border-b border-white/5">
                              <th className="pb-2 pr-4 font-medium">Name</th>
                              <th className="pb-2 pr-4 font-medium">Email</th>
                              <th className="pb-2 pr-4 font-medium hidden sm:table-cell">Phone</th>
                              <th className="pb-2 pr-4 font-medium hidden md:table-cell">Answer</th>
                              <th className="pb-2 font-medium hidden lg:table-cell">Registered</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {wRegistrants.map((r) => (
                              <tr key={r.id} className="text-gray-300">
                                <td className="py-2.5 pr-4 font-medium text-white">{r.name}</td>
                                <td className="py-2.5 pr-4">
                                  <a href={`mailto:${r.email}`} className="text-blue-400 hover:underline">{r.email}</a>
                                </td>
                                <td className="py-2.5 pr-4 hidden sm:table-cell text-gray-400">{r.phone ?? "—"}</td>
                                <td className="py-2.5 pr-4 hidden md:table-cell text-gray-400 max-w-xs truncate" title={r.qualifyingAnswer ?? ""}>{r.qualifyingAnswer ?? "—"}</td>
                                <td className="py-2.5 hidden lg:table-cell text-gray-500 text-xs">{formatDateTime(r.createdAt)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <Pagination page={page} total={webinars.length} onChange={setPage} />
        </>
      )}
    </div>
  );
}
