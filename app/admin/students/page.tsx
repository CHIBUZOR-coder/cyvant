import type { Metadata } from "next";
import StudentsTable from "@/components/admin/StudentsTable";

export const metadata: Metadata = { title: "Students — CYVANT Admin" };

export default function StudentsPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Students</h1>
        <p className="text-gray-400 mt-1 text-sm">Enrolled students across all courses.</p>
      </div>
      <StudentsTable />
    </div>
  );
}
