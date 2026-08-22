"use client";

import { useState } from "react";
import { SERVICE_ICON_OPTIONS, SERVICE_ICONS } from "@/lib/service-icons";
import type { ServiceIconKey } from "@/lib/service-icons";
import CyvantSpinner from "@/components/ui/CyvantSpinner";
import Pagination, { PAGE_SIZE } from "@/components/ui/Pagination";

interface Service {
  id: string;
  slug: string;
  number: string;
  title: string;
  description: string;
  cta: string;
  icon: string;
  published: boolean;
  order: number;
}

const EMPTY_FORM = {
  title: "",
  description: "",
  cta: "Talk to us",
  icon: "shield" as ServiceIconKey,
  number: "01",
  published: true,
  order: "0",
};

type FormState = typeof EMPTY_FORM;

function serviceToForm(s: Service): FormState {
  return {
    title: s.title,
    description: s.description,
    cta: s.cta,
    icon: s.icon as ServiceIconKey,
    number: s.number,
    published: s.published,
    order: String(s.order),
  };
}

export default function ServiceManager({ initialServices }: { initialServices: Service[] }) {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function resetForm() {
    setForm({ ...EMPTY_FORM, number: String(services.length + 1).padStart(2, "0") });
    setError("");
    setEditingId(null);
  }

  function openCreate() {
    resetForm();
    setShowForm(true);
  }

  function openEdit(service: Service) {
    setForm(serviceToForm(service));
    setEditingId(service.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.title.trim() || !form.description.trim()) {
      setError("Title and description are required.");
      return;
    }
    setSubmitting(true);
    try {
      const body = {
        title: form.title.trim(),
        description: form.description.trim(),
        cta: form.cta.trim(),
        icon: form.icon,
        number: form.number.trim(),
        published: form.published,
        order: Number(form.order) || 0,
      };

      if (editingId) {
        const res = await fetch(`/api/admin/services/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error((await res.json()).error ?? "Failed to update.");
        const updated: Service = await res.json();
        setServices((prev) => prev.map((s) => (s.id === editingId ? updated : s)));
      } else {
        const res = await fetch("/api/admin/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error((await res.json()).error ?? "Failed to create.");
        const created: Service = await res.json();
        setServices((prev) => [...prev, created]);
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
      await fetch(`/api/admin/services/${id}`, { method: "DELETE" });
      setServices((prev) => prev.filter((s) => s.id !== id));
      if (editingId === id) { setShowForm(false); resetForm(); }
    } finally {
      setDeleting(null);
    }
  }

  const inputCls = "w-full rounded-md bg-gray-900 border border-white/10 px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#007dff]";
  const labelCls = "block text-xs text-gray-400 mb-1";

  const sortedServices = [...services].sort((a, b) => a.order - b.order);
  const pagedServices = sortedServices.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6">
      {(submitting || !!deleting) && <CyvantSpinner />}
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">{services.length} service{services.length !== 1 ? "s" : ""}</p>
        <button
          onClick={() => { showForm && !editingId ? (setShowForm(false), resetForm()) : openCreate(); }}
          className="cursor-pointer rounded-lg bg-[#007dff] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0066d9] transition-colors"
        >
          {showForm && !editingId ? "Cancel" : "+ Add Service"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-xl bg-gray-800 border border-white/10 p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-white font-semibold text-lg">{editingId ? "Edit Service" : "New Service"}</h2>
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
              <label className={labelCls}>Title *</label>
              <input required value={form.title} onChange={(e) => set("title", e.target.value)}
                placeholder="e.g. Corporate Cybersecurity Training" className={inputCls} />
            </div>

            <div>
              <label className={labelCls}>Number (display)</label>
              <input value={form.number} onChange={(e) => set("number", e.target.value)}
                placeholder="01" className={inputCls} />
            </div>

            <div>
              <label className={labelCls}>CTA Button Text</label>
              <select value={form.cta} onChange={(e) => set("cta", e.target.value)} className={inputCls}>
                <option value="Talk to us">Talk to us</option>
                <option value="Request a quote">Request a quote</option>
                <option value="Learn more">Learn more</option>
                <option value="Get started">Get started</option>
              </select>
            </div>

            <div>
              <label className={labelCls}>Icon</label>
              <select value={form.icon} onChange={(e) => set("icon", e.target.value as ServiceIconKey)} className={inputCls}>
                {SERVICE_ICON_OPTIONS.map((opt) => (
                  <option key={opt.key} value={opt.key}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelCls}>Sort Order</label>
              <input type="number" min={0} value={form.order} onChange={(e) => set("order", e.target.value)}
                placeholder="0" className={inputCls} />
            </div>
          </div>

          <div>
            <label className={labelCls}>Description *</label>
            <textarea required value={form.description} onChange={(e) => set("description", e.target.value)}
              rows={4} placeholder="Describe what this service offers…" className={inputCls + " resize-none"} />
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
            <button type="submit" disabled={submitting}
              className="cursor-pointer flex items-center justify-center rounded-lg bg-[#007dff] px-5 py-2 text-sm font-semibold text-white hover:bg-[#0066d9] disabled:opacity-50 transition-colors">
              {editingId ? "Save Changes" : "Save Service"}
            </button>
          </div>
        </form>
      )}

      {/* List */}
      {services.length === 0 ? (
        <div className="rounded-xl border border-white/5 bg-gray-900 p-12 text-center">
          <p className="text-gray-400">No services yet. Add one above.</p>
        </div>
      ) : (
        <>
        <div className="rounded-xl border border-white/10 bg-gray-900 divide-y divide-white/5 overflow-hidden">
          {pagedServices.map((service) => (
              <div
                key={service.id}
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-6 py-4 transition-colors ${editingId === service.id ? "bg-blue-500/5 border-l-2 border-blue-500" : ""}`}
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-800 border border-white/10">
                    {SERVICE_ICONS[service.icon as ServiceIconKey] ?? SERVICE_ICONS.shield}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-white font-semibold truncate">{service.title}</p>
                      <span className="text-xs text-gray-500">{service.number}</span>
                      {!service.published && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-300">Draft</span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm mt-0.5 truncate">{service.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => openEdit(service)}
                    className="cursor-pointer rounded-md border border-blue-500/30 px-3 py-1.5 text-xs font-medium text-blue-400 hover:bg-[#0066d9]/10 transition-colors">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(service.id)} disabled={deleting === service.id}
                    className="cursor-pointer rounded-md border border-red-500/30 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/10 disabled:opacity-50 transition-colors">
                    Delete
                  </button>
                </div>
              </div>
          ))}
        </div>
        <Pagination page={page} total={sortedServices.length} onChange={setPage} />
        </>
      )}
    </div>
  );
}
