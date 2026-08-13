import Link from "next/link";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/courses", label: "Courses" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/faq", label: "FAQ" },
];

const LEGAL_LINKS = [
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-3">
          {/* Brand */}
          <div className="sm:col-span-1">
            <Link href="/" className="text-2xl font-bold text-white tracking-tight">
              CYVANT
            </Link>
            <p className="mt-4 text-sm leading-6">
              AI and cybersecurity education built for Africa, ready for the world.
            </p>
            <p className="mt-4 text-xs text-gray-600">
              © {new Date().getFullYear()} CYVANT. All rights reserved.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">
              Navigate
            </p>
            <ul className="space-y-3">
              {NAV_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Legal */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">
              Get in Touch
            </p>
            <ul className="space-y-3">
              {LEGAL_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/courses"
                  className="inline-block mt-2 rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 transition-colors"
                >
                  Explore Courses →
                </Link>
              </li>
            </ul>
            <p className="mt-8 text-xs text-gray-600 leading-5">
              Data handled in accordance with the Nigerian Data Protection Regulation (NDPR).
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
