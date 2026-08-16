"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

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
  enrolledAt: string;
}

const PAYMENT_COLORS: Record<string, string> = {
  pending: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30",
  partial: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
  paid:    "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
};

export default function StudentsTable() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (paymentFilter) params.set("paymentStatus", paymentFilter);
    const res = await fetch(`/api/admin/students?${params}`);
    const data = await res.json();
    setStudents(data);
    setLoading(false);
  }, [q, paymentFilter]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          type="search"
          placeholder="Search name, email or course..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 w-64"
        />
        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          <option value="">All payments</option>
          <option value="pending">Pending</option>
          <option value="partial">Partial</option>
          <option value="paid">Paid</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-gray-500 text-sm py-10 text-center">Loading...</p>
      ) : students.length === 0 ? (
        <p className="text-gray-500 text-sm py-10 text-center">No students found.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-700">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-800 text-gray-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Course</th>
                <th className="px-4 py-3">Cohort</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Amount Paid</th>
                <th className="px-4 py-3">Enrolled</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {students.map((s) => (
                <tr key={s.id} className="bg-gray-900 hover:bg-gray-800/60 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-white">{s.name}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{s.email}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-300">{s.courseName}</td>
                  <td className="px-4 py-3 text-gray-400">{s.cohort ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${PAYMENT_COLORS[s.paymentStatus] ?? ""}`}>
                      {s.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    {s.amountPaid > 0 ? `₦${s.amountPaid.toLocaleString("en-NG")}` : "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {new Date(s.enrolledAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/students/${s.id}`}
                      className="text-blue-400 hover:text-blue-300 text-xs font-medium"
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
