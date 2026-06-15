"use client";

import React, { useState } from "react";
import { updateSiteConfig, triggerSeed, uploadImage } from "../actions/dbActions";
import {
  Settings,
  Mail,
  Phone,
  MapPin,
  Save,
  Database,
  Briefcase,
  FolderKanban,
  FileText,
  MessageCircle,
  Upload,
  Loader2,
  CheckCircle,
  AlertCircle
} from "lucide-react";

const Instagram = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const Facebook = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);


interface SettingsFormProps {
  initialConfig: any;
  stats: {
    services: number;
    projects: number;
    blogs: number;
  };
}

export default function SettingsForm({ initialConfig, stats }: SettingsFormProps) {
  const [config, setConfig] = useState(initialConfig || {
    site_name: "Aruna Karsa",
    logo_url: "/logo/logo-horizontal.png",
    contact_email: "info@arunakarsa.co.id",
    contact_phone: "+62 812-3456-789",
    contact_address: "Jl. Raya Sunrise No. 45, Kebayoran Baru, Jakarta Selatan, 12130",
    social_links: { instagram: "", facebook: "", whatsapp: "" },
    footer_text: ""
  });

  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setConfig((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConfig((prev: any) => ({
      ...prev,
      social_links: {
        ...prev.social_links,
        [name]: value
      }
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
      setMessage({ type: "error", text: `Gagal mengunggah logo: ${res.error}` });
    } else if (res.url) {
      setConfig((prev: any) => ({ ...prev, logo_url: res.url }));
      setMessage({ type: "success", text: "Logo berhasil diunggah!" });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const res = await updateSiteConfig(config);
    setSaving(false);

    if (res.error) {
      setMessage({ type: "error", text: `Gagal memperbarui pengaturan: ${res.error}` });
    } else {
      setMessage({ type: "success", text: "Pengaturan berhasil disimpan!" });
    }
  };

  const handleSeed = async () => {
    if (!confirm("Apakah Anda yakin ingin memuat data bawaan? Proses ini akan mengisi tabel yang kosong dengan data default.")) return;
    setSeeding(true);
    setMessage(null);

    const res = await triggerSeed();
    setSeeding(false);

    if (res.error) {
      setMessage({ type: "error", text: `Gagal memuat data bawaan: ${res.error}` });
    } else {
      setMessage({ type: "success", text: "Data bawaan berhasil dimuat ke database! Silakan segarkan halaman." });
      window.location.reload();
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-3xl text-zinc-900 dark:text-white">
            Pengaturan Utama
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Kelola statistik ringkas, identitas logo, dan data kontak global
          </p>
        </div>
        <button
          onClick={handleSeed}
          disabled={seeding}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 disabled:pointer-events-none"
        >
          {seeding ? (
            <Loader2 className="w-4 h-4 animate-spin text-brand-amber-500" />
          ) : (
            <Database className="w-4 h-4 text-brand-amber-500" />
          )}
          Muat Data Bawaan (Seed)
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

      {/* Stats Quick Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: "Layanan Aktif", count: stats.services, icon: Briefcase, color: "text-brand-amber-500 bg-brand-amber-500/10" },
          { label: "Proyek Portofolio", count: stats.projects, icon: FolderKanban, color: "text-blue-500 bg-blue-500/10" },
          { label: "Artikel Blog", count: stats.blogs, icon: FileText, color: "text-green-500 bg-green-500/10" }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl flex items-center gap-4 shadow-sm transition-colors">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-extrabold text-zinc-900 dark:text-white mt-1">{stat.count}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSave} className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-8 shadow-sm space-y-8 transition-colors">
        <div className="flex items-center gap-2 pb-4 border-b border-zinc-200/50 dark:border-zinc-800/50 text-zinc-900 dark:text-white">
          <Settings className="w-5 h-5 text-brand-amber-500" />
          <h2 className="font-display font-extrabold text-lg">Identitas & Kontak Situs</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Site Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Nama Perusahaan / Situs
            </label>
            <input
              type="text"
              name="site_name"
              value={config.site_name}
              onChange={handleTextChange}
              required
              className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
            />
          </div>

          {/* Logo Upload */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Logo Perusahaan
            </label>
            <div className="flex items-center gap-4">
              <input
                type="text"
                name="logo_url"
                value={config.logo_url}
                onChange={handleTextChange}
                placeholder="/logo/logo-horizontal.png"
                className="flex-1 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
              />
              <label className="cursor-pointer inline-flex items-center justify-center p-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-850 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors border border-zinc-200 dark:border-zinc-800">
                {uploading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Upload className="w-5 h-5" />
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

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Email Hubungi Kami
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                name="contact_email"
                value={config.contact_email}
                onChange={handleTextChange}
                className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm pl-11 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Nomor Telepon / WhatsApp
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="text"
                name="contact_phone"
                value={config.contact_phone}
                onChange={handleTextChange}
                className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm pl-11 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Alamat Kantor / Fisik
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 pt-3.5 flex items-start pointer-events-none text-zinc-400">
              <MapPin className="w-4 h-4" />
            </div>
            <textarea
              name="contact_address"
              value={config.contact_address}
              onChange={handleTextChange}
              rows={2}
              className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm pl-11 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
            />
          </div>
        </div>

        {/* Social Links */}
        <div className="space-y-4">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block border-b border-zinc-100 dark:border-zinc-800/80 pb-2">
            Tautan Media Sosial
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-500 flex items-center gap-1.5">
                <Instagram className="w-3.5 h-3.5 text-zinc-400" />
                Instagram URL
              </label>
              <input
                type="text"
                name="instagram"
                value={config.social_links?.instagram || ""}
                onChange={handleSocialChange}
                placeholder="https://instagram.com/arunakarsa"
                className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-500 flex items-center gap-1.5">
                <Facebook className="w-3.5 h-3.5 text-zinc-400" />
                Facebook URL
              </label>
              <input
                type="text"
                name="facebook"
                value={config.social_links?.facebook || ""}
                onChange={handleSocialChange}
                placeholder="https://facebook.com/arunakarsa"
                className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-500 flex items-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5 text-zinc-400" />
                WhatsApp URL
              </label>
              <input
                type="text"
                name="whatsapp"
                value={config.social_links?.whatsapp || ""}
                onChange={handleSocialChange}
                placeholder="https://wa.me/628123456789"
                className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Footer Text */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Teks Footer (Deskripsi Singkat Perusahaan)
          </label>
          <textarea
            name="footer_text"
            value={config.footer_text}
            onChange={handleTextChange}
            rows={3}
            className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
          />
        </div>

        {/* Save Button */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 hover:bg-brand-amber-600 dark:bg-zinc-100 dark:hover:bg-brand-amber-500 dark:text-zinc-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  );
}
