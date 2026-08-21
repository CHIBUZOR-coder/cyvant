export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import ServiceManager from "@/components/admin/ServiceManager";

export const metadata = { title: "Services: CYVANT Admin" };

export default async function AdminServicesPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const services = await db.service.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Services</h1>
        <p className="text-sm text-gray-400 mt-1">Manage the services displayed on the public site.</p>
      </div>
      <ServiceManager initialServices={services} />
    </div>
  );
}
