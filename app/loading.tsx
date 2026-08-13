import { Sk, SkHero, SkGrid } from "@/components/ui/Skeleton";

export default function HomeLoading() {
  return (
    <div>
      <SkHero />

      {/* HowItWorks skeleton */}
      <section className="bg-white border-b border-gray-100 py-20 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Sk className="h-3 w-24 mx-auto mb-12" />
          {/* Mobile vertical */}
          <div className="lg:hidden flex flex-col gap-0 max-w-xs mx-auto">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="flex items-start gap-4 mb-5">
                <Sk className="h-9 w-9 rounded-full shrink-0" />
                <div className="flex-1 pt-1">
                  <Sk className="h-3 w-16 mb-1.5" />
                  <Sk className="h-2.5 w-12" />
                </div>
              </div>
            ))}
          </div>
          {/* Desktop horizontal */}
          <div className="hidden lg:flex items-center justify-center gap-0">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="flex items-center">
                <div className="flex flex-col items-center w-24">
                  <Sk className="h-10 w-10 rounded-full" />
                  <Sk className="h-3 w-14 mt-3 mb-1" />
                  <Sk className="h-2.5 w-12" />
                </div>
                {i < 6 && <Sk className="w-6 h-px mx-1 mb-6" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses preview skeleton */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <Sk className="h-3 w-20 mb-3" />
        <Sk className="h-7 w-52 mb-10" />
        <SkGrid count={3} cols={3} />
      </section>
    </div>
  );
}
