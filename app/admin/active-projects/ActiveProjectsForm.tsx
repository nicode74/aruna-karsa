"use client";

import React, { useState } from "react";
import { saveActiveProject, deleteActiveProject } from "../../actions/dbActions";
import {
  Save,
  Plus,
  Trash2,
  Edit,
  Loader2,
  CheckCircle,
  AlertCircle,
  Wrench,
  X,
  User,
  Calendar,
  Percent,
} from "lucide-react";

interface ActiveProject {
  id?: string;
  name: string;
  client_name: string;
  status: "Perencanaan" | "Konstruksi" | "Finishing" | "Selesai";
  progress_percentage: number;
  start_date: string;
  target_date: string;
  description: string;
}

interface ActiveProjectsFormProps {
  initialProjects: ActiveProject[];
}

export default function ActiveProjectsForm({ initialProjects }: ActiveProjectsFormProps) {
  const [projects, setProjects] = useState<ActiveProject[]>(initialProjects || []);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<ActiveProject | null>(null);
  
  // Form states
  const [formData, setFormData] = useState<ActiveProject>({
    name: "",
    client_name: "",
    status: "Perencanaan",
    progress_percentage: 0,
    start_date: "",
    target_date: "",
    description: "",
  });

  const openCreateModal = () => {
    setEditingProject(null);
    setFormData({
      name: "",
      client_name: "",
      status: "Perencanaan",
      progress_percentage: 0,
      start_date: "",
      target_date: "",
      description: "",
    });
    setMessage(null);
    setShowModal(true);
  };

  const openEditModal = (project: ActiveProject) => {
    setEditingProject(project);
    setFormData({ ...project });
    setMessage(null);
    setShowModal(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "progress_percentage") {
      setFormData((prev) => ({ ...prev, [name]: Math.min(100, Math.max(0, parseInt(value) || 0)) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const payload = editingProject ? { id: editingProject.id, ...formData } : formData;
    const res = await saveActiveProject(payload);
    
    setSaving(false);

    if (res.error) {
      setMessage({ type: "error", text: `Gagal menyimpan proyek: ${res.error}` });
    } else {
      setMessage({
        type: "success",
        text: `Proyek "${formData.name}" berhasil disimpan! Silakan segarkan halaman untuk melihat pembaruan.`,
      });
      setShowModal(false);
      // Reload page content using standard route navigation
      window.location.reload();
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus proyek "${name}"?`)) return;

    setLoadingId(id);
    setMessage(null);

    const res = await deleteActiveProject(id);
    setLoadingId(null);

    if (res.error) {
      setMessage({ type: "error", text: `Gagal menghapus proyek: ${res.error}` });
    } else {
      setMessage({ type: "success", text: `Proyek "${name}" berhasil dihapus!` });
      setProjects((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-3xl text-zinc-900 dark:text-white">
            Kelola Proyek Berjalan
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Pantau dan perbarui progres proyek konstruksi aktif yang sedang dikerjakan.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-brand-amber-500 hover:bg-brand-amber-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-brand-amber-500/10 hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4" />
          Tambah Proyek
        </button>
      </div>

      {/* Alert Messages */}
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

      {/* Main List */}
      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 bg-white dark:bg-zinc-900 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-3xl text-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-brand-amber-500/10 flex items-center justify-center">
            <Wrench className="w-7 h-7 text-brand-amber-500" />
          </div>
          <div>
            <p className="font-display font-bold text-lg text-zinc-900 dark:text-white">Belum ada proyek berjalan</p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm">
              Klik tombol di atas untuk menambahkan proyek pertama yang akan ditampilkan di landing page.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((p) => (
            <div
              key={p.id}
              className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                      p.status === "Konstruksi"
                        ? "bg-brand-amber-500/10 text-brand-amber-600 dark:text-brand-amber-500"
                        : p.status === "Finishing"
                        ? "bg-green-500/10 text-green-600 dark:text-green-500"
                        : p.status === "Perencanaan"
                        ? "bg-blue-500/10 text-blue-600 dark:text-blue-500"
                        : "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400"
                    }`}
                  >
                    {p.status}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(p)}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-brand-amber-500 dark:hover:text-brand-amber-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                      title="Edit Proyek"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => p.id && handleDelete(p.id, p.name)}
                      disabled={loadingId === p.id}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
                      title="Hapus Proyek"
                    >
                      {loadingId === p.id ? (
                        <Loader2 className="w-4 h-4 animate-spin text-brand-amber-500" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="font-display font-extrabold text-lg text-zinc-900 dark:text-white">
                    {p.name}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold flex items-center gap-1">
                    <User className="w-3.5 h-3.5" />
                    Klien: {p.client_name}
                  </p>
                </div>

                <p className="text-sm text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed line-clamp-3">
                  {p.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800/50 space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-zinc-500 dark:text-zinc-400">
                    <span>Progress Pembangunan</span>
                    <span>{p.progress_percentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-950 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-amber-500 rounded-full transition-all duration-300"
                      style={{ width: `${p.progress_percentage}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-between text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                  <span>Mulai: {p.start_date || "-"}</span>
                  <span>Target: {p.target_date || "-"}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 overflow-y-auto">
          <div className="bg-white dark:bg-zinc-950 rounded-3xl max-w-lg w-full border border-zinc-200 dark:border-zinc-800 shadow-2xl relative overflow-hidden my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="font-display font-extrabold text-lg text-zinc-900 dark:text-white">
                {editingProject ? "Edit Proyek Aktif" : "Tambah Proyek Aktif Baru"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-lg bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 text-zinc-500 dark:text-zinc-400 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Nama Proyek</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. Konstruksi Villa Jimbaran"
                  className="w-full bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white text-sm px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Nama Klien</label>
                  <input
                    type="text"
                    name="client_name"
                    value={formData.client_name}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. Bpk. Hendra"
                    className="w-full bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white text-sm px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Status Proyek</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white text-sm px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500 cursor-pointer"
                  >
                    <option value="Perencanaan">Perencanaan</option>
                    <option value="Konstruksi">Konstruksi</option>
                    <option value="Finishing">Finishing</option>
                    <option value="Selesai">Selesai</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                    <Percent className="w-3.5 h-3.5" /> Progress (%)
                  </label>
                  <input
                    type="number"
                    name="progress_percentage"
                    value={formData.progress_percentage}
                    onChange={handleInputChange}
                    min={0}
                    max={100}
                    required
                    className="w-full bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white text-sm px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Tanggal Mulai</label>
                  <input
                    type="text"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleInputChange}
                    placeholder="e.g. Maret 2026"
                    className="w-full bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white text-sm px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Tanggal Target Penyelesaian</label>
                <input
                  type="text"
                  name="target_date"
                  value={formData.target_date}
                  onChange={handleInputChange}
                  placeholder="e.g. Desember 2026"
                  className="w-full bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white text-sm px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Keterangan / Detail Pekerjaan</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Tuliskan secara singkat pengerjaan yang sedang dilakukan..."
                  className="w-full bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white text-sm px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 font-semibold text-xs uppercase tracking-wider hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-zinc-900 hover:bg-brand-amber-500 text-white dark:bg-zinc-100 dark:hover:bg-brand-amber-500 dark:text-zinc-900 font-bold text-xs uppercase tracking-wider rounded-xl transition-all disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Simpan Proyek
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
