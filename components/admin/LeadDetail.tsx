"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Note = { id: string; content: string; type: string; createdBy: string | null; createdAt: string };
type Lead = {
  id: string; name: string; email: string; phone: string | null;
  company: string | null; leadSource: string; courseInterest: string | null;
  serviceInterest: string | null; qualifyingAnswer: string | null; message: string | null;
  photoUrl: string | null; leadScore: number; status: string; createdAt: string; notes: Note[];
  student?: { id: string } | null;
};

const STATUS_OPTIONS = ["new", "contacted", "enrolled", "closed"] as const;
const NOTE_TYPES = [
  { value: "note", label: "Note" },
  { value: "call", label: "Call log" },
  { value: "email", label: "Email sent" },
] as const;

const STATUS_STYLES: Record<string, string> = {
  new:       "bg-blue-500/15 text-blue-400 border-blue-500/30",
  contacted: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  enrolled:  "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  closed:    "bg-gray-500/15 text-gray-400 border-gray-500/30",
};

const NOTE_ICON: Record<string, string> = {
  call:  "📞",
  email: "✉️",
  note:  "📝",
};

const SOURCE_LABEL: Record<string, string> = {
  course_inquiry:       "Course Inquiry",
  webinar_registration: "Webinar",
  service_inquiry:      "Service",
  general_contact:      "General",
  discovery_call:       "Discovery Call",
};

