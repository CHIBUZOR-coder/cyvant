"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Note {
  id: string;
  content: string;
  type: string;
  createdAt: string;
}

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  courseName: string;
  cohort: string | null;
  startDate: string | null;
  paymentStatus: string;
  amountPaid: number;
  notes: string | null;
  enrolledAt: string;
  lead: {
    id: string;
    leadSource: string;
    status: string;
    notes: Note[];
  };
}

const PAYMENT_COLORS: Record<string, string> = {
  pending: "bg-yellow-500/15 text-yellow-400",
  partial: "bg-blue-500/15 text-blue-400",
  paid:    "bg-emerald-500/15 text-emerald-400",
};

export default function StudentDetail({ id }: { id: string }) {
  const [student, setStudent] = useState<Student | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    cohort: "",
    startDate: "",
    paymentStatus: "pending",
    amountPaid: "",
    notes: "",
  });

  useEffect(() => {
    fetch(`/api/admin/students/${id}`)
      .then((r) => r.json())
      .then((data: Student) => {
        setStudent(data);
        setForm({
          cohort: data.cohort ?? "",
          startDate: data.startDate ? data.startDate.slice(0, 10) : "",
          paymentStatus: data.paymentStatus,
          amountPaid: data.amountPaid > 0 ? String(data.amountPaid) : "",
          notes: data.notes ?? "",
        });
      });
  }, [id]);

  const save = async () => {
    setSaving(true);
    await fetch(`/api/admin/students/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cohort: form.cohort || null,
        startDate: form.startDate || null,
        paymentStatus: form.paymentStatus,
        amountPaid: form.amountPaid ? Number(form.amountPaid) : 0,
        notes: form.notes || null,
      }),
    });
    setSaving(false);
  };

  if (!student) return <p className="text-gray-500 text-sm py-10 text-center">Loading...</p>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">{student.name}</h1>
          <p className="text-gray-400 mt-1 text-sm">{student.email}{student.phone ? ` · ${student.phone}` : ""}</p>
        </div>
        <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${PAYMENT_COLORS[student.paymentStatus]}`}>
          Payment: {student.paymentStatus}
        </span>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left — editable fields */}
        <div className="lg:col-span-2 space-y-5">
          <div className="rounded-xl border border-gray-700 bg-gray-900 p-6 space-y-4">
            <h2 className="text-sm font-semibold text-white">Enrollment Details</h2>

            <div>
              <p className="text-xs text-gray-500 mb-1">Course</p>
              <p className="text-white font-medium">{student.courseName}</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Cohort</label>
                <input
                  value={form.cohort}
                  onChange={(e) => setForm({ ...form, cohort: e.target.value })}
                  placeholder="e.g. Q3 2025"
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Payment Status</label>
                <select
                  value={form.paymentStatus}
                  onChange={(e) => setForm({ ...form, paymentStatus: e.target.value })}
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="pending">Pending</option>
                  <option value="partial">Partial</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Amount Paid (₦)</label>
                <input
                  type="number"
                  value={form.amountPaid}
                  onChange={(e) => setForm({ ...form, amountPaid: e.target.value })}
                  placeholder="0"
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Internal Notes</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={3}
                placeholder="Any notes about this student..."
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
              />
            </div>

            <button
              onClick={save}
              disabled={saving}
              className="cursor-pointer rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        {/* Right — meta + lead activity */}
        <div className="space-y-5">
          <div className="rounded-xl border border-gray-700 bg-gray-900 p-5 space-y-3">
            <h2 className="text-sm font-semibold text-white">Info</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Enrolled</span>
                <span className="text-gray-300">{new Date(student.enrolledAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Source</span>
                <span className="text-gray-300">{student.lead.leadSource.replace(/_/g, " ")}</span>
              </div>
            </div>
            <Link
              href={`/admin/leads/${student.lead.id}`}
              className="block mt-3 text-xs text-blue-400 hover:text-blue-300"
            >
              View original lead →
            </Link>
          </div>

          {/* Lead activity timeline */}
          {student.lead.notes.length > 0 && (
            <div className="rounded-xl border border-gray-700 bg-gray-900 p-5">
              <h2 className="text-sm font-semibold text-white mb-4">Lead Activity</h2>
              <ul className="space-y-3">
                {student.lead.notes.slice(0, 5).map((note) => (
                  <li key={note.id} className="flex gap-3">
                    <div className="mt-1.5 h-2 w-2 rounded-full bg-blue-500 shrink-0" />
                    <div>
                      <p className="text-sm text-gray-300">{note.content}</p>
                      <p className="text-xs text-gray-600 mt-0.5">
                        {new Date(note.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
