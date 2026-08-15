import type { Metadata } from "next";
import LeadDetail from "@/components/admin/LeadDetail";

export const metadata: Metadata = { title: "Lead Detail" };

export default function LeadDetailPage({ params }: { params: { id: string } }) {
  return <LeadDetail id={params.id} />;
}
