"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import FormField from "./FormField";
import ConsentCheckbox from "./ConsentCheckbox";
import { validateContactFields, type ValidationErrors } from "@/lib/validation";

type Status = "idle" | "submitting" | "success" | "error";

interface Props {
  initialCourse?: string;
}

export default function CourseInquiryForm({ initialCourse }: Props) {
  const params = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [course, setCourse] = useState(initialCourse ?? params.get("course") ?? "");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validation = validateContactFields({ name, email, phone, consent });
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setStatus("submitting");
    try {
      const res = await fetch("/api/forms/course-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, courseInterest: course, consent }),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div role="status" className="rounded-lg bg-green-50 border border-green-200 p-6 text-center">
        <p className="font-semibold text-green-800 text-lg">Inquiry received!</p>
        <p className="mt-2 text-green-700 text-sm">We&apos;ll be in touch within 24 hours.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <FormField id="name" label="Full Name" value={name} onChange={setName} required error={errors.name} />
      <FormField id="email" label="Email" type="email" value={email} onChange={setEmail} required error={errors.email} />
      <FormField id="phone" label="Phone / WhatsApp" type="tel" value={phone} onChange={setPhone} required error={errors.phone} />
      <FormField
        id="course"
        label="Course of Interest"
        value={course}
        onChange={setCourse}
        placeholder="e.g. Cybersecurity Foundations"
      />
      <ConsentCheckbox checked={consent} onChange={setConsent} error={errors.consent} />
      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-md bg-blue-700 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {status === "submitting" ? "Sending…" : "Send Inquiry"}
      </button>
      {status === "error" && (
        <p role="alert" className="text-sm text-red-600 text-center">
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  );
}
