import { Sk, SkHero } from "@/components/ui/Skeleton";

export default function ContactLoading() {
  return (
    <div className="bg-white">
      <SkHero />

      <section className="mx-auto max-w-xl px-6 py-16 lg:px-8">
        {/* Form fields */}
        <div className="space-y-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i}>
              <Sk className="h-3.5 w-24 mb-1.5" />
              <Sk className="h-10 w-full rounded-md" />
            </div>
          ))}
          {/* Textarea */}
          <div>
            <Sk className="h-3.5 w-28 mb-1.5" />
            <Sk className="h-24 w-full rounded-md" />
          </div>
          {/* Consent */}
          <div className="flex items-start gap-3">
            <Sk className="h-4 w-4 rounded shrink-0 mt-0.5" />
            <Sk className="h-4 flex-1" />
          </div>
          {/* Submit */}
          <Sk className="h-12 w-full rounded-md" />
        </div>
      </section>
    </div>
  );
}
