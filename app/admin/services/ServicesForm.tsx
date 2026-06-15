"use client";

import React, { useState } from "react";
import { saveService, deleteService } from "../../actions/dbActions";
import {
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  ListPlus,
  Loader2,
  CheckCircle,
  AlertCircle,
  PenTool,
  HardHat,
  Sofa,
  FileSpreadsheet,
  HelpCircle
} from "lucide-react";

interface ServicesFormProps {
  initialServices: any[];
}

const ICON_MAP: Record<string, any> = {
  PenTool,
  HardHat,
  Sofa,
  FileSpreadsheet
};

export default function ServicesForm({ initialServices }: ServicesFormProps) {
  const [services, setServices] = useState<any[]>(initialServices || []);
  const [editingService, setEditingService] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Feature item input states
  const [newFeature, setNewFeature] = useState("");

  const handleOpenAdd = () => {
    setEditingService({
      title: "",
      description: "",
      icon_name: "PenTool",
      features: [],
      display_order: services.length + 1
    });
    setShowForm(true);
    setMessage(null);
  };

  const handleOpenEdit = (srv: any) => {
    setEditingService({ ...srv });
    setShowForm(true);
    setMessage(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditingService((prev: any) => ({
      ...prev,
      [name]: name === "display_order" ? parseInt(value) || 0 : value
    }));
  };

  const handleAddFeature = () => {
    if (!newFeature.trim()) return;
    setEditingService((prev: any) => ({
      ...prev,
      features: [...prev.features, newFeature.trim()]
    }));
    setNewFeature("");
  };

  const handleRemoveFeature = (idx: number) => {
    setEditingService((prev: any) => ({
      ...prev,
      features: prev.features.filter((_: any, i: number) => i !== idx)
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const res = await saveService(editingService);
    setSaving(false);

    if (res.error) {
      setMessage({ type: "error", text: `Gagal menyimpan layanan: ${res.error}` });
    } else {
      setMessage({ type: "success", text: "Layanan berhasil disimpan!" });
      setShowForm(false);
      setEditingService(null);
      // Reload page state or re-fetch (we do reload for simplicity to sync Supabase)
      window.location.reload();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus layanan ini?")) return;
    setDeletingId(id);
    setMessage(null);

    const res = await deleteService(id);
    setDeletingId(null);

    if (res.error) {
      setMessage({ type: "error", text: `Gagal menghapus layanan: ${res.error}` });
    } else {
      setMessage({ type: "success", text: "Layanan berhasil dihapus!" });
      window.location.reload();
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-extrabold text-3xl text-zinc-900 dark:text-white">
            Kelola Layanan
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Tambah, edit, atau hapus bidang layanan konstruksi yang ditawarkan
          </p>
        </div>
        {!showForm && (
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-brand-amber-600 dark:bg-zinc-100 dark:hover:bg-brand-amber-500 dark:text-zinc-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            Tambah Layanan
          </button>
        )}
      </div>

      {/* Alert Message */}
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

      {/* CRUD Form */}
      {showForm && editingService && (
        <form onSubmit={handleSave} className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-8 shadow-sm space-y-6 transition-colors">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-200/50 dark:border-zinc-800/50 text-zinc-900 dark:text-white">
            <h2 className="font-display font-extrabold text-lg">
              {editingService.id ? "Edit Detail Layanan" : "Tambah Layanan Baru"}
            </h2>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingService(null);
              }}
              className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Title */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Nama Layanan
              </label>
              <input
                type="text"
                name="title"
                value={editingService.title}
                onChange={handleInputChange}
                required
                placeholder="Contoh: Desain Interior"
                className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
              />
            </div>

            {/* Icon Name Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Pilih Icon
              </label>
              <select
                name="icon_name"
                value={editingService.icon_name}
                onChange={handleInputChange}
                className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
              >
                <option value="PenTool">PenTool (Desain/Arsitek)</option>
                <option value="HardHat">HardHat (Kontraktor/Bangun)</option>
                <option value="Sofa">Sofa (Interior/Mebel)</option>
                <option value="FileSpreadsheet">FileSpreadsheet (RAB)</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Deskripsi Singkat
            </label>
            <textarea
              name="description"
              value={editingService.description}
              onChange={handleInputChange}
              required
              rows={3}
              placeholder="Deskripsikan layanan ini secara singkat dan informatif..."
              className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Features (Bullet points) */}
            <div className="space-y-4">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block border-b border-zinc-150 dark:border-zinc-800 pb-1.5">
                Fitur / Detail Sub-Layanan
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Tambahkan sub-item fitur..."
                  className="flex-1 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="p-3 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-white rounded-xl"
                >
                  <ListPlus className="w-4 h-4" />
                </button>
              </div>
              <ul className="space-y-2">
                {editingService.features?.map((feat: string, idx: number) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between p-2.5 bg-zinc-50 dark:bg-zinc-950 rounded-xl text-xs text-zinc-700 dark:text-zinc-300 border border-zinc-200/60 dark:border-zinc-800/60"
                  >
                    <span>{feat}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(idx)}
                      className="text-red-500 hover:text-red-650"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Display Order */}
            <div className="space-y-4">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block border-b border-zinc-150 dark:border-zinc-800 pb-1.5">
                Urutan Tampilan
              </label>
              <input
                type="number"
                name="display_order"
                value={editingService.display_order}
                onChange={handleInputChange}
                required
                className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
              />
              <p className="text-[10px] text-zinc-400 leading-relaxed">
                Menentukan urutan kemunculan layanan di halaman. Layanan dengan nilai lebih kecil akan muncul lebih awal.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-200/50 dark:border-zinc-800/50">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingService(null);
              }}
              className="px-5 py-2.5 border border-zinc-200 dark:border-zinc-800 text-zinc-750 dark:text-zinc-300 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-zinc-900 hover:bg-brand-amber-600 dark:bg-zinc-100 dark:hover:bg-brand-amber-500 dark:text-zinc-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Simpan Layanan
            </button>
          </div>
        </form>
      )}

      {/* Services List Display */}
      {!showForm && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((srv) => {
            const Icon = ICON_MAP[srv.icon_name] || HelpCircle;
            return (
              <div
                key={srv.id}
                className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-6 shadow-sm space-y-4 flex flex-col justify-between transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-brand-amber-500/10 text-brand-amber-600 dark:text-brand-amber-500 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                      Urutan: {srv.display_order}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-lg text-zinc-900 dark:text-white">
                    {srv.title}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2">
                    {srv.description}
                  </p>
                  {srv.features?.length > 0 && (
                    <div className="pt-2">
                      <p className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-wider mb-1">Sub Fitur:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {srv.features.map((feat: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-2 py-1 rounded bg-zinc-50 dark:bg-zinc-950 text-[10px] font-medium text-zinc-600 dark:text-zinc-400 border border-zinc-150 dark:border-zinc-800/40"
                          >
                            {feat}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2 pt-4 border-t border-zinc-100 dark:border-zinc-800/40">
                  <button
                    onClick={() => handleOpenEdit(srv)}
                    className="p-2 text-zinc-500 hover:text-zinc-850 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg transition-colors border border-transparent hover:border-zinc-250 dark:hover:border-zinc-700"
                    aria-label="Edit service"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(srv.id)}
                    disabled={deletingId === srv.id}
                    className="p-2 text-red-500 hover:text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors border border-transparent hover:border-red-250 dark:hover:border-red-900/40"
                    aria-label="Delete service"
                  >
                    {deletingId === srv.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
