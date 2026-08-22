import type { Metadata } from "next";
import Link from "next/link";
import StudentDetail from "@/components/admin/StudentDetail";

export const metadata: Metadata = { title: "Student Profile: CYVANT Admin" };

export default async function StudentProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Link href="/cyvant-hq/students" className="text-sm text-gray-500 hover:text-gray-300 mb-6 inline-block">
        ← Back to Students
      </Link>
      <StudentDetail id={id} />
    </div>
  );
}
