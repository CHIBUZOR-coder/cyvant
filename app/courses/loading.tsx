import { Sk, SkHero, SkGrid } from "@/components/ui/Skeleton";

export default function CoursesLoading() {
  return (
    <div className="bg-white">
      <SkHero />

      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 space-y-20">
        {/* Cybersecurity Academy */}
        <div>
          <div className="mb-10">
            <Sk className="h-3 w-20 mb-3" />
            <Sk className="h-7 w-52 mb-2" />
            <Sk className="h-4 w-64" />
          </div>
          <SkGrid count={3} cols={3} />
        </div>

        {/* AI Academy */}
        <div>
          <div className="mb-10">
            <Sk className="h-3 w-20 mb-3" />
            <Sk className="h-7 w-36 mb-2" />
            <Sk className="h-4 w-80" />
          </div>
          <SkGrid count={6} cols={3} />
        </div>
      </div>
    </div>
  );
}
