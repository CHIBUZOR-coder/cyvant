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
          className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-700 focus:ring-blue-600"
        />
        <label htmlFor="consent" className="text-sm text-gray-600 leading-5">
          I agree that my data will be used for CYVANT communications.{" "}
          <span className="text-gray-400">(Required)</span>
        </label>
      </div>
      {error && (
        <p id="consent-error" role="alert" className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
