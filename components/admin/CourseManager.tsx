"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import type { Course } from "@/types";
import CyvantSpinner from "@/components/ui/CyvantSpinner";
import Pagination, { PAGE_SIZE } from "@/components/ui/Pagination";

const TIER_LABELS: Record<number, string> = { 1: "Tier 1", 2: "Tier 2", 3: "Tier 3" };

const EMPTY_FORM = {
  title: "",
  coverImage: "",
  tier: "1",
  path: "",
  level: "Beginner",
  duration: "",
  startingPrice: "",
  description: "",
  isStartHere: false,
  isMostPopular: false,
  prerequisites: "",
  whatYouLearn: "",
  capstone: "",
  advancedElective: "",
  certificationAlignment: "",
  careerPaths: "",
};

type FormState = typeof EMPTY_FORM;

function parseLines(text: string): string[] {
  return text.split("\n").map((l) => l.trim()).filter(Boolean);
}

function courseToForm(c: Course): FormState {
  return {
    title: c.title,
    coverImage: c.coverImage ?? "",
    tier: String(c.tier),
    path: c.path ?? "",
    level: c.level,
    duration: c.duration,
    startingPrice: c.startingPrice > 0 ? String(c.startingPrice) : "",
    description: c.description ?? "",
    isStartHere: c.isStartHere ?? false,
    isMostPopular: c.isMostPopular ?? false,
    prerequisites: (c.prerequisites ?? []).join("\n"),
    whatYouLearn: (c.whatYouLearn ?? []).join("\n"),
    capstone: c.capstone ?? "",
    advancedElective: c.advancedElective ?? "",
    certificationAlignment: (c.certificationAlignment ?? []).join("\n"),
    careerPaths: (c.careerPaths ?? []).join("\n"),
  };
}

