"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  leadSource: string;
  courseInterest: string | null;
  leadScore: number;
  status: string;
  createdAt: string;
  _count: { notes: number };
};

const TAKE = 50;

const STATUS_STYLES: Record<string, string> = {
  new:       "bg-blue-500/15 text-blue-400 border-blue-500/30",
  contacted: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  enrolled:  "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  closed:    "bg-gray-500/15 text-gray-400 border-gray-500/30",
};

const SOURCE_LABEL: Record<string, string> = {
  course_inquiry:       "Course Inquiry",
  webinar_registration: "Webinar",
  webinar_notify:       "Webinar Notify",
  service_inquiry:      "Service",
  general_contact:      "General",
  discovery_call:       "Discovery Call",
};

export default function LeadsTable() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [source, setSource] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (source) params.set("source", source);
    if (status) params.set("status", status);
    params.set("page", String(page));
    const res = await fetch(`/api/cyvant-hq/leads?${params}`);
    const json = await res.json();
    setLeads(json.data);
    setTotal(json.total);
    setLoading(false);
  }, [q, source, status, page]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  function handleQ(value: string) { setQ(value); setPage(0); }
  function handleSource(value: string) { setSource(value); setPage(0); }
  function handleStatus(value: string) { setStatus(value); setPage(0); }

  const pages = Math.ceil(total / TAKE);
  const from = total === 0 ? 0 : page * TAKE + 1;
  const to = Math.min((page + 1) * TAKE, total);

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-6">
        <input
          type="search"
          placeholder="Search name, email, course…"
          value={q}
          onChange={(e) => handleQ(e.target.value)}
          className="rounded-lg bg-gray-800 border border-gray-700 px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#007dff] w-full sm:w-64"
        />
        <select
          value={source}
          onChange={(e) => handleSource(e.target.value)}
          className="rounded-lg bg-gray-800 border border-gray-700 px-4 py-2 text-sm text-white focus:outline-none focus:border-[#007dff] w-full sm:w-auto"
        >
          <option value="">All sources</option>
          {Object.entries(SOURCE_LABEL).map(([val, label]) => (
            <option key={val} value={val}>{label}</option>
          ))}

        </select>
        <select
          value={status}
          onChange={(e) => handleStatus(e.target.value)}
          className="rounded-lg bg-gray-800 border border-gray-700 px-4 py-2 text-sm text-white focus:outline-none focus:border-[#007dff] w-full sm:w-auto"
        >
          <option value="">All statuses</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="enrolled">Enrolled</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/5 overflow-x-auto">
        <table className="w-full text-sm min-w-160">
          <thead>
            <tr className="bg-gray-900 border-b border-white/5 text-left">
              <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-widest">Name</th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-widest">Source</th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-widest">Course</th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-widest">Score</th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-widest">Status</th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-widest">Date</th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-widest">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-gray-500">Loading…</td>
              </tr>
            ) : leads.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-gray-500">No leads found</td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr key={lead.id} className="bg-gray-900/50 hover:bg-gray-800/60 transition-colors">
                  <td className="px-5 py-4">
                    <Link href={`/cyvant-hq/leads/${lead.id}`} className="hover:text-blue-400 transition-colors">
                      <p className="font-medium text-white">{lead.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{lead.email}</p>
                      {lead.phone && <p className="text-xs text-gray-500">{lead.phone}</p>}
                    </Link>
                  </td>
                  <td className="px-5 py-4 text-gray-400">
                    {SOURCE_LABEL[lead.leadSource] ?? lead.leadSource}
                  </td>
                  <td className="px-5 py-4 text-gray-300 max-w-40 truncate">
                    {lead.courseInterest || <span className="text-gray-600">—</span>}
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-500/15 text-purple-400 text-xs font-bold">
                      {lead.leadScore}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLES[lead.status] ?? STATUS_STYLES.new}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-400 text-xs">
                    {new Date(lead.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-5 py-4 text-gray-400 text-xs">
                    {lead._count.notes}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
        <p>
          {total === 0
            ? "No leads"
            : `Showing ${from}–${to} of ${total} lead${total !== 1 ? "s" : ""}`}
        </p>
        {pages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 0}
              className="cursor-pointer px-3 py-1.5 rounded bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              ← Prev
            </button>
            <span className="text-gray-400 px-1">
              {page + 1} / {pages}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page + 1 >= pages}
              className="cursor-pointer px-3 py-1.5 rounded bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
