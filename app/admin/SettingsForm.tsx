"use client";

import React, { useState } from "react";
import Link from "next/link";
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
  AlertCircle,
  ChevronDown,
  ExternalLink,
  ArrowRight,
  Globe,
  Shield,
  Sparkles,
  Star,
  Send,
  Users,
  TrendingUp,
} from "lucide-react";

const Instagram = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const Facebook = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

interface SettingsFormProps {
  initialConfig: any;
  stats: {
    services: number;
    projects: number;
    blogs: number;
    contacts: number;
    reviews: number;
    reviewsPublished: number;
  };
}

function Section({
  title,
  icon: Icon,
  children,
  defaultOpen = true,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl overflow-hidden shadow-sm transition-colors">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-8 py-5 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors"
      >
        <div className="flex items-center gap-3 text-zinc-900 dark:text-white">
          <div className="w-8 h-8 rounded-xl bg-brand-amber-500/10 flex items-center justify-center">
            <Icon className="w-4 h-4 text-brand-amber-500" />
          </div>
          <span className="font-display font-bold text-base">{title}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-8 pb-8 pt-2 border-t border-zinc-100 dark:border-zinc-800/50 space-y-6">
          {children}
        </div>
      )}
    </div>
  );
}

function InputField({
  label,
  icon: Icon,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  icon?: React.ElementType;
  type?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">{label}</label>
      <div className={Icon ? "relative" : ""}>
        {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm ${Icon ? "pl-11 pr-4" : "px-4"} py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500 transition-colors`}
        />
      </div>
    </div>
  );
}

/** A stat card that links to a management page */
function LinkStatCard({
  label,
  count,
  href,
  icon: Icon,
  colorClass,
}: {
  label: string;
  count: number;
  href: string;
  icon: React.ElementType;
  colorClass: string;
}) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden p-6 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl flex items-center gap-4 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all"
    >
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${colorClass}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium uppercase tracking-wider truncate">{label}</p>
        <p className="text-3xl font-extrabold text-zinc-900 dark:text-white mt-0.5 tabular-nums">{count}</p>
      </div>
      <ArrowRight className="w-4 h-4 text-zinc-300 group-hover:text-zinc-500 dark:group-hover:text-zinc-300 transition-colors shrink-0" />
    </Link>
  );
}

/** A stat card that is info-only (no link) */
function InfoStatCard({
  label,
  count,
  icon: Icon,
  colorClass,
  badge,
}: {
  label: string;
  count: number;
  icon: React.ElementType;
  colorClass: string;
  badge?: string;
}) {
  return (
    <div className="relative overflow-hidden p-6 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl flex items-center gap-4 shadow-sm transition-colors">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${colorClass}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium uppercase tracking-wider truncate">{label}</p>
        <p className="text-3xl font-extrabold text-zinc-900 dark:text-white mt-0.5 tabular-nums">{count}</p>
      </div>
      {badge && (
        <span className="shrink-0 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">
          {badge}
        </span>
      )}
    </div>
  );
}

export default function SettingsForm({ initialConfig, stats }: SettingsFormProps) {
  const [config, setConfig] = useState(
    initialConfig || {
      site_name: "Aruna Karsa",
      logo_url: "/logo/logo-horizontal.png",
      contact_email: "info@arunakarsa.co.id",
      contact_phone: "+62 812-3456-789",
      contact_address: "Jl. Raya Sunrise No. 45, Kebayoran Baru, Jakarta Selatan, 12130",
      social_links: { instagram: "", facebook: "", whatsapp: "" },
      footer_text: "",
    }
  );

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
    setConfig((prev: any) => ({ ...prev, social_links: { ...prev.social_links, [name]: value } }));
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
    <form onSubmit={handleSave} className="space-y-6 max-w-5xl">

      {/* ── Welcome Banner ─────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 dark:from-zinc-800 dark:via-zinc-900 dark:to-zinc-950 rounded-3xl p-8 text-white shadow-2xl">
        {/* decorative orbs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-12 -right-12 w-56 h-56 bg-brand-amber-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-brand-amber-400/10 rounded-full blur-2xl" />
          <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-brand-sage-500/10 rounded-full blur-2xl" />
        </div>
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-brand-amber-400 text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              Aruna Karsa Admin
            </div>
            <h1 className="font-display font-extrabold text-3xl lg:text-4xl">Selamat Datang 👋</h1>
            <p className="text-sm text-zinc-400 max-w-md">Kelola konten, proyek, dan pengaturan website Anda dari sini.</p>
          </div>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-sm font-bold transition-colors shrink-0"
          >
            <Globe className="w-4 h-4" />
            Lihat Website
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </a>
        </div>
      </div>

      {/* ── Alert Messages ─────────────────────────────────── */}
      {message && (
        <div
          className={`p-4 rounded-2xl flex items-start gap-3 border text-sm font-semibold ${
            message.type === "success"
              ? "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900/30 text-green-700 dark:text-green-400"
              : "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400"
          }`}
        >
          {message.type === "success" ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* ── Statistics Section ─────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <TrendingUp className="w-4 h-4 text-brand-amber-500" />
          <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Statistik Konten</h2>
        </div>

        {/* Row 1 — content with management links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <LinkStatCard
            label="Portofolio"
            count={stats.projects}
            href="/admin/portfolio"
            icon={FolderKanban}
            colorClass="text-blue-500 bg-blue-500/10"
          />
          <LinkStatCard
            label="Layanan"
            count={stats.services}
            href="/admin/services"
            icon={Briefcase}
            colorClass="text-brand-amber-500 bg-brand-amber-500/10"
          />
          <LinkStatCard
            label="Blog Posts"
            count={stats.blogs}
            href="/admin/blog"
            icon={FileText}
            colorClass="text-emerald-500 bg-emerald-500/10"
          />
        </div>

        {/* Row 2 — submission info cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <InfoStatCard
            label="Pesan Masuk"
            count={stats.contacts}
            icon={Send}
            colorClass="text-purple-500 bg-purple-500/10"
          />
          <InfoStatCard
            label="Ulasan Masuk"
            count={stats.reviews}
            icon={Star}
            colorClass="text-orange-500 bg-orange-500/10"
          />
          <InfoStatCard
            label="Ulasan Dipublish"
            count={stats.reviewsPublished}
            icon={Users}
            colorClass="text-green-500 bg-green-500/10"
            badge="Live"
          />
        </div>
      </div>

      {/* ── Collapsible Settings Sections ─────────────────── */}
      <Section title="Identitas & Logo Situs" icon={Globe} defaultOpen={true}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Nama Perusahaan / Situs"
            name="site_name"
            value={config.site_name}
            onChange={handleTextChange}
            required
          />
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Logo Perusahaan</label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                name="logo_url"
                value={config.logo_url}
                onChange={handleTextChange}
                placeholder="/logo/logo-horizontal.png"
                className="flex-1 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
              />
              <label className="cursor-pointer inline-flex items-center justify-center p-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors border border-zinc-200 dark:border-zinc-800">
                {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
              </label>
            </div>
          </div>
        </div>
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
      </Section>

      <Section title="Informasi Kontak" icon={Mail} defaultOpen={true}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Email Hubungi Kami" icon={Mail} type="email" name="contact_email"
            value={config.contact_email} onChange={handleTextChange} />
          <InputField label="Nomor Telepon / WhatsApp" icon={Phone} name="contact_phone"
            value={config.contact_phone} onChange={handleTextChange} />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Alamat Kantor</label>
          <div className="relative">
            <MapPin className="absolute left-4 top-3.5 w-4 h-4 text-zinc-400 pointer-events-none" />
            <textarea name="contact_address" value={config.contact_address} onChange={handleTextChange} rows={2}
              className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm pl-11 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
            />
          </div>
        </div>
      </Section>

      <Section title="Media Sosial" icon={MessageCircle} defaultOpen={false}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-500 flex items-center gap-1.5">
              <Instagram className="w-3.5 h-3.5 text-zinc-400" /> Instagram URL
            </label>
            <input type="text" name="instagram" value={config.social_links?.instagram || ""} onChange={handleSocialChange}
              placeholder="https://instagram.com/arunakarsa"
              className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-500 flex items-center gap-1.5">
              <Facebook className="w-3.5 h-3.5 text-zinc-400" /> Facebook URL
            </label>
            <input type="text" name="facebook" value={config.social_links?.facebook || ""} onChange={handleSocialChange}
              placeholder="https://facebook.com/arunakarsa"
              className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-500 flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5 text-zinc-400" /> WhatsApp URL
            </label>
            <input type="text" name="whatsapp" value={config.social_links?.whatsapp || ""} onChange={handleSocialChange}
              placeholder="https://wa.me/628123456789"
              className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
            />
          </div>
        </div>
      </Section>

      <Section title="Zona Bahaya" icon={Shield} defaultOpen={false}>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Muat ulang data bawaan default ke tabel yang kosong. Tidak akan menimpa data yang sudah ada.
        </p>
        <button
          type="button"
          onClick={handleSeed}
          disabled={seeding}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 disabled:pointer-events-none"
        >
          {seeding ? <Loader2 className="w-4 h-4 animate-spin text-brand-amber-500" /> : <Database className="w-4 h-4 text-brand-amber-500" />}
          Muat Data Bawaan (Seed)
        </button>
      </Section>

      {/* ── Sticky Save Bar ────────────────────────────────── */}
      <div className="sticky bottom-6 flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-zinc-900 hover:bg-brand-amber-600 dark:bg-zinc-100 dark:hover:bg-brand-amber-500 dark:text-zinc-900 text-white font-bold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-xl shadow-zinc-900/20 dark:shadow-black/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Simpan Semua Perubahan
        </button>
      </div>
    </form>
  );
}
