"use client";

import React, { useState } from "react";
import Image from "next/image";
import { saveProject, deleteProject } from "../../actions/dbActions";
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
  Loader2,
  CheckCircle,
  AlertCircle,
  Tag,
  DollarSign,
  AlertTriangle,
  Lightbulb,
  Clock,
  Palette,
  Users,
  Image as ImageIcon,
  Link as LinkIcon,
} from "lucide-react";

interface PortfolioFormProps {
  initialProjects: any[];
}

const EMPTY_PROJECT = {
  title: "",
  category: "residential",
  category_label: "Residensial",
  location: "",
  year: new Date().getFullYear().toString(),
  area: "",
  status: "Perencanaan",
  image_url: "",
  image_urls: [""],
  description: "",
  client: "",
  materials: [],
  tags: [],
  price: "",
  challenges: "",
  solutions: "",
  timeline: "",
  design: "",
  team_members: [],
  insights: "",
};

function TagInput({
  label,
  icon: Icon,
  items,
  onAdd,
  onRemove,
  placeholder,
}: {
  label: string;
  icon: React.ElementType;
  items: string[];
  onAdd: (val: string) => void;
  onRemove: (idx: number) => void;
  placeholder: string;
}) {
  const [input, setInput] = useState("");
  return (
    <div className="space-y-3">
      <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (input.trim()) { onAdd(input.trim()); setInput(""); }
            }
          }}
          placeholder={placeholder}
          className="flex-1 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
        />
        <button
          type="button"
          onClick={() => { if (input.trim()) { onAdd(input.trim()); setInput(""); } }}
          className="px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-white rounded-xl text-xs font-bold transition-colors"
        >
          Tambah
        </button>
      </div>
      <div className="flex flex-wrap gap-2 min-h-[2rem]">
        {items.map((item, idx) => (
          <span
            key={idx}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 text-xs font-semibold text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800"
          >
            <Icon className="w-3.5 h-3.5 text-zinc-400" />
            {item}
            <button type="button" onClick={() => onRemove(idx)} className="text-red-500 hover:text-red-600 ml-0.5">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function PortfolioForm({ initialProjects }: PortfolioFormProps) {
  const [projects, setProjects] = useState<any[]>(initialProjects || []);
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [activeSection, setActiveSection] = useState<"basic" | "detail" | "images">("basic");

  const handleOpenAdd = () => {
    setEditingProject({ ...EMPTY_PROJECT, materials: [], tags: [], team_members: [], image_urls: [""] });
    setShowForm(true);
    setMessage(null);
    setActiveSection("basic");
  };

  const handleOpenEdit = (proj: any) => {
    setEditingProject({
      ...EMPTY_PROJECT,
      ...proj,
      image_urls: proj.image_urls?.length ? proj.image_urls : proj.image_url ? [proj.image_url] : [""],
      materials: proj.materials || [],
      tags: proj.tags || [],
      team_members: proj.team_members || [],
    });
    setShowForm(true);
    setMessage(null);
    setActiveSection("basic");
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

  // Image URLs management
  const handleImageUrlChange = (idx: number, val: string) => {
    setEditingProject((prev: any) => {
      const urls = [...(prev.image_urls || [""])];
      urls[idx] = val;
      return { ...prev, image_urls: urls };
    });
  };

  const handleAddImageUrl = () => {
    setEditingProject((prev: any) => ({
      ...prev,
      image_urls: [...(prev.image_urls || []), ""],
    }));
  };

  const handleRemoveImageUrl = (idx: number) => {
    setEditingProject((prev: any) => {
      const urls = (prev.image_urls || []).filter((_: string, i: number) => i !== idx);
      return { ...prev, image_urls: urls.length ? urls : [""] };
    });
  };

  // Generic tag-style list handlers
  const makeListAdder = (field: string) => (val: string) => {
    setEditingProject((prev: any) => ({ ...prev, [field]: [...(prev[field] || []), val] }));
  };
  const makeListRemover = (field: string) => (idx: number) => {
    setEditingProject((prev: any) => ({
      ...prev,
      [field]: (prev[field] || []).filter((_: any, i: number) => i !== idx),
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    // Sync image_url to first of image_urls for backwards compat
    const payload = {
      ...editingProject,
      image_url: editingProject.image_urls?.[0] || editingProject.image_url || "",
      image_urls: (editingProject.image_urls || []).filter((u: string) => u.trim()),
    };

    const res = await saveProject(payload);
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

  const TABS = [
    { id: "basic", label: "Info Dasar" },
    { id: "detail", label: "Detail Proyek" },
    { id: "images", label: "Foto" },
  ] as const;

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
        <form onSubmit={handleSave} className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl shadow-sm transition-colors overflow-hidden">
          {/* Form Header */}
          <div className="flex items-center justify-between px-8 py-5 border-b border-zinc-200/50 dark:border-zinc-800/50">
            <h2 className="font-display font-extrabold text-lg text-zinc-900 dark:text-white">
              {editingProject.id ? "Edit Detail Proyek" : "Tambah Proyek Baru"}
            </h2>
            <button
              type="button"
              onClick={() => { setShowForm(false); setEditingProject(null); }}
              className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tab Nav */}
          <div className="flex border-b border-zinc-200/50 dark:border-zinc-800/50 px-8">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSection(tab.id)}
                className={`px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors -mb-px ${
                  activeSection === tab.id
                    ? "border-brand-amber-500 text-brand-amber-600 dark:text-brand-amber-400"
                    : "border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-8 space-y-6">

            {/* ── TAB: Info Dasar ── */}
            {activeSection === "basic" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Title */}
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Nama Proyek</label>
                    <input type="text" name="title" value={editingProject.title} onChange={handleInputChange} required
                      placeholder="Contoh: Villa Kayu Aruna"
                      className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Kategori</label>
                    <select name="category" value={editingProject.category} onChange={handleInputChange}
                      className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500">
                      <option value="residential">Residensial</option>
                      <option value="commercial">Komersial</option>
                      <option value="interior">Interior</option>
                    </select>
                  </div>

                  {/* Location */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Lokasi</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                      <input type="text" name="location" value={editingProject.location} onChange={handleInputChange} required
                        placeholder="SCBD, Jakarta"
                        className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm pl-11 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
                      />
                    </div>
                  </div>

                  {/* Year */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Tahun</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                      <input type="text" name="year" value={editingProject.year} onChange={handleInputChange} required
                        placeholder="2026"
                        className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm pl-11 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
                      />
                    </div>
                  </div>

                  {/* Area */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Luas Bangunan</label>
                    <div className="relative">
                      <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                      <input type="text" name="area" value={editingProject.area} onChange={handleInputChange} required
                        placeholder="240 m²"
                        className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm pl-11 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
                      />
                    </div>
                  </div>

                  {/* Client */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Nama Klien</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                      <input type="text" name="client" value={editingProject.client} onChange={handleInputChange} required
                        placeholder="Bpk. Adrian Wijaya"
                        className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm pl-11 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
                      />
                    </div>
                  </div>

                  {/* Status */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Status Proyek</label>
                    <select name="status" value={editingProject.status} onChange={handleInputChange}
                      className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500">
                      <option value="Selesai">Selesai</option>
                      <option value="Pembangunan">Pembangunan</option>
                      <option value="Perencanaan">Perencanaan</option>
                    </select>
                  </div>

                  {/* Price (optional) */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      Nilai Proyek <span className="normal-case font-normal text-zinc-400">(opsional)</span>
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                      <input type="text" name="price" value={editingProject.price || ""} onChange={handleInputChange}
                        placeholder="Rp 2,5 Miliar"
                        className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm pl-11 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
                      />
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Durasi Pengerjaan</label>
                    <div className="relative">
                      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                      <input type="text" name="timeline" value={editingProject.timeline || ""} onChange={handleInputChange}
                        placeholder="8 bulan"
                        className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm pl-11 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
                      />
                    </div>
                  </div>

                  {/* Design */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Gaya Desain</label>
                    <div className="relative">
                      <Palette className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                      <input type="text" name="design" value={editingProject.design || ""} onChange={handleInputChange}
                        placeholder="Modern Tropis"
                        className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm pl-11 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Deskripsi Lengkap Proyek</label>
                  <textarea name="description" value={editingProject.description} onChange={handleInputChange} required rows={4}
                    placeholder="Jelaskan detail lingkup pengerjaan arsitektur, interior, struktur bangunan..."
                    className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
                  />
                </div>

                {/* Materials & Tags */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <TagInput label="Material Utama" icon={Layers} items={editingProject.materials || []}
                    onAdd={makeListAdder("materials")} onRemove={makeListRemover("materials")}
                    placeholder="Contoh: Beton K-350" />
                  <TagInput label="Tags" icon={Tag} items={editingProject.tags || []}
                    onAdd={makeListAdder("tags")} onRemove={makeListRemover("tags")}
                    placeholder="Contoh: eco-friendly" />
                </div>

                {/* Team Members */}
                <TagInput label="Tim Pelaksana" icon={Users} items={editingProject.team_members || []}
                  onAdd={makeListAdder("team_members")} onRemove={makeListRemover("team_members")}
                  placeholder="Contoh: Ir. Hermawan (Lead Architect)" />
              </>
            )}

            {/* ── TAB: Detail Proyek ── */}
            {activeSection === "detail" && (
              <div className="space-y-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" /> Tantangan Proyek
                  </label>
                  <textarea name="challenges" value={editingProject.challenges || ""} onChange={handleInputChange} rows={3}
                    placeholder="Jelaskan tantangan atau kendala yang dihadapi selama proyek..."
                    className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5" /> Solusi & Pendekatan
                  </label>
                  <textarea name="solutions" value={editingProject.solutions || ""} onChange={handleInputChange} rows={3}
                    placeholder="Bagaimana tim mengatasi tantangan tersebut..."
                    className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5" /> Insights & Pelajaran
                  </label>
                  <textarea name="insights" value={editingProject.insights || ""} onChange={handleInputChange} rows={3}
                    placeholder="Pelajaran atau insight berharga dari proyek ini..."
                    className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
                  />
                </div>
              </div>
            )}

            {/* ── TAB: Foto ── */}
            {activeSection === "images" && (
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
                    URL Foto Proyek
                  </p>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-4">
                    Upload gambar ke Discord, klik kanan → Salin tautan gambar, lalu paste di sini. Foto pertama akan jadi cover.
                  </p>
                </div>

                <div className="space-y-3">
                  {(editingProject.image_urls || [""]).map((url: string, idx: number) => (
                    <div key={idx} className="flex gap-3 items-start">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider w-14 shrink-0">
                            {idx === 0 ? "Cover" : `Foto ${idx + 1}`}
                          </span>
                          <div className="relative flex-1">
                            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
                            <input
                              type="url"
                              value={url}
                              onChange={(e) => handleImageUrlChange(idx, e.target.value)}
                              placeholder="https://cdn.discordapp.com/attachments/..."
                              className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm pl-9 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveImageUrl(idx)}
                            disabled={(editingProject.image_urls || []).length <= 1}
                            className="p-2 rounded-xl text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors disabled:opacity-30 disabled:pointer-events-none"
                            aria-label="Remove image"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        {/* Preview */}
                        {url && url.startsWith("http") && (
                          <div className="ml-16 relative aspect-video max-w-xs rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-950">
                            <Image src={url} alt={`Preview ${idx + 1}`} fill className="object-cover" unoptimized />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-brand-amber-400 hover:text-brand-amber-600 dark:hover:text-brand-amber-400 text-xs font-bold transition-colors"
                >
                  <PlusCircle className="w-4 h-4" />
                  Tambah Foto Lagi
                </button>
              </div>
            )}
          </div>

          {/* Save/Cancel Controls */}
          <div className="flex justify-between items-center px-8 py-5 border-t border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-950/30">
            <div className="flex gap-1">
              {TABS.map((tab) => (
                <div
                  key={tab.id}
                  className={`w-2 h-2 rounded-full transition-colors ${activeSection === tab.id ? "bg-brand-amber-500" : "bg-zinc-300 dark:bg-zinc-700"}`}
                />
              ))}
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => { setShowForm(false); setEditingProject(null); }}
                className="px-5 py-2.5 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-zinc-900 hover:bg-brand-amber-600 dark:bg-zinc-100 dark:hover:bg-brand-amber-500 dark:text-zinc-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Simpan Proyek
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Projects Grid */}
      {!showForm && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.length === 0 && (
            <div className="md:col-span-3 flex flex-col items-center justify-center py-20 text-center space-y-3 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl">
              <ImageIcon className="w-10 h-10 text-zinc-300 dark:text-zinc-700" />
              <p className="text-sm font-semibold text-zinc-400">Belum ada proyek. Tambah yang pertama!</p>
            </div>
          )}
          {projects.map((project) => {
            const coverUrl = project.image_urls?.[0] || project.image_url || "";
            const extraCount = (project.image_urls?.length || 0) - 1;
            return (
              <div
                key={project.id}
                className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between transition-all hover:shadow-md"
              >
                <div className="space-y-3">
                  {/* Cover Photo */}
                  <div className="relative aspect-video w-full bg-zinc-100 dark:bg-zinc-950">
                    {coverUrl ? (
                      <Image src={coverUrl} alt={project.title} fill className="object-cover" unoptimized />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-zinc-300 dark:text-zinc-700">
                        <ImageIcon className="w-8 h-8" />
                      </div>
                    )}
                    <span className="absolute top-3 left-3 px-2 py-1 rounded bg-black/60 backdrop-blur-sm text-[9px] font-bold text-white uppercase tracking-wider">
                      {project.status}
                    </span>
                    {extraCount > 0 && (
                      <span className="absolute top-3 right-3 px-2 py-1 rounded bg-black/60 backdrop-blur-sm text-[9px] font-bold text-white">
                        +{extraCount} foto
                      </span>
                    )}
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
                    {project.design && (
                      <div className="flex items-center gap-1 text-[11px] text-zinc-400">
                        <Palette className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{project.design}</span>
                      </div>
                    )}
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2 pt-1">
                      {project.description}
                    </p>
                    {project.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {project.tags.slice(0, 3).map((tag: string, i: number) => (
                          <span key={i} className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-[10px] font-semibold rounded-lg">
                            {tag}
                          </span>
                        ))}
                        {project.tags.length > 3 && (
                          <span className="px-2 py-0.5 text-[10px] text-zinc-400">+{project.tags.length - 3}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-5 pb-5 pt-3 flex items-center justify-end gap-2 border-t border-zinc-100 dark:border-zinc-800/40">
                  <button onClick={() => handleOpenEdit(project)}
                    className="p-2 text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg transition-colors border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
                    aria-label="Edit project">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(project.id)} disabled={deletingId === project.id}
                    className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors border border-transparent hover:border-red-200 dark:hover:border-red-900/30"
                    aria-label="Delete project">
                    {deletingId === project.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
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
