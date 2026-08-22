"use client";

import { useEffect, useState } from "react";
import FormField from "./FormField";
import ConsentCheckbox from "./ConsentCheckbox";
import { validateContactFields, type ValidationErrors } from "@/lib/validation";
import CyvantSpinner from "@/components/ui/CyvantSpinner";

type Status = "idle" | "submitting" | "success" | "error";

export default function DiscoveryCallForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    if (status !== "success") return;
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [status]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validation = validateContactFields({ name, email, phone, consent });
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setStatus("submitting");
    try {
      const res = await fetch("/api/forms/discovery-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, consent }),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL;
    const params = new URLSearchParams({ name, email, primary_color: "1d4ed8" });
    const embedUrl = calendlyUrl ? `${calendlyUrl}?${params.toString()}` : null;

    return (
      <div role="status">
        <div className="rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-6 text-center mb-8">
          <p className="font-semibold text-green-800 dark:text-green-300 text-lg">Request received!</p>
          <p className="mt-2 text-green-700 dark:text-green-400 text-sm">
            Pick a time below and we&apos;ll confirm your slot.
          </p>
        </div>
        {embedUrl ? (
          <div
            className="calendly-inline-widget rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700"
            data-url={embedUrl}
            style={{ minWidth: "320px", height: "700px" }}
          />
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
            We&apos;ll reach out within 24 hours to confirm your slot.
          </p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {status === "submitting" && <CyvantSpinner />}
      <FormField id="dc-name" label="Full Name" value={name} onChange={setName} required error={errors.name} />
      <FormField id="dc-email" label="Email" type="email" value={email} onChange={setEmail} required error={errors.email} />
      <FormField id="dc-phone" label="Phone / WhatsApp" value={phone} onChange={setPhone} required error={errors.phone} />
      <ConsentCheckbox checked={consent} onChange={setConsent} error={errors.consent} />
      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full flex items-center justify-center rounded-md bg-[#007dff] px-4 py-3 text-sm font-semibold text-white hover:bg-[#0066d9] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Book a Discovery Call
      </button>
      {status === "error" && (
        <p role="alert" className="text-sm text-red-600 text-center">
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  );
}
