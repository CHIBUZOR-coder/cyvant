"use client";

import { useState } from "react";
import FormField from "./FormField";
import { validateContactFields, type ValidationErrors } from "@/lib/validation";

type Status = "idle" | "submitting" | "success" | "error";

export default function WebinarNotifyForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validation = validateContactFields({ name, email, phone: "", consent: true });
    delete validation.phone;
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setStatus("submitting");
    try {
      const res = await fetch("/api/forms/webinar-notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div role="status" className="rounded-xl bg-green-500/10 border border-green-500/30 p-6 text-center">
        <p className="font-semibold text-green-400 text-lg">You&apos;re on the list!</p>
        <p className="mt-2 text-green-300/70 text-sm">We&apos;ll email you as soon as a new webinar is ready.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <FormField id="notify-name" label="Full Name" value={name} onChange={setName} required error={errors.name} />
      <FormField id="notify-email" label="Email" type="email" value={email} onChange={setEmail} required error={errors.email} />
      <button
        type="submit"
        disabled={status === "submitting"}
        className="cursor-pointer w-full rounded-xl bg-[#007dff] px-4 py-3 text-sm font-semibold text-white hover:bg-[#0066d9] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {status === "submitting" ? "Saving…" : "Notify Me"}
      </button>
      {status === "error" && (
        <p role="alert" className="text-sm text-red-400 text-center">
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  );
}
