export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import PartnerManager from "@/components/admin/PartnerManager";

export const metadata = { title: "Partners: CYVANT Admin" };

export default async function AdminPartnersPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/cyvant-hq/login");

  const partners = await db.partner.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Partner Organisations</h1>
        <p className="text-sm text-gray-400 mt-1">
          Manage the organisations shown in the &quot;Trusted by&quot; section on the home page.
        </p>
      </div>
      <PartnerManager initialPartners={partners} />
    </div>
  );
}
