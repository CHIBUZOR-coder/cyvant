"use client";

import { useState } from "react";
import FormField from "./FormField";
import ConsentCheckbox from "./ConsentCheckbox";
import { validateContactFields, type ValidationErrors } from "@/lib/validation";
import CyvantSpinner from "@/components/ui/CyvantSpinner";

type Status = "idle" | "submitting" | "success" | "error";

export default function GeneralContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validation = validateContactFields({ name, email, consent });
    if (!message.trim()) validation.message = "Message is required.";
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setStatus("submitting");
    try {
      const res = await fetch("/api/forms/general-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, consent }),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div role="status" className="rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-6 text-center">
        <p className="font-semibold text-green-800 dark:text-green-300 text-lg">Message received!</p>
        <p className="mt-2 text-green-700 dark:text-green-400 text-sm">We&apos;ll get back to you soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {status === "submitting" && <CyvantSpinner />}
      <FormField id="name" label="Full Name" value={name} onChange={setName} required error={errors.name} />
      <FormField id="email" label="Email" type="email" value={email} onChange={setEmail} required error={errors.email} />
      <FormField
        id="message"
        label="Message"
        type="textarea"
        value={message}
        onChange={setMessage}
        required
        error={errors.message}
        placeholder="How can we help?"
      />
      <ConsentCheckbox checked={consent} onChange={setConsent} error={errors.consent} />
      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full flex items-center justify-center rounded-md bg-[#007dff] px-4 py-3 text-sm font-semibold text-white hover:bg-[#0066d9] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Send Message
      </button>
      {status === "error" && (
        <p role="alert" className="text-sm text-red-600 text-center">
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  );
}
