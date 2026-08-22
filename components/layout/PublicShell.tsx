"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WebinarBanner from "@/components/ui/WebinarBanner";

export default function PublicShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (pathname.startsWith("/cyvant-hq")) {
    return <>{children}</>;
  }

  return (
    <>
      <WebinarBanner />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
