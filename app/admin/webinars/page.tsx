import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import WebinarManager from "@/components/admin/WebinarManager";

export const metadata: Metadata = { title: "Webinars — CYVANT Admin" };
export const dynamic = "force-dynamic";

export default async function AdminWebinarsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const webinars = await db.webinar.findMany({ orderBy: { date: "desc" } });

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-5 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-white">Webinars</h1>
        <p className="text-gray-400 mt-1 text-sm">Schedule and manage live webinar sessions.</p>
      </div>
      <WebinarManager initialWebinars={webinars} />
    </div>
  );
}
