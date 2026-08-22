"use client";

import { useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import FormField from "./FormField";
import ConsentCheckbox from "./ConsentCheckbox";
import { validateContactFields, type ValidationErrors } from "@/lib/validation";
import CyvantSpinner from "@/components/ui/CyvantSpinner";

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
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const fileRef = useRef<HTMLInputElement>(null);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setPhoto(file);
    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
    } else {
      setPhotoPreview(null);
    }
  }

  async function uploadPhoto(): Promise<string | undefined> {
    if (!photo) return undefined;
    const fd = new FormData();
    fd.append("file", photo);
    fd.append("folder", "students");
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    if (!res.ok) throw new Error("Photo upload failed.");
    const { url } = await res.json();
    return url;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validation = validateContactFields({ name, email, phone, consent });
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setStatus("submitting");
    try {
      const photoUrl = await uploadPhoto();
      const res = await fetch("/api/forms/course-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, courseInterest: course, consent, photoUrl }),
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
      {status === "submitting" && <CyvantSpinner />}
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

      {/* Optional photo */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Photo <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <div className="flex items-center gap-4">
          {photoPreview && (
            <img src={photoPreview} alt="Preview" className="h-14 w-14 rounded-full object-cover border border-gray-300 dark:border-gray-700 shrink-0" />
          )}
          <div className="flex-1">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
              id="photo-upload"
            />
            <label
              htmlFor="photo-upload"
              className="inline-block cursor-pointer rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:border-blue-400 hover:text-[#007dff] transition-colors"
            >
              {photo ? "Change photo" : "Upload photo"}
            </label>
            {photo && (
              <button
                type="button"
                onClick={() => { setPhoto(null); setPhotoPreview(null); if (fileRef.current) fileRef.current.value = ""; }}
                className="cursor-pointer ml-3 text-xs text-gray-400 hover:text-red-400 transition-colors"
              >
                Remove
              </button>
            )}
            <p className="mt-1 text-xs text-gray-400">JPG, PNG or WebP · max 5 MB</p>
          </div>
        </div>
      </div>

      <ConsentCheckbox checked={consent} onChange={setConsent} error={errors.consent} />
      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full flex items-center justify-center rounded-md bg-[#007dff] px-4 py-3 text-sm font-semibold text-white hover:bg-[#0066d9] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Send Inquiry
      </button>
      {status === "error" && (
        <p role="alert" className="text-sm text-red-600 text-center">
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  );
}
