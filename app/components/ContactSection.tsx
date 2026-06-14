"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageSquare, ShieldAlert } from "lucide-react";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    projectType: "desain",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus("error");
      return;
    }

    setStatus("loading");
    // Simulate API call
    setTimeout(() => {
      setStatus("success");
      setFormData({
        name: "",
        email: "",
        projectType: "desain",
        message: "",
      });
      setTimeout(() => setStatus("idle"), 5000);
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const whatsappMessage = encodeURIComponent("Halo Aruna Karsa, saya tertarik untuk melakukan konsultasi mengenai proyek pembangunan/desain bangunan saya.");
  const whatsappUrl = `https://wa.me/6285117446649?text=${whatsappMessage}`;

  return (
    <section className="py-24 bg-zinc-50 dark:bg-zinc-900 transition-colors">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-brand-amber-600 dark:text-brand-amber-500">
            HUBUNGI KAMI
          </h2>
          <p className="font-display font-extrabold text-3xl sm:text-4xl text-zinc-900 dark:text-white leading-tight">
            Mulai Konsultasi Bangunan Impian Anda Hari Ini
          </p>
          <div className="w-16 h-1 bg-brand-amber-500 mx-auto rounded-full mt-4" />
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Side: Contact Info Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm space-y-6">
              <h3 className="font-display font-bold text-2xl text-zinc-900 dark:text-white">
                Informasi Kontak
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-normal">
                Tim pemasaran dan arsitek kami siap membantu menjawab pertanyaan teknis Anda. Hubungi kami melalui saluran berikut untuk respon cepat.
              </p>

              <div className="space-y-4 pt-4">
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex gap-4 p-4 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-900/50 border border-transparent hover:border-zinc-100 dark:hover:border-zinc-800 transition-all duration-300"
                >
                  <MapPin className="w-5 h-5 text-brand-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-zinc-900 dark:text-white text-sm">Alamat Kantor</h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Jl. Bimosari 217, Tahunan, Kec. Umbulharjo Kota Yogyakarta, DI Yogyakarta, 55167</p>
                  </div>
                </a>

                <a
                  href="tel:+628123456789"
                  className="flex gap-4 p-4 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-900/50 border border-transparent hover:border-zinc-100 dark:hover:border-zinc-800 transition-all duration-300"
                >
                  <Phone className="w-5 h-5 text-brand-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-zinc-900 dark:text-white text-sm">Hubungi Telepon</h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">6285117446649</p>
                  </div>
                </a>

                <a
                  href="mailto:info@arunakarsa.co.id"
                  className="flex gap-4 p-4 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-900/50 border border-transparent hover:border-zinc-100 dark:hover:border-zinc-800 transition-all duration-300"
                >
                  <Mail className="w-5 h-5 text-brand-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-zinc-900 dark:text-white text-sm">Kirim Email</h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">[ceo@aruna.my.id]</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Quick WhatsApp Action Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full p-5 rounded-3xl bg-green-600 hover:bg-green-700 text-white font-bold tracking-wide flex items-center justify-center gap-3 shadow-lg shadow-green-600/20 transition-all duration-300 hover:-translate-y-0.5"
            >
              <MessageSquare className="w-5 h-5" />
              Hubungi via WhatsApp Chat
            </a>
          </div>

          {/* Right Side: Consultation Form */}
          <div className="lg:col-span-7 bg-white dark:bg-zinc-950 p-8 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm">
            <h3 className="font-display font-bold text-2xl text-zinc-900 dark:text-white mb-6">
              Kirim Pesan Konsultasi
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Nama Anda"
                    className="w-full bg-zinc-50 dark:bg-zinc-900 px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:border-brand-amber-500 text-zinc-900 dark:text-white transition-colors"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Alamat Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="nama@email.com"
                    className="w-full bg-zinc-50 dark:bg-zinc-900 px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:border-brand-amber-500 text-zinc-900 dark:text-white transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="projectType" className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Jenis Layanan Proyek
                </label>
                <select
                  id="projectType"
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleChange}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:border-brand-amber-500 text-zinc-900 dark:text-white transition-colors cursor-pointer"
                >
                  <option value="desain">Desain Arsitektur (Concept only)</option>
                  <option value="kontraktor">Desain & Bangun Baru (Full Contractor)</option>
                  <option value="interior">Renovasi Interior & Kitchen Set</option>
                  <option value="rab">Estimasi Anggaran & RAB Consulting</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Detail Pertanyaan / Deskripsi Proyek
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Gambarkan rencana bangunan impian Anda (Lokasi, Luas tanah, Estimasi budget)..."
                  className="w-full bg-zinc-50 dark:bg-zinc-900 px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:border-brand-amber-500 text-zinc-900 dark:text-white transition-colors"
                  required
                />
              </div>

              {/* Status alerts */}
              {status === "error" && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4" />
                  Harap isi seluruh field formulir dengan benar.
                </div>
              )}
              {status === "success" && (
                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 text-xs font-semibold">
                  Terima kasih! Pesan Anda telah sukses dikirim. Arsitek kami akan segera menghubungi Anda.
                </div>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full py-4 rounded-xl bg-brand-amber-600 hover:bg-brand-amber-500 text-white font-bold tracking-wide shadow-md shadow-brand-amber-600/15 flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 disabled:translate-y-0 disabled:bg-zinc-400 transition-all duration-300"
              >
                {status === "loading" ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Mengirimkan...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Kirim Form Konsultasi
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
