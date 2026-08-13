interface BlockProps {
  className?: string;
  dark?: boolean;
}

export function Sk({ className = "", dark = false }: BlockProps) {
  return <div className={`rounded ${dark ? "skeleton-dark" : "skeleton"} ${className}`} />;
}

export function SkHero() {
  return (
    <section className="bg-slate-900 px-6 py-24 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Sk dark className="h-3 w-20 mb-6" />
        <Sk dark className="h-9 w-3/4 mb-3" />
        <Sk dark className="h-9 w-1/2 mb-8" />
        <Sk dark className="h-4 w-full mb-2" />
        <Sk dark className="h-4 w-4/5" />
      </div>
    </section>
  );
}

export function SkCard({ dark = false }: { dark?: boolean }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
      <Sk dark={dark} className="h-3 w-20 mb-4" />
      <Sk dark={dark} className="h-5 w-3/4 mb-4" />
      <div className="space-y-2 mb-6">
        <Sk dark={dark} className="h-3 w-full" />
        <Sk dark={dark} className="h-3 w-5/6" />
        <Sk dark={dark} className="h-3 w-4/6" />
      </div>
      <div className="pt-5 border-t border-gray-100">
        <Sk dark={dark} className="h-9 w-full rounded-lg" />
      </div>
    </div>
  );
}

export function SkGrid({ count = 3, cols = 3 }: { count?: number; cols?: number }) {
  const colClass =
    cols === 2 ? "sm:grid-cols-2" : cols === 3 ? "sm:grid-cols-2 lg:grid-cols-3" : "";
  return (
    <ul className={`grid ${colClass} gap-6`}>
      {Array.from({ length: count }).map((_, i) => (
        <li key={i}>
          <SkCard />
        </li>
      ))}
    </ul>
  );
}
