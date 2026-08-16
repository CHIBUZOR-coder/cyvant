import type { ReactNode } from "react";
import AdminNav from "@/components/admin/AdminNav";
import SessionWrapper from "@/components/admin/SessionWrapper";

export const metadata = { title: { default: "Admin | CYVANT", template: "%s | Admin" } };

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <SessionWrapper>
      <div className="min-h-screen bg-gray-950 flex">
        <AdminNav />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </SessionWrapper>
  );
}
