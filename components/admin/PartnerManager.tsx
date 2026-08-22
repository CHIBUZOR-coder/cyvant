"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import CyvantSpinner from "@/components/ui/CyvantSpinner";
import Pagination, { PAGE_SIZE } from "@/components/ui/Pagination";

interface Partner {
  id: string;
  name: string;
  logoUrl: string;
  website: string | null;
  order: number;
  published: boolean;
}

const EMPTY_FORM = {
  name: "",
  logoUrl: "",
  website: "",
  order: "0",
  published: true,
};

type FormState = typeof EMPTY_FORM;

function partnerToForm(p: Partner): FormState {
  return {
    name: p.name,
    logoUrl: p.logoUrl,
    website: p.website ?? "",
    order: String(p.order),
    published: p.published,
  };
}

export default function PartnerManager({ initialPartners }: { initialPartners: Partner[] }) {
  const [partners, setPartners] = useState<Partner[]>(initialPartners);
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function resetForm() {
    setForm({ ...EMPTY_FORM, order: String(partners.length) });
    setError("");
    setEditingId(null);
  }

  function openCreate() {
    resetForm();
    setShowForm(true);
  }

  function openEdit(partner: Partner) {
    setForm(partnerToForm(partner));
    setEditingId(partner.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleLogoUpload(file: File) {
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "partners");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error((await res.json()).error ?? "Upload failed.");
      const { url } = await res.json();
      set("logoUrl", url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.logoUrl.trim()) {
      setError("Name and logo are required.");
      return;
    }
    setSubmitting(true);
    try {
      const body = {
        name: form.name.trim(),
        logoUrl: form.logoUrl.trim(),
        website: form.website.trim() || null,
        order: Number(form.order) || 0,
        published: form.published,
      };

      if (editingId) {
        const res = await fetch(`/api/cyvant-hq/partners/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error((await res.json()).error ?? "Failed to update.");
        const updated: Partner = await res.json();
        setPartners((prev) => prev.map((p) => (p.id === editingId ? updated : p)));
      } else {
        const res = await fetch("/api/cyvant-hq/partners", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error((await res.json()).error ?? "Failed to create.");
        const created: Partner = await res.json();
        setPartners((prev) => [...prev, created]);
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
    setDeleting(id);
    try {
      await fetch(`/api/cyvant-hq/partners/${id}`, { method: "DELETE" });
      setPartners((prev) => prev.filter((p) => p.id !== id));
      if (editingId === id) { setShowForm(false); resetForm(); }
    } finally {
      setDeleting(null);
    }
  }

  const inputCls = "w-full rounded-md bg-gray-900 border border-white/10 px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#007dff]";
  const labelCls = "block text-xs text-gray-400 mb-1";

  const sortedPartners = [...partners].sort((a, b) => a.order - b.order);
  const pagedPartners = sortedPartners.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6">
      {(uploading || submitting || !!deleting) && <CyvantSpinner />}
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">{partners.length} organisation{partners.length !== 1 ? "s" : ""}</p>
        <button
          onClick={() => { showForm && !editingId ? (setShowForm(false), resetForm()) : openCreate(); }}
          className="cursor-pointer rounded-lg bg-[#007dff] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0066d9] transition-colors"
        >
          {showForm && !editingId ? "Cancel" : "+ Add Organisation"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-xl bg-gray-800 border border-white/10 p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-white font-semibold text-lg">{editingId ? "Edit Organisation" : "New Organisation"}</h2>
            {editingId && (
              <button type="button" onClick={() => { setShowForm(false); resetForm(); }}
                className="cursor-pointer text-gray-500 hover:text-white transition-colors text-sm">
                Cancel
              </button>
            )}
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className={labelCls}>Organisation Name *</label>
              <input required value={form.name} onChange={(e) => set("name", e.target.value)}
                placeholder="e.g. Digitek Network" className={inputCls} />
            </div>

            {/* Logo upload */}
            <div className="sm:col-span-2">
              <label className={labelCls}>Logo *</label>
              <div className="flex gap-3 items-start">
                <div className="flex-1 space-y-2">
                  <input
                    value={form.logoUrl}
                    onChange={(e) => set("logoUrl", e.target.value)}
                    placeholder="Paste a URL, or upload below"
                    className={inputCls}
                  />
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      disabled={uploading}
                      className="cursor-pointer rounded-md border border-white/10 px-3 py-1.5 text-xs text-gray-300 hover:text-white hover:border-white/30 transition-colors disabled:opacity-50"
                    >
                      Upload image
                    </button>
                    <span className="text-xs text-gray-500">PNG, JPG, WEBP — max 5 MB</span>
                  </div>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleLogoUpload(f); }}
                  />
                </div>
                {form.logoUrl && (
                  <div className="shrink-0 w-24 h-14 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center p-2">
                    <img src={form.logoUrl} alt="preview" className="max-h-10 max-w-full object-contain" />
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className={labelCls}>Website URL</label>
              <input value={form.website} onChange={(e) => set("website", e.target.value)}
                placeholder="https://example.com" className={inputCls} />
            </div>

            <div>
              <label className={labelCls}>Sort Order</label>
              <input type="number" min={0} value={form.order} onChange={(e) => set("order", e.target.value)}
                placeholder="0" className={inputCls} />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
            <input type="checkbox" checked={form.published} onChange={(e) => set("published", e.target.checked)}
              className="rounded border-gray-600" />
            Published (visible on the public site)
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => { setShowForm(false); resetForm(); }}
              className="cursor-pointer px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={submitting || uploading}
              className="cursor-pointer flex items-center justify-center rounded-lg bg-[#007dff] px-5 py-2 text-sm font-semibold text-white hover:bg-[#0066d9] disabled:opacity-50 transition-colors">
              {editingId ? "Save Changes" : "Add Organisation"}
            </button>
          </div>
        </form>
      )}

      {/* List */}
      {partners.length === 0 ? (
        <div className="rounded-xl border border-white/5 bg-gray-900 p-12 text-center">
          <p className="text-gray-400">No organisations yet. Add one above.</p>
        </div>
      ) : (
        <>
        <div className="rounded-xl border border-white/10 bg-gray-900 divide-y divide-white/5 overflow-hidden">
          {pagedPartners.map((partner) => (
              <div
                key={partner.id}
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-6 py-4 transition-colors ${editingId === partner.id ? "bg-blue-500/5 border-l-2 border-blue-500" : ""}`}
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="flex h-12 w-24 shrink-0 items-center justify-center rounded-lg bg-white/5 border border-white/10 p-2">
                    <Image
                      src={partner.logoUrl}
                      alt={partner.name}
                      width={80}
                      height={40}
                      className="max-h-8 w-auto object-contain"
                      unoptimized={partner.logoUrl.startsWith("/")}
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-white font-semibold truncate">{partner.name}</p>
                      {!partner.published && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-300">Draft</span>
                      )}
                    </div>
                    {partner.website && (
                      <p className="text-gray-500 text-xs mt-0.5 truncate">{partner.website}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => openEdit(partner)}
                    className="cursor-pointer rounded-md border border-blue-500/30 px-3 py-1.5 text-xs font-medium text-blue-400 hover:bg-[#0066d9]/10 transition-colors">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(partner.id)} disabled={deleting === partner.id}
                    className="cursor-pointer rounded-md border border-red-500/30 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/10 disabled:opacity-50 transition-colors">
                    Delete
                  </button>
                </div>
              </div>
          ))}
        </div>
        <Pagination page={page} total={sortedPartners.length} onChange={setPage} />
        </>
      )}
    </div>
  );
}
