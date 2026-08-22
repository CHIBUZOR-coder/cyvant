export default function CyvantSpinner() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/75 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-5">
        <svg
          className="animate-spin h-14 w-14 text-[#007dff]"
          fill="none"
          viewBox="0 0 24 24"
          aria-label="Loading"
        >
          <circle
            className="opacity-20"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            className="opacity-90"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
        <p className="text-lg font-bold tracking-[0.22em] uppercase">
          <span className="text-white">CY</span>
          <span className="text-[#007dff]">VANT</span>
        </p>
      </div>
    </div>
  );
}
