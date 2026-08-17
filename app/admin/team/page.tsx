import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import type { Metadata } from "next";
import TeamManager from "@/components/admin/TeamManager";

export const metadata: Metadata = { title: "Team — CYVANT Admin" };

export default async function TeamPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string })?.role;

  if (role !== "admin") redirect("/admin/leads");

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-5 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-white">Team</h1>
        <p className="text-gray-400 mt-1 text-sm">Manage who has access to the admin portal.</p>
      </div>
      <TeamManager />
    </div>
  );
}