export default function LeadDetail({ id }: { id: string }) {
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [noteContent, setNoteContent] = useState("");
  const [noteType, setNoteType] = useState<"note" | "call" | "email">("note");
  const [saving, setSaving] = useState(false);
  const [statusSaving, setStatusSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [savingStatus, setSavingStatus] = useState<string | null>(null);
  const router = useRouter();

  const fetchLead = useCallback(async () => {
    const res = await fetch(`/api/admin/leads/${id}`);
    const data = await res.json();
    setLead(data);
    setLoading(false);
  }, [id]);

  useEffect(() => { fetchLead(); }, [fetchLead]);

  async function handleStatusChange(status: string) {
    if (!lead) return;
    setStatusSaving(true);
    setSavingStatus(status);
    await fetch(`/api/admin/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setLead((prev) => prev ? { ...prev, status } : prev);
    setStatusSaving(false);
    setSavingStatus(null);
  }

  async function handleDelete() {
    setDeleting(true);
    await fetch(`/api/admin/leads/${id}`, { method: "DELETE" });
    router.push("/admin/leads");
  }

  async function handleAddNote(e: React.FormEvent) {
    e.preventDefault();
    if (!noteContent.trim()) return;
    setSaving(true);
    const res = await fetch(`/api/admin/leads/${id}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: noteContent, type: noteType }),
    });
    const note = await res.json();
    setLead((prev) => prev ? { ...prev, notes: [note, ...prev.notes] } : prev);
    setNoteContent("");
    setSaving(false);
  }

  if (loading) return <div className="p-8 text-gray-500">Loading…</div>;
  if (!lead) return <div className="p-8 text-red-400">Lead not found.</div>;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl">
      <Link href="/admin/leads" className="text-sm text-gray-400 hover:text-white transition-colors mb-6 inline-flex items-center gap-1.5">
        ← All leads
      </Link>

      <div className="grid lg:grid-cols-3 gap-6 mt-4">
        {/* Left — Contact info */}
        <div className="lg:col-span-1 space-y-4">
          {/* Name card */}
          <div className="rounded-2xl bg-gray-900 border border-white/5 p-6">
            <div className="flex items-center gap-3 mb-4">
              {lead.photoUrl ? (
                <img src={lead.photoUrl} alt={lead.name} className="h-12 w-12 shrink-0 rounded-full object-cover border border-white/10" />
              ) : (
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-purple-600 to-blue-600 text-white font-bold text-lg">
                  {lead.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <p className="font-bold text-white">{lead.name}</p>
                <p className="text-xs text-gray-400">{SOURCE_LABEL[lead.leadSource] ?? lead.leadSource}</p>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-300">
                <span className="text-gray-600 w-4">@</span>
                <a href={`mailto:${lead.email}`} className="hover:text-blue-400 transition-colors truncate">{lead.email}</a>
              </div>
              {lead.phone && (
                <div className="flex items-center gap-2 text-gray-300">
                  <span className="text-gray-600 w-4">📞</span>
                  <a href={`tel:${lead.phone}`} className="hover:text-blue-400 transition-colors">{lead.phone}</a>
                </div>
              )}
              {lead.company && (
                <div className="flex items-center gap-2 text-gray-300">
                  <span className="text-gray-600 w-4">🏢</span>
                  {lead.company}
                </div>
              )}
            </div>
          </div>

          {/* Score + Status */}
          <div className="rounded-2xl bg-gray-900 border border-white/5 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Lead Score</p>
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-purple-500/15 text-purple-400 font-bold">
                {lead.leadScore}
              </span>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Status</p>
              {lead.student ? (
                <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold capitalize ${STATUS_STYLES[lead.status]}`}>
                  {lead.status}
                </span>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {STATUS_OPTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(s)}
                      disabled={statusSaving || lead.status === s}
                      className={`cursor-pointer inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold capitalize transition-opacity ${STATUS_STYLES[s]} ${lead.status === s ? "opacity-100" : "opacity-40 hover:opacity-70"}`}
                    >
                      {savingStatus === s && (
                        <svg className="h-3 w-3 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                        </svg>
                      )}
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Converted banner */}
          {lead.student && (
            <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-sm text-emerald-400">
              <p className="font-semibold mb-1">Converted to student</p>
              <p className="text-emerald-500/80 text-xs mb-3">This lead is no longer active. Manage their enrollment and payment from the student profile.</p>
              <Link
                href={`/admin/students/${lead.student.id}`}
                className="inline-block rounded-lg bg-emerald-600/20 border border-emerald-500/30 px-4 py-2 text-xs font-semibold text-emerald-400 hover:bg-emerald-600/30 transition-colors"
              >
                View Student Profile →
              </Link>
            </div>
          )}

          {/* Delete — only for non-enrolled leads */}
          {!lead.student && (
            <div className="rounded-2xl bg-gray-900 border border-red-500/10 p-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Danger Zone</p>
              {confirmDelete ? (
                <div className="space-y-3">
                  <p className="text-sm text-gray-300">
                    Delete <span className="font-semibold text-white">{lead.name}</span>? This cannot be undone.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleDelete}
                      disabled={deleting}
                      className="cursor-pointer flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-50 px-4 py-2 text-sm font-semibold text-white transition-colors"
                    >
                      {deleting && (
                        <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                        </svg>
                      )}
                      {deleting ? "Deleting…" : "Yes, delete"}
                    </button>
                    <button
                      onClick={() => setConfirmDelete(false)}
                      disabled={deleting}
                      className="cursor-pointer flex-1 rounded-lg border border-gray-700 px-4 py-2 text-sm font-semibold text-gray-400 hover:text-white hover:border-gray-500 disabled:opacity-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="cursor-pointer w-full rounded-lg border border-red-500/30 px-4 py-2 text-sm font-semibold text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  Delete Lead
                </button>
              )}
            </div>
          )}

          {/* Interest */}
          {(lead.courseInterest || lead.serviceInterest || lead.qualifyingAnswer || lead.message) && (
            <div className="rounded-2xl bg-gray-900 border border-white/5 p-6 space-y-3 text-sm">
              {lead.courseInterest && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Course Interest</p>
                  <p className="text-gray-300">{lead.courseInterest}</p>
                </div>
              )}
              {lead.serviceInterest && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Service Interest</p>
                  <p className="text-gray-300">{lead.serviceInterest}</p>
                </div>
              )}
              {lead.qualifyingAnswer && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Qualifying Answer</p>
                  <p className="text-gray-300 italic">&ldquo;{lead.qualifyingAnswer}&rdquo;</p>
                </div>
              )}
              {lead.message && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Message</p>
                  <p className="text-gray-300">{lead.message}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right — Notes timeline */}
        <div className="lg:col-span-2 space-y-4">
          {/* Add note — hidden once converted to student */}
          {!lead.student && (
            <div className="rounded-2xl bg-gray-900 border border-white/5 p-6">
              <p className="text-sm font-semibold text-white mb-4">Log an interaction</p>
              <form onSubmit={handleAddNote} className="space-y-3">
                <div className="flex gap-2">
                  {NOTE_TYPES.map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setNoteType(value)}
                      className={`cursor-pointer rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors border ${
                        noteType === value
                          ? "bg-blue-600/20 text-blue-400 border-blue-500/40"
                          : "bg-gray-800 text-gray-400 border-gray-700 hover:text-white"
                      }`}
                    >
                      {NOTE_ICON[value]} {label}
                    </button>
                  ))}
                </div>
                <textarea
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  rows={3}
                  placeholder={noteType === "call" ? "What did you discuss?" : noteType === "email" ? "What email did you send?" : "Add a note…"}
                  className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#007dff] resize-none"
                />
                <button
                  type="submit"
                  disabled={saving || !noteContent.trim()}
                  className="cursor-pointer rounded-lg bg-[#007dff] hover:bg-[#007dff] disabled:opacity-40 px-5 py-2 text-sm font-semibold text-white transition-colors"
                >
                  {saving ? "Saving…" : "Save"}
                </button>
              </form>
            </div>
          )}

          {/* Notes list */}
          <div className="rounded-2xl bg-gray-900 border border-white/5 overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5">
              <p className="text-sm font-semibold text-white">Activity ({lead.notes.length})</p>
            </div>
            {lead.notes.length === 0 ? (
              <p className="px-6 py-8 text-sm text-gray-600 text-center">No activity yet. Log the first interaction above.</p>
            ) : (
              <ul className="divide-y divide-white/5">
                {lead.notes.map((note) => (
                  <li key={note.id} className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <span className="text-lg mt-0.5">{NOTE_ICON[note.type] ?? "📝"}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-200 whitespace-pre-wrap">{note.content}</p>
                        <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-500">
                          {note.createdBy && <span>{note.createdBy}</span>}
                          <span>·</span>
                          <span>{new Date(note.createdAt).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
