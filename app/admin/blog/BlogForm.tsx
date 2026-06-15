"use client";

import React, { useState } from "react";
import Image from "next/image";
import { saveBlogPost, deleteBlogPost, uploadImage } from "../../actions/dbActions";
import {
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  FileText,
  Calendar,
  Clock,
  User,
  Upload,
  Loader2,
  CheckCircle,
  AlertCircle,
  Globe
} from "lucide-react";

interface BlogFormProps {
  initialPosts: any[];
}

export default function BlogForm({ initialPosts }: BlogFormProps) {
  const [posts, setPosts] = useState<any[]>(initialPosts || []);
  const [editingPost, setEditingPost] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleOpenAdd = () => {
    const today = new Date();
    const months = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    const formattedDate = `${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;

    setEditingPost({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      category: "Arsitektur",
      author: "Admin Aruna",
      date: formattedDate,
      read_time: "5 Menit Baca",
      image_url: "",
      is_published: true
    });
    setShowForm(true);
    setMessage(null);
  };

  const handleOpenEdit = (post: any) => {
    setEditingPost({ ...post });
    setShowForm(true);
    setMessage(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditingPost((prev: any) => {
      const update = { ...prev, [name]: value };
      if (name === "title" && !prev.id) {
        // Only auto-generate slug for new posts
        update.slug = slugify(value);
      }
      return update;
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setEditingPost((prev: any) => ({ ...prev, [name]: checked }));
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
      setEditingPost((prev: any) => ({ ...prev, image_url: res.url }));
      setMessage({ type: "success", text: "Gambar artikel berhasil diunggah!" });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const res = await saveBlogPost(editingPost);
    setSaving(false);

    if (res.error) {
      setMessage({ type: "error", text: `Gagal menyimpan artikel: ${res.error}` });
    } else {
      setMessage({ type: "success", text: "Artikel berhasil disimpan!" });
      setShowForm(false);
      setEditingPost(null);
      window.location.reload();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus artikel blog ini?")) return;
    setDeletingId(id);
    setMessage(null);

    const res = await deleteBlogPost(id);
    setDeletingId(null);

    if (res.error) {
      setMessage({ type: "error", text: `Gagal menghapus artikel: ${res.error}` });
    } else {
      setMessage({ type: "success", text: "Artikel berhasil dihapus!" });
      window.location.reload();
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-extrabold text-3xl text-zinc-900 dark:text-white">
            Kelola Blog
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Tulis tips budget bangunan, info arsitektur, dan tren konstruksi terbaru
          </p>
        </div>
        {!showForm && (
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-brand-amber-600 dark:bg-zinc-100 dark:hover:bg-brand-amber-500 dark:text-zinc-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            Tulis Artikel
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
      {showForm && editingPost && (
        <form onSubmit={handleSave} className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-8 shadow-sm space-y-6 transition-colors">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-200/50 dark:border-zinc-800/50 text-zinc-900 dark:text-white">
            <h2 className="font-display font-extrabold text-lg">
              {editingPost.id ? "Edit Artikel" : "Tulis Artikel Baru"}
            </h2>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingPost(null);
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
                Judul Artikel
              </label>
              <input
                type="text"
                name="title"
                value={editingPost.title}
                onChange={handleInputChange}
                required
                placeholder="Contoh: Panduan Menghitung RAB Rumah Minimalis"
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
                value={editingPost.category}
                onChange={handleInputChange}
                className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
              >
                <option value="Tips Budget">Tips Budget</option>
                <option value="Konstruksi">Konstruksi</option>
                <option value="Arsitektur">Arsitektur</option>
                <option value="Interior">Interior</option>
              </select>
            </div>

            {/* Slug */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Slug URL (Unique Identifier)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400">
                  <Globe className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="slug"
                  value={editingPost.slug}
                  onChange={handleInputChange}
                  required
                  placeholder="panduan-menghitung-rab"
                  className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm pl-11 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
                />
              </div>
            </div>

            {/* Author */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Nama Penulis
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="author"
                  value={editingPost.author}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm pl-11 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
                />
              </div>
            </div>

            {/* Read Time */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Estimasi Baca
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400">
                  <Clock className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="read_time"
                  value={editingPost.read_time}
                  onChange={handleInputChange}
                  required
                  placeholder="5 Menit Baca"
                  className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm pl-11 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
                />
              </div>
            </div>

            {/* Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Tanggal Publikasi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400">
                  <Calendar className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="date"
                  value={editingPost.date}
                  onChange={handleInputChange}
                  required
                  placeholder="12 Juni 2026"
                  className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm pl-11 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
                />
              </div>
            </div>

            {/* Image URL Upload */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Cover Header Banner
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  name="image_url"
                  value={editingPost.image_url}
                  onChange={handleInputChange}
                  required
                  placeholder="/images/construction_site.png"
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

            {/* Publish Toggle */}
            <div className="flex items-center gap-3 pt-6">
              <input
                type="checkbox"
                id="is_published"
                name="is_published"
                checked={editingPost.is_published}
                onChange={handleCheckboxChange}
                className="w-4 h-4 text-brand-amber-500 border-zinc-300 rounded focus:ring-brand-amber-500/20"
              />
              <label
                htmlFor="is_published"
                className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 select-none cursor-pointer"
              >
                Publikasikan Artikel
              </label>
            </div>
          </div>

          {/* Excerpt */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Ringkasan Singkat (Excerpt)
            </label>
            <textarea
              name="excerpt"
              value={editingPost.excerpt}
              onChange={handleInputChange}
              required
              rows={2}
              maxLength={200}
              placeholder="Ringkasan singkat artikel yang akan muncul di daftar blog (maksimal 200 karakter)..."
              className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
            />
          </div>

          {/* Content Body */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block border-b border-zinc-100 dark:border-zinc-800 pb-2">
              Isi Artikel (Mendukung tag HTML seperti &lt;h3&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;, &lt;blockquote&gt;)
            </label>
            <textarea
              name="content"
              value={editingPost.content}
              onChange={handleInputChange}
              required
              rows={12}
              placeholder="Tulis konten artikel di sini dengan format HTML..."
              className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm font-mono px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
            />
          </div>

          {/* Thumbnail Preview */}
          {editingPost.image_url && (
            <div className="relative aspect-video max-w-sm rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-950">
              <Image
                src={editingPost.image_url}
                alt="Banner preview"
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
                setEditingPost(null);
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
              Simpan Artikel
            </button>
          </div>
        </form>
      )}

      {/* Posts List Display */}
      {!showForm && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between transition-colors"
            >
              <div className="space-y-3">
                {/* Photo frame */}
                <div className="relative aspect-video w-full bg-zinc-100 dark:bg-zinc-950">
                  <Image
                    src={post.image_url}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                  {/* Category */}
                  <span className="absolute top-3 left-3 px-2 py-1 rounded bg-black/60 backdrop-blur-sm text-[9px] font-bold text-white uppercase tracking-wider">
                    {post.category}
                  </span>
                  {/* Status */}
                  <span className={`absolute top-3 right-3 px-2 py-1 rounded text-[9px] font-bold text-white uppercase tracking-wider border ${
                    post.is_published
                      ? "bg-green-600/80 border-green-500/30"
                      : "bg-zinc-600/80 border-zinc-500/30"
                  }`}>
                    {post.is_published ? "Published" : "Draft"}
                  </span>
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                    <span>Oleh: {post.author}</span>
                    <span>{post.read_time}</span>
                  </div>
                  <h3 className="font-display font-bold text-base text-zinc-900 dark:text-white line-clamp-1" title={post.title}>
                    {post.title}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-3 flex items-center justify-end gap-2 border-t border-zinc-100 dark:border-zinc-800/40">
                <span className="text-[10px] text-zinc-450 dark:text-zinc-500 mr-auto font-medium">
                  {post.date}
                </span>
                <button
                  onClick={() => handleOpenEdit(post)}
                  className="p-2 text-zinc-500 hover:text-zinc-850 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg transition-colors border border-transparent hover:border-zinc-250"
                  aria-label="Edit post"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  disabled={deletingId === post.id}
                  className="p-2 text-red-500 hover:text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors border border-transparent hover:border-red-250"
                  aria-label="Delete post"
                >
                  {deletingId === post.id ? (
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
