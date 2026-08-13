import { Sk, SkHero } from "@/components/ui/Skeleton";

export default function FaqLoading() {
  return (
    <div className="bg-white">
      <SkHero />

      <section className="mx-auto max-w-3xl px-6 py-20 lg:px-8">
        {/* Accordion rows */}
        <div className="divide-y divide-gray-200">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="py-5 flex items-center justify-between gap-4">
              <Sk className="h-4 flex-1" />
              <Sk className="h-6 w-6 rounded-full shrink-0" />
            </div>
          ))}
        </div>

        {/* CTA box */}
        <div className="mt-16 rounded-2xl bg-slate-900 p-6 sm:p-10 flex flex-col items-center gap-3">
          <Sk dark className="h-5 w-44" />
          <Sk dark className="h-3 w-36" />
          <Sk dark className="h-10 w-32 rounded-xl mt-3" />
        </div>
      </section>
    </div>
  );
}
