"use client";

import React, { useState } from "react";
import Image from "next/image";
import { saveProject, deleteProject, uploadImage } from "../../actions/dbActions";
import {
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  PlusCircle,
  MapPin,
  Calendar,
  Ruler,
  User,
  Layers,
  Upload,
  Loader2,
  CheckCircle,
  AlertCircle
} from "lucide-react";

interface PortfolioFormProps {
  initialProjects: any[];
}

export default function PortfolioForm({ initialProjects }: PortfolioFormProps) {
  const [projects, setProjects] = useState<any[]>(initialProjects || []);
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [newMaterial, setNewMaterial] = useState("");

  const handleOpenAdd = () => {
    setEditingProject({
      title: "",
      category: "residential",
      category_label: "Residensial",
      location: "",
      year: new Date().getFullYear().toString(),
      area: "",
      status: "Perencanaan",
      image_url: "",
      description: "",
      client: "",
      materials: []
    });
    setShowForm(true);
    setMessage(null);
  };

  const handleOpenEdit = (proj: any) => {
    setEditingProject({ ...proj });
    setShowForm(true);
    setMessage(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditingProject((prev: any) => {
      const update = { ...prev, [name]: value };
      if (name === "category") {
        if (value === "residential") update.category_label = "Residensial";
        if (value === "commercial") update.category_label = "Komersial";
        if (value === "interior") update.category_label = "Interior";
      }
      return update;
    });
  };

  const handleAddMaterial = () => {
    if (!newMaterial.trim()) return;
    setEditingProject((prev: any) => ({
      ...prev,
      materials: [...prev.materials, newMaterial.trim()]
    }));
    setNewMaterial("");
  };

  const handleRemoveMaterial = (idx: number) => {
    setEditingProject((prev: any) => ({
      ...prev,
      materials: prev.materials.filter((_: any, i: number) => i !== idx)
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("file", file);

    const res = await uploadImage(formData);
    setUploading(false);

    if (res.error) {
      setMessage({ type: "error", text: `Gagal mengunggah gambar: ${res.error}` });
    } else if (res.url) {
      setEditingProject((prev: any) => ({ ...prev, image_url: res.url }));
      setMessage({ type: "success", text: "Gambar berhasil diunggah!" });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const res = await saveProject(editingProject);
    setSaving(false);

    if (res.error) {
      setMessage({ type: "error", text: `Gagal menyimpan proyek: ${res.error}` });
    } else {
      setMessage({ type: "success", text: "Proyek berhasil disimpan!" });
      setShowForm(false);
      setEditingProject(null);
      window.location.reload();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus proyek portofolio ini?")) return;
    setDeletingId(id);
    setMessage(null);

    const res = await deleteProject(id);
    setDeletingId(null);

    if (res.error) {
      setMessage({ type: "error", text: `Gagal menghapus proyek: ${res.error}` });
    } else {
      setMessage({ type: "success", text: "Proyek berhasil dihapus!" });
      window.location.reload();
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-extrabold text-3xl text-zinc-900 dark:text-white">
            Kelola Portofolio
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Kelola proyek konstruksi, villa, interior, dan status pengerjaan proyek
          </p>
        </div>
        {!showForm && (
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-brand-amber-600 dark:bg-zinc-100 dark:hover:bg-brand-amber-500 dark:text-zinc-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            Tambah Proyek
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

      {/* Form Editor */}
      {showForm && editingProject && (
        <form onSubmit={handleSave} className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-8 shadow-sm space-y-6 transition-colors">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-200/50 dark:border-zinc-800/50 text-zinc-900 dark:text-white">
            <h2 className="font-display font-extrabold text-lg">
              {editingProject.id ? "Edit Detail Proyek" : "Tambah Proyek Baru"}
            </h2>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingProject(null);
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
                Nama Proyek
              </label>
              <input
                type="text"
                name="title"
                value={editingProject.title}
                onChange={handleInputChange}
                required
                placeholder="Contoh: Villa Kayu Aruna"
                className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
              />
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Kategori
              </label>
              <select
                name="category"
                value={editingProject.category}
                onChange={handleInputChange}
                className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
              >
                <option value="residential">Residensial</option>
                <option value="commercial">Komersial</option>
                <option value="interior">Interior</option>
              </select>
            </div>

            {/* Location */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Lokasi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="location"
                  value={editingProject.location}
                  onChange={handleInputChange}
                  required
                  placeholder="SCBD, Jakarta"
                  className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm pl-11 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
                />
              </div>
            </div>

            {/* Year */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Tahun
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400">
                  <Calendar className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="year"
                  value={editingProject.year}
                  onChange={handleInputChange}
                  required
                  placeholder="2026"
                  className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm pl-11 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
                />
              </div>
            </div>

            {/* Area Size */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Luas Bangunan
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400">
                  <Ruler className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="area"
                  value={editingProject.area}
                  onChange={handleInputChange}
                  required
                  placeholder="240 m²"
                  className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm pl-11 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
                />
              </div>
            </div>

            {/* Client */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Nama Klien
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="client"
                  value={editingProject.client}
                  onChange={handleInputChange}
                  required
                  placeholder="Bpk. Adrian Wijaya"
                  className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm pl-11 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
                />
              </div>
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Status Proyek
              </label>
              <select
                name="status"
                value={editingProject.status}
                onChange={handleInputChange}
                className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
              >
                <option value="Selesai">Selesai</option>
                <option value="Pembangunan">Pembangunan</option>
                <option value="Perencanaan">Perencanaan</option>
              </select>
            </div>

            {/* Image URL Upload */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Foto Proyek
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  name="image_url"
                  value={editingProject.image_url}
                  onChange={handleInputChange}
                  required
                  placeholder="/images/modern_villa.png"
                  className="flex-1 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
                />
                <label className="cursor-pointer inline-flex items-center justify-center p-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-850 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors border border-zinc-200 dark:border-zinc-800">
                  {uploading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-brand-amber-500" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Deskripsi Lengkap Proyek
            </label>
            <textarea
              name="description"
              value={editingProject.description}
              onChange={handleInputChange}
              required
              rows={4}
              placeholder="Jelaskan detail lingkup pengerjaan arsitektur, interior, struktur bangunan..."
              className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
            />
          </div>

          {/* Materials Tag List */}
          <div className="space-y-4">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block border-b border-zinc-100 dark:border-zinc-800 pb-2">
              Spesifikasi Material Utama
            </label>
            <div className="flex gap-2 max-w-md">
              <input
                type="text"
                value={newMaterial}
                onChange={(e) => setNewMaterial(e.target.value)}
                placeholder="Contoh: Beton K-350"
                className="flex-1 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
              />
              <button
                type="button"
                onClick={handleAddMaterial}
                className="px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-white rounded-xl text-xs font-bold"
              >
                Tambah
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {editingProject.materials?.map((mat: string, idx: number) => (
                <span
                  key={idx}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 text-xs font-semibold text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800"
                >
                  <Layers className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{mat}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveMaterial(idx)}
                    className="text-red-500 hover:text-red-750"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Thumbnail preview */}
          {editingProject.image_url && (
            <div className="relative aspect-video max-w-sm rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-950">
              <Image
                src={editingProject.image_url}
                alt="Upload preview"
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Save/Cancel Controls */}
          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-200/50 dark:border-zinc-800/50">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingProject(null);
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
              Simpan Proyek
            </button>
          </div>
        </form>
      )}

      {/* Projects Grid Display */}
      {!showForm && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between transition-all hover:shadow-md border-transparent"
            >
              <div className="space-y-3">
                {/* Photo frame */}
                <div className="relative aspect-video w-full bg-zinc-100 dark:bg-zinc-950">
                  <Image
                    src={project.image_url}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                  {/* Status */}
                  <span className="absolute top-3 left-3 px-2 py-1 rounded bg-black/60 backdrop-blur-sm text-[9px] font-bold text-white uppercase tracking-wider">
                    {project.status}
                  </span>
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-bold text-brand-amber-600 dark:text-brand-amber-500 uppercase tracking-wider">
                    <span>{project.category_label}</span>
                    <span>{project.year}</span>
                  </div>
                  <h3 className="font-display font-bold text-base text-zinc-900 dark:text-white line-clamp-1">
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-1 text-[11px] text-zinc-500">
                    <MapPin className="w-3.5 h-3.5 shrink-0 text-zinc-400" />
                    <span className="truncate">{project.location}</span>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2 pt-1">
                    {project.description}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-3 flex items-center justify-end gap-2 border-t border-zinc-100 dark:border-zinc-800/40">
                <button
                  onClick={() => handleOpenEdit(project)}
                  className="p-2 text-zinc-500 hover:text-zinc-850 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg transition-colors border border-transparent hover:border-zinc-250"
                  aria-label="Edit project"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  disabled={deletingId === project.id}
                  className="p-2 text-red-500 hover:text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors border border-transparent hover:border-red-250"
                  aria-label="Delete project"
                >
                  {deletingId === project.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
