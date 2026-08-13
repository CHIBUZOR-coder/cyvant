import { Sk, SkHero } from "@/components/ui/Skeleton";

export default function AboutLoading() {
  return (
    <div className="bg-white">
      <SkHero />

      {/* Founder */}
      <section className="py-20 px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Sk className="h-6 w-36 mb-10" />
          <div className="flex flex-col sm:flex-row gap-8 items-start">
            <Sk className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl shrink-0" />
            <div className="flex-1 space-y-3 pt-2">
              <Sk className="h-5 w-52" />
              <Sk className="h-4 w-full" />
              <Sk className="h-4 w-5/6" />
              <Sk className="h-4 w-4/6" />
              <div className="flex gap-4 pt-2">
                <Sk className="h-4 w-16" />
                <Sk className="h-4 w-14" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-gray-50 py-20 px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Sk className="h-6 w-28 mb-10" />
          <div className="grid sm:grid-cols-2 gap-6">
            {[0, 1].map((i) => (
              <div key={i} className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm">
                <Sk className="w-14 h-14 rounded-xl mb-4" />
                <Sk className="h-4 w-36 mb-2" />
                <Sk className="h-3 w-24 mb-3" />
                <Sk className="h-3 w-full mb-1.5" />
                <Sk className="h-3 w-4/5" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Sk className="h-6 w-44 mb-6" />
          <Sk className="h-5 w-full mb-2" />
          <Sk className="h-5 w-5/6 mb-2" />
          <Sk className="h-5 w-4/5" />
        </div>
      </section>

      {/* Values */}
      <section className="bg-slate-900 py-20 px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Sk dark className="h-3 w-20 mb-4" />
          <Sk dark className="h-7 w-44 mb-12" />
          <div className="grid sm:grid-cols-2 gap-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <Sk dark className="h-2 w-2 rounded-full mb-4" />
                <Sk dark className="h-4 w-40 mb-3" />
                <Sk dark className="h-3 w-full mb-1.5" />
                <Sk dark className="h-3 w-4/5" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 lg:px-8 text-center">
        <Sk className="h-7 w-40 mx-auto mb-6" />
        <Sk className="h-12 w-40 rounded-xl mx-auto" />
      </section>
    </div>
  );
}
