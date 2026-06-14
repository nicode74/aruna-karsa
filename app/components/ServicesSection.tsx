"use client";

import React from "react";
import Link from "next/link";
import { PenTool, HardHat, Sofa, FileSpreadsheet, ArrowRight } from "lucide-react";

export default function ServicesSection({ isDetailed = false }) {
  const services = [
    {
      icon: PenTool,
      title: "Desain Arsitektur",
      desc: "Layanan perancangan konsep bangunan mulai dari denah, visualisasi 3D photorealistic, hingga gambar kerja teknis (DED) dengan detail presisi.",
      features: ["Konsep 3D Render & Denah", "Gambar Detail Teknis (DED)", "Perizinan Bangunan Gedung (PBG)"]
    },
    {
      icon: HardHat,
      title: "Bangun & Kontraktor",
      desc: "Pembangunan rumah tinggal, ruko, atau kantor secara menyeluruh dari struktur pondasi, pengerjaan arsitektural, hingga finishing dengan garansi kekuatan.",
      features: ["Pengawasan Proyek Ketat", "Garansi Konstruksi Pemeliharaan", "Tenaga Ahli Bersertifikat"]
    },
    {
      icon: Sofa,
      title: "Desain Interior",
      desc: "Transformasi estetika dalam ruang dengan perancangan layout, pemilihan skema warna, tata cahaya, serta custom pembuatan furnitur/cabinetry.",
      features: ["Desain Kitchen Set & Wardrobe", "Pencahayaan & Aksesori Estetis", "Optimalisasi Tata Ruang"]
    },
    {
      icon: FileSpreadsheet,
      title: "Penyusunan RAB Transparan",
      desc: "Konsultasi perhitungan anggaran pembangunan secara rinci dan terbuka. Memastikan efisiensi biaya material tanpa mengorbankan kualitas struktur.",
      features: ["Rincian Material & Upah Kerja", "Alternatif Spek Sesuai Budget", "Akurat & Dapat Dipertanggungjawabkan"]
    }
  ];

  return (
    <section className="py-24 bg-zinc-50 dark:bg-zinc-900 transition-colors">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-4 max-w-2xl">
            <h2 className="text-xs font-bold uppercase tracking-widest text-brand-amber-600 dark:text-brand-amber-500">
              LAYANAN KAMI
            </h2>
            <p className="font-display font-extrabold text-3xl sm:text-4xl text-zinc-900 dark:text-white leading-tight">
              Solusi Konstruksi & Arsitektur Terintegrasi
            </p>
          </div>
          {!isDetailed && (
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-sm font-bold text-brand-amber-600 dark:text-brand-amber-500 hover:text-brand-amber-700 dark:hover:text-brand-amber-400 transition-colors duration-200 group shrink-0"
            >
              Lihat Selengkapnya
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((srv, index) => {
            const Icon = srv.icon;
            return (
              <div
                key={index}
                className="group relative p-8 rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800/50 hover:border-brand-amber-500/50 dark:hover:border-brand-amber-500/30 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between"
              >
                <div className="space-y-6">
                  {/* Icon Frame */}
                  <div className="w-12 h-12 rounded-2xl bg-brand-amber-500/10 text-brand-amber-600 dark:text-brand-amber-500 flex items-center justify-center group-hover:bg-brand-amber-600 group-hover:text-white transition-all duration-300 shadow-inner">
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-display font-bold text-xl text-zinc-900 dark:text-white">
                      {srv.title}
                    </h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-normal">
                      {srv.desc}
                    </p>
                  </div>
                </div>

                {isDetailed && (
                  <ul className="mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-900 space-y-2">
                    {srv.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-amber-500" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