export default function CourseManager({ initialCourses }: { initialCourses: Course[] }) {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [tierPages, setTierPages] = useState<Record<number, number>>({ 1: 1, 2: 1, 3: 1 });
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "courses");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error((await res.json()).error ?? "Upload failed.");
      const data = await res.json();
      set("coverImage", data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function set(key: keyof FormState, value: string | boolean) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setError("");
    setEditingId(null);
  }

  function openCreate() {
    resetForm();
    setShowForm(true);
  }

  function openEdit(course: Course) {
    setForm(courseToForm(course));
    setEditingId(course.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function buildBody() {
    return {
      title: form.title.trim(),
      coverImage: form.coverImage.trim() || undefined,
      tier: Number(form.tier),
      path: form.path || undefined,
      level: form.level,
      duration: form.duration.trim(),
      startingPrice: Number(form.startingPrice) || 0,
      description: form.description.trim() || undefined,
      isStartHere: form.isStartHere,
      isMostPopular: form.isMostPopular,
      prerequisites: parseLines(form.prerequisites),
      whatYouLearn: parseLines(form.whatYouLearn),
      capstone: form.capstone.trim() || undefined,
      advancedElective: form.advancedElective.trim() || undefined,
      certificationAlignment: parseLines(form.certificationAlignment),
      careerPaths: parseLines(form.careerPaths),
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.title.trim() || !form.tier || !form.level || !form.duration.trim()) {
      setError("Title, Tier, Level, and Duration are required.");
      return;
    }

    setSubmitting(true);
    try {
      const body = buildBody();

      if (editingId) {
        // Update existing course
        const res = await fetch(`/api/admin/courses/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error((await res.json()).error ?? "Failed to update course.");
        const updated: Course = await res.json();
        setCourses((prev) => prev.map((c) => (c.id === editingId ? updated : c)));
      } else {
        // Create new course
        const res = await fetch("/api/admin/courses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error((await res.json()).error ?? "Failed to create course.");
        const created: Course = await res.json();
        setCourses((prev) => [...prev, created]);
      }

      resetForm();
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this course? This cannot be undone.")) return;
    setDeleting(id);
    try {
      await fetch(`/api/admin/courses/${id}`, { method: "DELETE" });
      setCourses((prev) => prev.filter((c) => c.id !== id));
    } finally {
      setDeleting(null);
    }
  }

  const inputCls =
    "w-full rounded-md bg-gray-900 border border-white/10 px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#007dff]";
  const labelCls = "block text-xs text-gray-400 mb-1";
  const tiers = [1, 2, 3] as const;

  return (
    <div className="space-y-6">
      {(uploading || submitting || !!deleting) && <CyvantSpinner />}
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">
          {courses.length} course{courses.length !== 1 ? "s" : ""}
        </p>
        <button
          onClick={() => { showForm && !editingId ? (setShowForm(false), resetForm()) : openCreate(); }}
          className="cursor-pointer rounded-lg bg-[#007dff] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0066d9] transition-colors"
        >
          {showForm && !editingId ? "Cancel" : "+ Add Course"}
        </button>
      </div>

      {/* Form — shared for create and edit */}
      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-xl bg-gray-800 border border-white/10 p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-white font-semibold text-lg">
              {editingId ? "Edit Course" : "New Course"}
            </h2>
            {editingId && (
              <button
                type="button"
                onClick={() => { setShowForm(false); resetForm(); }}
                className="cursor-pointer text-gray-500 hover:text-white transition-colors text-sm"
              >
                Cancel
              </button>
            )}
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className={labelCls}>Title *</label>
              <input
                required
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="e.g. Cyber Security Fundamentals"
                className={inputCls}
              />
            </div>

            <div className="sm:col-span-2">
              <label className={labelCls}>Cover Image</label>
              <div className="flex gap-2">
                <input
                  value={form.coverImage}
                  onChange={(e) => set("coverImage", e.target.value)}
                  placeholder="https://... or upload below"
                  className={inputCls}
                />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="cursor-pointer shrink-0 rounded-md border border-white/10 bg-gray-700 px-3 py-2 text-xs text-gray-300 hover:bg-gray-600 disabled:opacity-50 transition-colors"
                >
                  Upload
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </div>
              {form.coverImage && (
                <div className="mt-2 relative h-24 w-full overflow-hidden rounded-md border border-white/10">
                  <Image src={form.coverImage} alt="Cover preview" fill className="object-cover" />
                </div>
              )}
            </div>

            <div>
              <label className={labelCls}>Tier *</label>
              <select required value={form.tier} onChange={(e) => set("tier", e.target.value)} className={inputCls}>
                <option value="1">Tier 1: Fundamentals</option>
                <option value="2">Tier 2: Intermediate</option>
                <option value="3">Tier 3: Advanced</option>
              </select>
            </div>

            {form.tier === "3" && (
              <div>
                <label className={labelCls}>Path (Tier 3 only)</label>
                <select value={form.path} onChange={(e) => set("path", e.target.value)} className={inputCls}>
                  <option value="">— none —</option>
                  <option value="A">Path A</option>
                  <option value="B">Path B</option>
                  <option value="C">Path C</option>
                </select>
              </div>
            )}

            <div>
              <label className={labelCls}>Level *</label>
              <select required value={form.level} onChange={(e) => set("level", e.target.value)} className={inputCls}>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className={labelCls}>Duration *</label>
              <input
                required
                value={form.duration}
                onChange={(e) => set("duration", e.target.value)}
                placeholder="e.g. 6 Weeks"
                className={inputCls}
              />
            </div>

            <div>
              <label className={labelCls}>Starting Price (₦)</label>
              <input
                type="number"
                min={0}
                value={form.startingPrice}
                onChange={(e) => set("startingPrice", e.target.value)}
                placeholder="e.g. 200000"
                className={inputCls}
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Description</label>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={3}
              className={inputCls + " resize-none"}
            />
          </div>

          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
              <input type="checkbox" checked={form.isStartHere} onChange={(e) => set("isStartHere", e.target.checked)} className="rounded border-gray-600" />
              Start Here badge
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
              <input type="checkbox" checked={form.isMostPopular} onChange={(e) => set("isMostPopular", e.target.checked)} className="rounded border-gray-600" />
              Most Popular badge
            </label>
          </div>

          <div>
            <label className={labelCls}>Prerequisites (one per line)</label>
            <textarea
              value={form.prerequisites}
              onChange={(e) => set("prerequisites", e.target.value)}
              rows={3}
              placeholder={"No prior experience required\nOr list each prerequisite on a new line"}
              className={inputCls + " resize-none"}
            />
          </div>

          <div>
            <label className={labelCls}>What You&apos;ll Learn (one per line)</label>
            <textarea
              value={form.whatYouLearn}
              onChange={(e) => set("whatYouLearn", e.target.value)}
              rows={4}
              placeholder={"CIA Triad\nNetwork Basics\nThreat Actors"}
              className={inputCls + " resize-none"}
            />
          </div>

          <div>
            <label className={labelCls}>Capstone</label>
            <input value={form.capstone} onChange={(e) => set("capstone", e.target.value)} placeholder="Capstone project description" className={inputCls} />
          </div>

          <div>
            <label className={labelCls}>Advanced Elective (optional add-on)</label>
            <input value={form.advancedElective} onChange={(e) => set("advancedElective", e.target.value)} placeholder="e.g. Cloud Security: Shared Responsibility Model, Cloud IAM..." className={inputCls} />
          </div>

          <div>
            <label className={labelCls}>Certification Alignment (one per line)</label>
            <textarea
              value={form.certificationAlignment}
              onChange={(e) => set("certificationAlignment", e.target.value)}
              rows={3}
              placeholder={"CompTIA Security+\nCEH (Certified Ethical Hacker)"}
              className={inputCls + " resize-none"}
            />
          </div>

          <div>
            <label className={labelCls}>Career Paths (one per line)</label>
            <textarea
              value={form.careerPaths}
              onChange={(e) => set("careerPaths", e.target.value)}
              rows={3}
              placeholder={"SOC Analyst\nPenetration Tester"}
              className={inputCls + " resize-none"}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => { setShowForm(false); resetForm(); }}
              className="cursor-pointer px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="cursor-pointer flex items-center justify-center rounded-lg bg-[#007dff] px-5 py-2 text-sm font-semibold text-white hover:bg-[#0066d9] disabled:opacity-50 transition-colors"
            >
              {editingId ? "Save Changes" : "Save Course"}
            </button>
          </div>
        </form>
      )}

      {/* Course list grouped by tier */}
      {tiers.map((tier) => {
        const tierCourses = courses.filter((c) => c.tier === tier);
        if (tierCourses.length === 0) return null;
        const tp = tierPages[tier] ?? 1;
        const pagedCourses = tierCourses.slice((tp - 1) * PAGE_SIZE, tp * PAGE_SIZE);
        return (
          <div key={tier}>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">
              {TIER_LABELS[tier]}
            </h3>
            <div className="rounded-xl border border-white/10 bg-gray-900 divide-y divide-white/5 overflow-hidden">
              {pagedCourses.map((course) => (
                <div
                  key={course.id}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-6 py-4 transition-colors ${editingId === course.id ? "bg-blue-500/5 border-l-2 border-blue-500" : ""}`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-white font-semibold truncate">{course.title}</p>
                      {course.path && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-violet-500/20 text-violet-300">Path {course.path}</span>
                      )}
                      {course.isStartHere && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-blue-500/20 text-blue-300">Start Here</span>
                      )}
                      {course.isMostPopular && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-amber-500/20 text-amber-300">Most Popular</span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm mt-0.5">
                      {course.level} · {course.duration} · ₦{course.startingPrice.toLocaleString("en-NG")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => openEdit(course)}
                      className="cursor-pointer rounded-md border border-blue-500/30 px-3 py-1.5 text-xs font-medium text-blue-400 hover:bg-[#0066d9]/10 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(course.id)}
                      disabled={deleting === course.id}
                      className="cursor-pointer rounded-md border border-red-500/30 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/10 disabled:opacity-50 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <Pagination
              page={tp}
              total={tierCourses.length}
              onChange={(p) => setTierPages((prev) => ({ ...prev, [tier]: p }))}
            />
          </div>
        );
      })}

      {courses.length === 0 && (
        <div className="rounded-xl border border-white/5 bg-gray-900 p-12 text-center">
          <p className="text-gray-400">No courses yet. Add one above.</p>
        </div>
      )}
    </div>
  );
}
