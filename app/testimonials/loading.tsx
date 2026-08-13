import { Sk, SkHero } from "@/components/ui/Skeleton";

export default function TestimonialsLoading() {
  return (
    <div className="bg-white">
      <SkHero />

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <li key={i} className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
              {/* Avatar + name */}
              <div className="flex items-center gap-3 mb-5">
                <Sk className="w-11 h-11 rounded-xl shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Sk className="h-3.5 w-28" />
                  <Sk className="h-3 w-20" />
                  <Sk className="h-3 w-16" />
                </div>
              </div>
              {/* Outcome label */}
              <Sk className="h-2.5 w-16 mb-2" />
              {/* Outcome box */}
              <div className="rounded-lg bg-gray-50 px-3 py-2 mb-4 space-y-1.5">
                <Sk className="h-3 w-full" />
                <Sk className="h-3 w-4/5" />
              </div>
              {/* Quote */}
              <div className="border-l-2 border-gray-200 pl-3 space-y-1.5">
                <Sk className="h-3 w-full" />
                <Sk className="h-3 w-5/6" />
                <Sk className="h-3 w-3/4" />
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
