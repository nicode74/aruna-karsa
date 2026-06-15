"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Compass, Eye, ShieldCheck, Heart, Award } from "lucide-react";

interface AboutSectionProps {
  isDetailed?: boolean;
  title?: string;
  subtitle?: string;
  body?: string;
  visi?: string;
  misi?: string[];
  filosofi_aruna?: string;
  filosofi_karsa?: string;
}

export default function AboutSection({
  isDetailed = false,
  title,
  subtitle,
  body,
  visi,
  misi,
  filosofi_aruna,
  filosofi_karsa,
}: AboutSectionProps) {
  const [activeTab, setActiveTab] = useState<"visi" | "misi" | "filosofi">("visi");

  const defaultMissions = [
    "Menghadirkan layanan desain arsitektur dan konstruksi yang mengutamakan keseimbangan antara fungsi, estetika, dan ketahanan bangunan.",
    "Menyusun Rencana Anggaran Biaya (RAB) secara transparan, akurat, dan dapat dipertanggungjawabkan sebagai dasar kepercayaan.",
    "Memberikan pendampingan menyeluruh dalam proses pembangunan, mulai dari perencanaan, pelaksanaan, hingga penyelesaian proyek.",
    "Memastikan setiap proses pembangunan berjalan sesuai standar teknis, regulasi, serta legalitas demi keamanan dan kepastian hukum.",
    "Membangun hubungan jangka panjang dengan klien melalui pelayanan yang jujur, komunikatif, dan berorientasi pada kepuasan."
  ];

  const sectionTitle = title || "TENTANG KAMI";
  const sectionSubtitle = subtitle || "Membangun Lebih dari Sekadar Struktur, Kami Mewujudkan Ruang Kehidupan";
  const sectionVisi = visi || "Menjadi perusahaan konstruksi dan arsitektur yang tidak hanya membangun bangunan, tetapi menghadirkan ruang kehidupan yang bermakna, berkelanjutan, dan penuh harapan, melalui perpaduan antara estetika, kekuatan struktur, dan transparansi dalam setiap proses pembangunan.";
  const sectionMisi = misi || defaultMissions;
  const sectionAruna = filosofi_aruna || "Bintang yang membawa cahaya, harapan, dan kemungkinan baru di setiap awal hari.";
  const sectionKarsa = filosofi_karsa || "Kehendak bebas, tekad bulat, dan niat kuat untuk mewujudkan karya bernilai tinggi.";

  return (
    <section className="py-24 bg-white dark:bg-zinc-950 transition-colors">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-brand-amber-600 dark:text-brand-amber-500">
            {sectionTitle}
          </h2>
          <p className="font-display font-extrabold text-3xl sm:text-4xl text-zinc-900 dark:text-white leading-tight">
            {sectionSubtitle}
          </p>
          <div className="w-16 h-1 bg-brand-amber-500 mx-auto rounded-full mt-4" />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Side: Generated Image with Frame */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-800">
              <Image
                src="/images/architectural_blueprint.png"
                alt="Architectural Blueprint and Model"
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
                sizes="(max-w-768px) 100vw, 40vw"
                priority
              />
            </div>
            {/* Absolute badge */}
            <div className="absolute -bottom-6 -right-6 glass-panel border border-zinc-200/50 dark:border-zinc-800/50 p-6 rounded-2xl shadow-xl flex items-center gap-4 max-w-xs">
              <div className="w-12 h-12 rounded-xl bg-brand-amber-500/10 flex items-center justify-center text-brand-amber-600 shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-zinc-900 dark:text-white">Standar Tertinggi</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Ketahanan material, legalitas aman, & struktur kokoh.</p>
              </div>
            </div>
          </div>

          {/* Right Side: Interactive Tabs content */}
          <div className="lg:col-span-7 space-y-8">
            <div className="flex border-b border-zinc-200 dark:border-zinc-800">
              {(["visi", "misi", "filosofi"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 pb-4 text-sm font-bold tracking-wider uppercase border-b-2 transition-all duration-300 ${
                    activeTab === tab
                      ? "border-brand-amber-500 text-brand-amber-600 dark:text-brand-amber-500"
                      : "border-transparent text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-400"
                  }`}
                >
                  {tab === "visi" ? "Visi" : tab === "misi" ? "Misi" : "Filosofi Nama"}
                </button>
              ))}
            </div>

            {/* Tab content renders */}
            <div className="min-h-[250px] transition-opacity duration-300">
              {activeTab === "visi" && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-amber-500/10 flex items-center justify-center text-brand-amber-600 shrink-0">
                      <Eye className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-lg text-zinc-900 dark:text-white mb-2">Visi Kami</h3>
                      <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
                        {sectionVisi}
                      </p>
                    </div>
                  </div>
                  <p className="text-zinc-500 dark:text-zinc-400 text-sm italic border-l-4 border-brand-amber-500 pl-4 py-1">
                    &ldquo;Aruna Karsa hadir sebagai simbol awal yang baru seperti bintang yang membawa cahaya bagi setiap keluarga untuk mewujudkan hunian yang layak, aman, dan bernilai sepanjang masa.&rdquo;
                  </p>
                </div>
              )}

              {activeTab === "misi" && (
                <div className="space-y-4 animate-fadeIn">
                  <h3 className="font-display font-bold text-lg text-zinc-900 dark:text-white flex items-center gap-2 mb-2">
                    <ShieldCheck className="w-5 h-5 text-brand-amber-500" />
                    Misi Kami
                  </h3>
                  <ul className="space-y-3">
                    {sectionMisi.map((mission, index) => (
                      <li key={index} className="flex gap-3 items-start">
                        <span className="w-5 h-5 rounded-full bg-brand-amber-100 dark:bg-brand-amber-950 text-brand-amber-600 dark:text-brand-amber-500 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        <span className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                          {mission}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === "filosofi" && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-amber-500/10 flex items-center justify-center text-brand-amber-600 shrink-0">
                      <Compass className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-lg text-zinc-900 dark:text-white mb-2">Filosofi Aruna Karsa</h3>
                      <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed mb-4">
                        Nama perusahaan kami didasarkan pada perpaduan dua kata bermakna luhur:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
                          <span className="font-bold text-brand-amber-600 dark:text-brand-amber-500">Aruna</span>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{sectionAruna}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
                          <span className="font-bold text-brand-amber-600 dark:text-brand-amber-500">Karsa</span>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{sectionKarsa}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* In detailed page mode, show more cards */}
            {isDetailed && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-zinc-100 dark:border-zinc-900">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-brand-amber-500/10 flex items-center justify-center text-brand-amber-600 shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900 dark:text-white text-sm">Legalitas & Keamanan</h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Setiap bangunan didirikan sesuai aturan hukum, perizinan lengkap (PBG/IMB), aman & bersertifikasi.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-brand-amber-500/10 flex items-center justify-center text-brand-amber-600 shrink-0">
                    <Heart className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900 dark:text-white text-sm">Hubungan Jangka Panjang</h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Mendampingi pasca pembangunan dengan garansi pemeliharaan demi kepuasan hunian berkelanjutan.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
