"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import ThemeToggle from "@/components/ui/ThemeToggle";

const NAV_LINKS = [
  { href: "/", label: "Home", sectionId: "home" },
  { href: "/#about", label: "About", sectionId: "about" },
  { href: "/#services", label: "Services", sectionId: "services" },
  { href: "/#courses", label: "Courses", sectionId: "courses" },
  { href: "/#testimonials", label: "Testimonials", sectionId: "testimonials" },
  { href: "/#faq", label: "FAQ", sectionId: "faq" },
  { href: "/contact", label: "Contact", sectionId: null },
];

const SECTION_IDS = NAV_LINKS.map((l) => l.sectionId).filter(Boolean) as string[];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    if (pathname !== "/") return;

    const handleScroll = () => {
      const navHeight = 80;
      let current = "home";

      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= navHeight) {
          current = id;
        }
      }

      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const isLinkActive = (href: string, sectionId: string | null) => {
    if (pathname !== "/") return pathname === href;
    if (sectionId === null) return false;
    return activeSection === sectionId;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-950 shadow-sm dark:shadow-none">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center font-bold text-xl tracking-tight">
          <span className="text-slate-900 dark:text-white">CY</span><span className="text-blue-700">VANT</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {NAV_LINKS.filter(({ href }) => href !== "/contact").map(({ href, label, sectionId }) => {
            const active = isLinkActive(href, sectionId);
            return (
              <Link
                key={href}
                href={href}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  active
                    ? "text-blue-700 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20"
                    : "text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
                aria-current={active ? "page" : undefined}
              >
                {label}
              </Link>
            );
          })}
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
            href="/#courses"
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
          {NAV_LINKS.map(({ href, label, sectionId }) => {
            const active = isLinkActive(href, sectionId);
            return (
              <Link
                key={href}
                href={href}
                className={`block py-2.5 px-3 rounded-md text-sm font-medium transition-colors ${
                  active
                    ? "text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                    : "text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
                aria-current={active ? "page" : undefined}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            );
          })}
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
