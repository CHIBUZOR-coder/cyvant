"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import ThemeToggle from "@/components/ui/ThemeToggle";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/courses", label: "Courses" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-950 shadow-sm dark:shadow-none">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center font-bold text-xl tracking-tight">
          <span className="text-slate-900 dark:text-white">CY</span><span className="text-blue-700">VANT</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {NAV_LINKS.filter(({ href }) => href !== "/contact").map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                pathname === href
                  ? "text-blue-700 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20"
                  : "text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
              aria-current={pathname === href ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          {/* Secondary CTA */}
          <Link
            href="/contact"
            className="hidden sm:inline-flex rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm font-medium text-slate-600 dark:text-gray-300 hover:border-blue-300 hover:text-blue-700 dark:hover:border-blue-500 dark:hover:text-blue-400 transition-colors"
          >
            Book a Call
          </Link>
          {/* Primary CTA */}
          <Link
            href="/courses"
            className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 transition-colors shadow-sm"
          >
            Explore Courses
          </Link>

          {/* Hamburger */}
          <button
            type="button"
            className="md:hidden rounded-md p-2 text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
            {menuOpen ? (
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
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav
          className="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-slate-950 px-4 pb-4 pt-2"
          aria-label="Mobile navigation"
        >
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`block py-2.5 px-3 rounded-md text-sm font-medium transition-colors ${
                pathname === href
                  ? "text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                  : "text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
              aria-current={pathname === href ? "page" : undefined}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
            <Link
              href="/contact"
              className="block w-full rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-2.5 text-center text-sm font-medium text-slate-600 dark:text-gray-300 hover:border-blue-300 hover:text-blue-700 dark:hover:border-blue-500 dark:hover:text-blue-400 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Book a Call
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
