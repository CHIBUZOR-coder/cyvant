import Link from "next/link";

interface Props {
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
}

export default function ConsentCheckbox({ checked, onChange, error }: Props) {
  return (
    <div>
      <div className="flex items-start gap-3">
        <input
          id="consent"
          name="consent"
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          required
          aria-describedby={error ? "consent-error" : undefined}
          aria-invalid={!!error}
          className="mt-0.5 h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-[#007dff] focus:ring-[#007dff] dark:bg-slate-800"
        />
        <label htmlFor="consent" className="text-sm text-gray-600 dark:text-gray-300 leading-5">
          I agree that my data will be used for CYVANT communications in accordance with the{" "}
          <Link
            href="/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#007dff] dark:text-blue-400 underline underline-offset-2 hover:text-[#0066d9]"
          >
            Privacy Policy
          </Link>
          .{" "}
          <span className="text-gray-400 dark:text-gray-500">(Required)</span>
        </label>
      </div>
      {error && (
        <p id="consent-error" role="alert" className="mt-1 text-xs text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
