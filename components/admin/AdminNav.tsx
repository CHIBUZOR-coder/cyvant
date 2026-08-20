"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";

const BASE_LINKS = [
  { href: "/admin/leads",    label: "Leads" },
  { href: "/admin/students", label: "Students" },
  { href: "/admin/webinars", label: "Webinars" },
  { href: "/admin/courses",  label: "Courses" },
  { href: "/admin/services", label: "Services" },
];

const ADMIN_LINKS = [
  { href: "/admin/team", label: "Team" },
];

export default function AdminNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAdmin = (session?.user as { role?: string })?.role === "admin";
  const links = isAdmin ? [...BASE_LINKS, ...ADMIN_LINKS] : BASE_LINKS;
  const [open, setOpen] = useState(false);

  const navLink = (href: string, label: string) => {
    const active = pathname.startsWith(href);
    return (
      <Link
        key={href}
        href={href}
        onClick={() => setOpen(false)}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
          active
            ? "bg-blue-600/20 text-blue-400"
            : "text-gray-400 hover:bg-gray-800 hover:text-white"
        }`}
      >
        {label}
      </Link>
    );
  };

  const userBlock = (
    <div className="px-3 py-4 border-t border-white/5 space-y-1">
      {session?.user && (
        <div className="px-3 py-2 mb-1">
          <p className="text-xs font-semibold text-white truncate">{session.user.name}</p>
          <p className="text-[10px] text-gray-500 capitalize">{(session.user as { role?: string }).role}</p>
        </div>
      )}
      <Link
        href="/"
        onClick={() => setOpen(false)}
        className="cursor-pointer w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
      >
        ← Home
      </Link>
      <button
        onClick={() => signOut({ callbackUrl: "/admin/login" })}
        className="cursor-pointer w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
      >
        Sign out
      </button>
    </div>
  );

  return (
    <>
      {/* ── Mobile top bar ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-gray-900 border-b border-white/5 flex items-center justify-between px-4">
        <Link href="/admin/leads" className="font-bold text-white text-base">
          CY<span className="text-[#007dff]">VANT</span>
          <span className="text-xs font-normal text-gray-500 ml-2">Admin</span>
        </Link>
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="cursor-pointer rounded-md p-2 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
        >
          {open ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          )}
        </button>
      </div>

      {/* ── Mobile drawer overlay ── */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative w-64 bg-gray-900 border-r border-white/5 flex flex-col h-full">
            <div className="px-6 py-5 border-b border-white/5">
              <p className="text-white font-bold text-lg">CYVANT</p>
              <p className="text-xs text-gray-500 mt-0.5">Admin Portal</p>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1">
              {links.map(({ href, label }) => navLink(href, label))}
            </nav>
            {userBlock}
          </div>
        </div>
      )}

      {/* ── Desktop sidebar ── */}
      <aside className="hidden md:flex w-56 shrink-0 bg-gray-900 border-r border-white/5 flex-col h-screen sticky top-0">
        <div className="px-6 py-6 border-b border-white/5">
          <p className="text-white font-bold text-lg">CYVANT</p>
          <p className="text-xs text-gray-500 mt-0.5">Admin Portal</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {links.map(({ href, label }) => navLink(href, label))}
        </nav>
        {userBlock}
      </aside>
    </>
  );
}
