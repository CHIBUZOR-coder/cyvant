import type { Metadata } from "next";
import LeadsTable from "@/components/admin/LeadsTable";

export const metadata: Metadata = { title: "Leads" };

export default function AdminLeadsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-5 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-white">Leads</h1>
        <p className="text-sm text-gray-400 mt-1">All form submissions from the CYVANT website</p>
      </div>
      <LeadsTable />
    </div>
  );
}
