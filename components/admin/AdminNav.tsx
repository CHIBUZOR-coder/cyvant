"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const BASE_LINKS = [
  { href: "/admin/leads",    label: "Leads" },
  { href: "/admin/students", label: "Students" },
];

const ADMIN_LINKS = [
  { href: "/admin/team", label: "Team" },
];

export default function AdminNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAdmin = (session?.user as { role?: string })?.role === "admin";

  const links = isAdmin ? [...BASE_LINKS, ...ADMIN_LINKS] : BASE_LINKS;

  return (
    <aside className="w-56 shrink-0 bg-gray-900 border-r border-white/5 flex flex-col h-screen sticky top-0">
      <div className="px-6 py-6 border-b border-white/5">
        <p className="text-white font-bold text-lg">CYVANT</p>
        <p className="text-xs text-gray-500 mt-0.5">Admin Portal</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(({ href, label }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-blue-600/20 text-blue-400"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-white/5 space-y-1">
        {session?.user && (
          <div className="px-3 py-2 mb-1">
            <p className="text-xs font-semibold text-white truncate">{session.user.name}</p>
            <p className="text-[10px] text-gray-500 capitalize">{(session.user as { role?: string }).role}</p>
          </div>
        )}
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
