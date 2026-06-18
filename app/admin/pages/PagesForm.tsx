"use client";

import React, { useState } from "react";
import { updatePageConfig, uploadImage } from "../../actions/dbActions";
import {
  Save,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Upload,
  Loader2,
  CheckCircle,
  AlertCircle,
  Link as LinkIcon,
  FileSearch,
  Layout,
  Layers,
} from "lucide-react";

interface PagesFormProps {
  initialPages: any[];
}

export default function PagesForm({ initialPages }: PagesFormProps) {
  const [pages, setPages] = useState<any[]>(initialPages || []);
  const [selectedPageName, setSelectedPageName] = useState<string>(
    initialPages?.[0]?.page_name ?? "home"
  );
  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const currentPage = pages.find((p) => p.page_name === selectedPageName) ?? pages[0] ?? null;

  const handlePageMetadataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPages((prev) =>
      prev.map((p) =>
        p.page_name === selectedPageName ? { ...p, [name]: value } : p
      )
    );
  };

  const handleSectionToggle = (sectionId: string, enabled: boolean) => {
    setPages((prev) =>
      prev.map((p) => {
        if (p.page_name !== selectedPageName) return p;
        const updatedSections = (p.sections ?? []).map((sec: any) =>
          sec.id === sectionId ? { ...sec, enabled } : sec
        );
        return { ...p, sections: updatedSections };
      })
    );
  };

  const handleSectionTextChange = (sectionId: string, field: string, value: string) => {
    setPages((prev) =>
      prev.map((p) => {
        if (p.page_name !== selectedPageName) return p;
        const updatedSections = (p.sections ?? []).map((sec: any) =>
          sec.id === sectionId ? { ...sec, [field]: value } : sec
        );
        return { ...p, sections: updatedSections };
      })
    );
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, sectionId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(sectionId);
    setMessage(null);

    const formData = new FormData();
    formData.append("file", file);

    const res = await uploadImage(formData);
    setUploadingField(null);

    if (res.error) {
      setMessage({ type: "error", text: `Gagal mengunggah gambar: ${res.error}` });
    } else if (res.url) {
      handleSectionTextChange(sectionId, "bgImage", res.url);
      setMessage({ type: "success", text: "Gambar banner berhasil diunggah!" });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPage) return;

    setSaving(true);
    setMessage(null);

    // Build a clean payload — serialize sections explicitly to avoid proxy mutation issues
    const payload = {
      title: currentPage.title,
      description: currentPage.description,
      sections: JSON.parse(JSON.stringify(currentPage.sections ?? [])),
    };

    const res = await updatePageConfig(currentPage.page_name, payload);
    setSaving(false);

    if (res.error) {
      setMessage({ type: "error", text: `Gagal menyimpan konfigurasi halaman: ${res.error}` });
    } else {
      setMessage({ type: "success", text: `Pengaturan halaman "${currentPage.page_name.toUpperCase()}" berhasil disimpan!` });
    }
  };

  // ── Empty state when no pages are seeded ───────────────────────────────
  if (pages.length === 0) {
    return (
      <div className="max-w-5xl space-y-6">
        <div>
          <h1 className="font-display font-extrabold text-3xl text-zinc-900 dark:text-white">
            Kustomisasi Halaman & Seksi
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Kelola metatag SEO halaman dan sembunyikan/kustomisasi seksi-seksi penyusun halaman
          </p>
        </div>
        <div className="flex flex-col items-center justify-center p-16 bg-white dark:bg-zinc-900 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-3xl text-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-brand-amber-500/10 flex items-center justify-center">
            <Layout className="w-7 h-7 text-brand-amber-500" />
          </div>
          <div>
            <p className="font-display font-bold text-lg text-zinc-900 dark:text-white">Belum ada data halaman</p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Kembali ke{" "}
              <a href="/admin" className="text-brand-amber-500 font-bold hover:underline">
                Pengaturan Utama
              </a>{" "}
              dan gunakan tombol <strong>Muat Data Bawaan (Seed)</strong> untuk menginisialisasi halaman.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* ── Header ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-3xl text-zinc-900 dark:text-white">
            Kustomisasi Halaman & Seksi
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Kelola metatag SEO halaman dan sembunyikan/kustomisasi seksi-seksi penyusun halaman
          </p>
        </div>
      </div>

      {/* ── Page Selection Tabs ────────────────────────────── */}
      <div className="flex flex-wrap gap-2">
        {pages.map((p) => (
          <button
            key={p.page_name}
            type="button"
            onClick={() => {
              setSelectedPageName(p.page_name);
              setMessage(null);
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
              selectedPageName === p.page_name
                ? "bg-brand-amber-500 border-brand-amber-500 text-white shadow-md shadow-brand-amber-500/20"
                : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700"
            }`}
          >
            {p.page_name}
          </button>
        ))}
      </div>

      {/* ── Alert ─────────────────────────────────────────── */}
      {message && (
        <div
          className={`p-4 rounded-2xl flex items-start gap-3 border text-sm font-semibold ${
            message.type === "success"
              ? "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900/30 text-green-700 dark:text-green-400"
              : "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* ── Main Form ─────────────────────────────────────── */}
      {currentPage && (
        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* Left: SEO metadata panel */}
          <div className="lg:col-span-5 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-6 shadow-sm space-y-6 transition-colors">
            <div className="flex items-center gap-2 pb-4 border-b border-zinc-200/50 dark:border-zinc-800/50 text-zinc-900 dark:text-white">
              <div className="w-8 h-8 rounded-xl bg-brand-amber-500/10 flex items-center justify-center">
                <FileSearch className="w-4 h-4 text-brand-amber-500" />
              </div>
              <h2 className="font-display font-extrabold text-lg">Informasi SEO Halaman</h2>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Judul Halaman (Meta Title)
              </label>
              <input
                type="text"
                name="title"
                value={currentPage.title ?? ""}
                onChange={handlePageMetadataChange}
                required
                className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Deskripsi Ringkasan (Meta Description)
              </label>
              <textarea
                name="description"
                value={currentPage.description ?? ""}
                onChange={handlePageMetadataChange}
                rows={4}
                required
                className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-zinc-900 hover:bg-brand-amber-600 dark:bg-zinc-100 dark:hover:bg-brand-amber-500 dark:text-zinc-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Simpan Perubahan Halaman
            </button>
          </div>

          {/* Right: sections customization */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2 px-1">
              <Layers className="w-4 h-4 text-brand-amber-500" />
              <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                Seksi Halaman — {currentPage.page_name}
              </h2>
            </div>

            {(currentPage.sections ?? []).map((sec: any) => (
              <div
                key={sec.id}
                className={`p-6 rounded-3xl border transition-all ${
                  sec.enabled
                    ? "bg-white dark:bg-zinc-900 border-zinc-200/50 dark:border-zinc-800/50 shadow-sm"
                    : "bg-zinc-100/50 dark:bg-zinc-950/20 border-zinc-200/20 dark:border-zinc-900/30 opacity-60"
                }`}
              >
                {/* Section header */}
                <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800/50 mb-5">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-brand-amber-500 shrink-0" />
                    <h3 className="font-display font-extrabold text-sm text-zinc-900 dark:text-white uppercase tracking-wider">
                      {sec.id}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSectionToggle(sec.id, !sec.enabled)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-colors ${
                      sec.enabled
                        ? "bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400"
                        : "bg-zinc-500/10 border-zinc-500/20 text-zinc-500"
                    }`}
                  >
                    {sec.enabled ? (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        Tampilkan
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        Disembunyikan
                      </>
                    )}
                  </button>
                </div>

                {/* Section fields — only if enabled */}
                {sec.enabled && (
                  <div className="space-y-4">
                    {/* Title */}
                    {"title" in sec && (
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                          Judul Seksi (Title)
                        </label>
                        <input
                          type="text"
                          value={sec.title ?? ""}
                          onChange={(e) => handleSectionTextChange(sec.id, "title", e.target.value)}
                          className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
                        />
                      </div>
                    )}

                    {/* Subtitle */}
                    {"subtitle" in sec && (
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                          Sub-Judul / Slogan (Subtitle)
                        </label>
                        <textarea
                          value={sec.subtitle ?? ""}
                          onChange={(e) => handleSectionTextChange(sec.id, "subtitle", e.target.value)}
                          rows={2}
                          className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
                        />
                      </div>
                    )}

                    {/* Body */}
                    {"body" in sec && (
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                          Paragraf Konten (Body)
                        </label>
                        <textarea
                          value={sec.body ?? ""}
                          onChange={(e) => handleSectionTextChange(sec.id, "body", e.target.value)}
                          rows={4}
                          className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
                        />
                      </div>
                    )}

                    {/* Hero CTA fields */}
                    {sec.id === "hero" && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                            Teks Tombol (CTA Text)
                          </label>
                          <input
                            type="text"
                            value={sec.ctaText ?? ""}
                            onChange={(e) => handleSectionTextChange(sec.id, "ctaText", e.target.value)}
                            className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                            Link Tombol (CTA Link)
                          </label>
                          <div className="relative">
                            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
                            <input
                              type="text"
                              value={sec.ctaHref ?? ""}
                              onChange={(e) => handleSectionTextChange(sec.id, "ctaHref", e.target.value)}
                              className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm pl-9 pr-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Background image upload */}
                    {"bgImage" in sec && (
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                          Gambar Latar Banner (Background Image)
                        </label>
                        <div className="flex items-center gap-3">
                          <ImageIcon className="w-4 h-4 text-zinc-400 shrink-0" />
                          <input
                            type="text"
                            value={sec.bgImage ?? ""}
                            onChange={(e) => handleSectionTextChange(sec.id, "bgImage", e.target.value)}
                            className="flex-1 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
                          />
                          <label className="cursor-pointer inline-flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors border border-zinc-200 dark:border-zinc-800 shrink-0">
                            {uploadingField === sec.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Upload className="w-4 h-4" />
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, sec.id)}
                              className="hidden"
                              disabled={uploadingField === sec.id}
                            />
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </form>
      )}
    </div>
  );
}
