const PAGE_SIZE = 10;

function visiblePages(page: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (page <= 4) return [1, 2, 3, 4, 5, "…", total];
  if (page >= total - 3) return [1, "…", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "…", page - 1, page, page + 1, "…", total];
}

interface Props {
  page: number;
  total: number;
  onChange: (p: number) => void;
  pageSize?: number;
}

export default function Pagination({ page, total, onChange, pageSize = PAGE_SIZE }: Props) {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;

  const btn = "cursor-pointer rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors";

  return (
    <div className="flex items-center justify-between pt-4">
      <p className="text-xs text-gray-500">
        {Math.min((page - 1) * pageSize + 1, total)}–{Math.min(page * pageSize, total)} of {total}
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          className={`${btn} text-gray-400 hover:bg-gray-800 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed`}
        >
          ← Prev
        </button>
        {visiblePages(page, totalPages).map((p, i) =>
          p === "…" ? (
            <span key={`e${i}`} className="px-1 text-xs text-gray-600">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onChange(p as number)}
              className={`${btn} min-w-[28px] ${p === page ? "bg-[#007dff] text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}
            >
              {p}
            </button>
          )
        )}
        <button
          onClick={() => onChange(page + 1)}
          disabled={page === totalPages}
          className={`${btn} text-gray-400 hover:bg-gray-800 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed`}
        >
          Next →
        </button>
      </div>
    </div>
  );
}

export { PAGE_SIZE };
