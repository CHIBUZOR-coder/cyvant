interface Props {
  id: string;
  label: string;
  type?: "text" | "email" | "tel" | "textarea";
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
  placeholder?: string;
}

export default function FormField({
  id,
  label,
  type = "text",
  value,
  onChange,
  required = false,
  error,
  placeholder,
}: Props) {
  const baseClass =
    "block w-full rounded-md border px-3 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors";
  const stateClass = error
    ? "border-red-400 bg-red-50 dark:bg-red-900/20 dark:border-red-600"
    : "border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800";

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
        {required && <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>}
      </label>
      {type === "textarea" ? (
        <textarea
          id={id}
          name={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          rows={4}
          placeholder={placeholder}
          aria-describedby={error ? `${id}-error` : undefined}
          aria-invalid={!!error}
          className={`${baseClass} ${stateClass} resize-none`}
        />
      ) : (
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          placeholder={placeholder}
          aria-describedby={error ? `${id}-error` : undefined}
          aria-invalid={!!error}
          className={`${baseClass} ${stateClass}`}
        />
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1 text-xs text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
