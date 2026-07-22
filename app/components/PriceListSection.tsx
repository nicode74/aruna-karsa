"use client";

import React from "react";
import { CheckCircle2, MessageSquare, ShieldCheck, Calculator, FileCheck, Layers } from "lucide-react";
import { DEFAULT_PRICELIST } from "../../lib/supabase/helpers";

interface PriceListSectionProps {
  pricelist?: any;
  title?: string;
  subtitle?: string;
}

export default function PriceListSection({
  pricelist: propPricelist,
  title = "DAFTAR HARGA & PAKET DESAIN",
  subtitle = "Pricelist Transparan Layanan Arsitektur & Perizinan"
}: PriceListSectionProps) {
  const pricelist = propPricelist || DEFAULT_PRICELIST;

  const packages = pricelist.packages || DEFAULT_PRICELIST.packages;
  const rab = pricelist.rab_standalone || DEFAULT_PRICELIST.rab_standalone;
  const pbg = pricelist.pbg_imb || DEFAULT_PRICELIST.pbg_imb;
  const structure = pricelist.structure_calc || DEFAULT_PRICELIST.structure_calc;

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const getWaUrl = (itemTitle: string, priceStr: string) => {
    const text = `Halo Aruna Karsa, saya tertarik dengan layanan *${itemTitle}* (${priceStr}). Bisakah saya konsultasikan detailnya? Terima kasih.`;
    return `https://wa.me/628123456789?text=${encodeURIComponent(text)}`;
  };

  return (
    <section id="pricelist" className="py-24 bg-white dark:bg-zinc-950 transition-colors border-t border-zinc-100 dark:border-zinc-900 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-brand-amber-600 dark:text-brand-amber-500">
            {title}
          </h2>
          <p className="font-display font-extrabold text-3xl sm:text-4xl text-zinc-900 dark:text-white leading-tight">
            {subtitle}
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Pilih paket desain arsitektur dan layanan perizinan yang sesuai dengan kebutuhan hunian atau proyek impian Anda.
          </p>
        </div>

        {/* 1. Main Design Packages Grid */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-brand-amber-500" />
            <h3 className="font-display font-bold text-xl text-zinc-900 dark:text-white">
              Paket Desain Arsitektur
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg: any, index: number) => {
              const isPopular = pkg.id === "packet_b" || index === 1;
              const formattedPrice = formatRupiah(pkg.price_per_m2);
              return (
                <div
                  key={pkg.id || index}
                  className={`relative p-8 rounded-3xl border transition-all duration-300 flex flex-col justify-between ${
                    isPopular
                      ? "bg-zinc-900 text-white dark:bg-zinc-900 border-brand-amber-500 shadow-2xl scale-[1.02]"
                      : "bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200/80 dark:border-zinc-800 text-zinc-900 dark:text-white hover:border-brand-amber-500/50 shadow-sm"
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-brand-amber-500 text-white text-[10px] font-extrabold tracking-widest uppercase shadow-md">
                      Paling Populer
                    </div>
                  )}

                  <div className="space-y-6">
                    <div>
                      <h4 className="font-display font-bold text-2xl mb-1">
                        {pkg.name}
                      </h4>
                      <p className={`text-xs ${isPopular ? "text-zinc-400" : "text-zinc-500 dark:text-zinc-400"}`}>
                        Per Perhitungan Luas Bangunan (m²)
                      </p>
                    </div>

                    <div className="pb-6 border-b border-zinc-200/40 dark:border-zinc-800">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-brand-amber-500">
                          {formattedPrice}
                        </span>
                        <span className={`text-sm font-medium ${isPopular ? "text-zinc-400" : "text-zinc-500 dark:text-zinc-400"}`}>
                          / m²
                        </span>
                      </div>
                    </div>

                    {/* Features List */}
                    <div className="space-y-3">
                      <p className={`text-xs font-bold uppercase tracking-wider ${isPopular ? "text-zinc-300" : "text-zinc-600 dark:text-zinc-400"}`}>
                        Item Gambar & Berkas:
                      </p>
                      <ul className="space-y-3">
                        {pkg.features?.map((feat: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2.5 text-sm font-medium">
                            <CheckCircle2 className="w-4 h-4 text-brand-amber-500 shrink-0 mt-0.5" />
                            <span className={isPopular ? "text-zinc-200" : "text-zinc-700 dark:text-zinc-300"}>
                              {feat}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-8">
                    <a
                      href={getWaUrl(pkg.name, `${formattedPrice}/m²`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full py-3.5 px-4 rounded-xl text-sm font-bold tracking-wide flex items-center justify-center gap-2 transition-all duration-300 ${
                        isPopular
                          ? "bg-brand-amber-500 hover:bg-brand-amber-600 text-white shadow-lg shadow-brand-amber-500/25"
                          : "bg-zinc-900 hover:bg-brand-amber-600 dark:bg-zinc-100 dark:hover:bg-brand-amber-500 dark:text-zinc-900 text-white hover:text-white dark:hover:text-white"
                      }`}
                    >
                      <MessageSquare className="w-4 h-4" />
                      Pesan {pkg.name}
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Secondary Services: Standalone RAB, PBG/IMB Licensing, & Structural Calc */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-zinc-100 dark:border-zinc-900">
          
          {/* Standalone RAB */}
          <div className="p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-brand-amber-500/10 text-brand-amber-600 dark:text-brand-amber-500 flex items-center justify-center">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-display font-bold text-xl text-zinc-900 dark:text-white">
                  Penyusunan RAB Standalone
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  Hitungan anggaran biaya proyek tanpa paket desain
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="p-4 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800 flex justify-between items-center">
                  <div>
                    <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Tanpa Analisis</p>
                    <p className="font-display font-extrabold text-lg text-zinc-900 dark:text-white">
                      {formatRupiah(rab.without_analysis)}
                    </p>
                  </div>
                  <a
                    href={getWaUrl("RAB Standalone (Tanpa Analisis)", formatRupiah(rab.without_analysis))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-brand-amber-600 dark:text-brand-amber-400 hover:bg-brand-amber-500/10 rounded-xl transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </a>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800 flex justify-between items-center">
                  <div>
                    <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Dengan Analisis Lengkap</p>
                    <p className="font-display font-extrabold text-lg text-brand-amber-600 dark:text-brand-amber-500">
                      {formatRupiah(rab.with_analysis)}
                    </p>
                  </div>
                  <a
                    href={getWaUrl("RAB Standalone (Dengan Analisis)", formatRupiah(rab.with_analysis))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-brand-amber-600 dark:text-brand-amber-400 hover:bg-brand-amber-500/10 rounded-xl transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* PBG / IMB Licensing */}
          <div className="p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-brand-amber-500/10 text-brand-amber-600 dark:text-brand-amber-500 flex items-center justify-center">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-display font-bold text-xl text-zinc-900 dark:text-white">
                  Jasa Perizinan PBG / IMB
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  {pbg.description || "Meliputi NIB via OSS (KKPR/KRK)"}
                </p>
              </div>

              <div>
                <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Biaya Mulai From</span>
                <p className="font-display font-extrabold text-3xl text-brand-amber-600 dark:text-brand-amber-500">
                  {formatRupiah(pbg.price)}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Wilayah Layanan:</p>
                <div className="flex flex-wrap gap-1.5">
                  {pbg.regions?.map((reg: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-950 text-xs font-medium text-zinc-600 dark:text-zinc-300 border border-zinc-200/60 dark:border-zinc-800"
                    >
                      {reg}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <a
              href={getWaUrl("Jasa PBG / IMB", formatRupiah(pbg.price))}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-zinc-900 hover:bg-brand-amber-600 dark:bg-zinc-100 dark:hover:bg-brand-amber-500 dark:text-zinc-900 text-white hover:text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              Konsultasi Perizinan
            </a>
          </div>

          {/* Structural Calculation */}
          <div className="p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-brand-amber-500/10 text-brand-amber-600 dark:text-brand-amber-500 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-display font-bold text-xl text-zinc-900 dark:text-white">
                  Hitungan Struktur
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  Perhitungan kekuatan konstruksi & pembebanan sipil
                </p>
              </div>

              <div>
                <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Tarif Hitung</span>
                <div className="flex items-baseline gap-1">
                  <span className="font-display font-extrabold text-3xl text-brand-amber-600 dark:text-brand-amber-500">
                    {formatRupiah(structure.price_per_m2)}
                  </span>
                  <span className="text-xs text-zinc-500 font-medium">/ m²</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-brand-amber-500/5 border border-brand-amber-500/20 text-xs text-zinc-600 dark:text-zinc-300 space-y-1">
                <p className="font-bold text-brand-amber-600 dark:text-brand-amber-400">Catatan Penting:</p>
                <p className="capitalize font-medium">
                  {structure.note || "Gambar bangunan sudah tersedia"}
                </p>
              </div>
            </div>

            <a
              href={getWaUrl("Hitungan Struktur", `${formatRupiah(structure.price_per_m2)}/m²`)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-zinc-900 hover:bg-brand-amber-600 dark:bg-zinc-100 dark:hover:bg-brand-amber-500 dark:text-zinc-900 text-white hover:text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              Konsultasi Struktur
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
