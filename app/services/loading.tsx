import { Sk, SkHero } from "@/components/ui/Skeleton";

export default function ServicesLoading() {
  return (
    <div className="bg-white">
      <SkHero />

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <li key={i} className="rounded-2xl border border-gray-200 p-6">
              <Sk className="h-3 w-8 mb-4" />
              <Sk className="h-6 w-3/4 mb-4" />
              <Sk className="h-4 w-full mb-2" />
              <Sk className="h-4 w-5/6 mb-2" />
              <Sk className="h-4 w-4/6 mb-6" />
              <Sk className="h-10 w-36 rounded-lg" />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
