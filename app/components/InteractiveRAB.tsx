"use client";

import React, { useState } from "react";
import { Info, Calculator, MessageSquare, ChevronRight, Check, Plus, Layers, FileCheck, ShieldCheck } from "lucide-react";
import { DEFAULT_PRICELIST } from "../../lib/supabase/helpers";

interface InteractiveRABProps {
  pricelist?: any;
}

export default function InteractiveRAB({ pricelist: propPricelist }: InteractiveRABProps) {
  const pricelist = propPricelist || DEFAULT_PRICELIST;

  // Project type state: "design" vs "build"
  const [projectType, setProjectType] = useState<"design" | "build">("build");
  const [area, setArea] = useState<number>(100);

  // Design Mode Package State: "packet_a" | "packet_b" | "packet_c"
  const [designPackage, setDesignPackage] = useState<string>("packet_b");

  // Build Mode Parameters
  const [complexity, setComplexity] = useState<"minimalist" | "tropical" | "luxury">("tropical");
  const [material, setMaterial] = useState<"standard" | "premium" | "luxury">("premium");

  // Optional Add-ons
  const [includePbg, setIncludePbg] = useState<boolean>(false);
  const [includeStructure, setIncludeStructure] = useState<boolean>(false);

  // Extract dynamic pricing from props/defaults
  const packages = pricelist.packages || DEFAULT_PRICELIST.packages;
  const pbgPrice = pricelist.pbg_imb?.price || DEFAULT_PRICELIST.pbg_imb.price; // 3.500.000
  const structureRate = pricelist.structure_calc?.price_per_m2 || DEFAULT_PRICELIST.structure_calc.price_per_m2; // 10.000

  // Quick preset area sizes in m²
  const areaPresets = [36, 70, 100, 150, 250, 400];

  // Base building rates per m²
  const buildBaseRates = {
    standard: 3800000,
    premium: 5200000,
    luxury: 7500000,
  };

  const complexityMultipliers = {
    minimalist: 1.0,
    tropical: 1.15,
    luxury: 1.35,
  };

  // Calculate Base Cost
  let baseCost = 0;
  let selectedPackageObj: any = null;

  if (projectType === "design") {
    selectedPackageObj = packages.find((p: any) => p.id === designPackage) || packages[1] || packages[0];
    const pkgPrice = selectedPackageObj?.price_per_m2 || 18000;
    baseCost = pkgPrice * area;
  } else {
    const rate = buildBaseRates[material];
    const multiplier = complexityMultipliers[complexity];
    baseCost = rate * area * multiplier;
  }

  // Calculate Add-on Costs
  const pbgCost = includePbg ? pbgPrice : 0;
  const structureCost = includeStructure ? structureRate * area : 0;
  const totalCalculated = baseCost + pbgCost + structureCost;

  // Output range (± 5% for buffer)
  const minCost = Math.round((totalCalculated * 0.95) / 10000) * 10000;
  const maxCost = Math.round((totalCalculated * 1.05) / 10000) * 10000;

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Cost Breakdown (only relevant for full build)
  const buildBreakdown = [
    { name: "Pondasi & Struktur Utama (Beton/Baja)", percentage: 35 },
    { name: "Dinding & Finishing (Bata, Cat, Lantai)", percentage: 30 },
    { name: "Atap, Rangka & Plafon", percentage: 18 },
    { name: "Mekanikal, Elektrikal & Plumbing (MEP)", percentage: 17 },
  ];

  const specSheets = {
    standard: ["Pondasi batu belah & beton bertulang", "Dinding bata ringan plaster acian + cat", "Lantai Granit 60x60", "Atap baja ringan + genteng flat beton", "Sanitair closet duduk TOTO standard"],
    premium: ["Struktur Beton K-300 SNI", "Dinding bata merah/hebel + cat Mowilex Weathercoat", "Lantai HT Roman 80x80", "Kusen Aluminium Alexindo / YKK", "Sanitair TOTO premium & shower set"],
    luxury: ["Struktur Beton K-350 & Kolom Baja", "Dinding bata merah double + cat Dulux Ambiance", "Lantai Marmer Ujung Pandang / Impor", "Kusen YKK AP + kaca double glass 8mm", "Smart Home System + Sanitair Kohler/Grohe"]
  };

  const getWhatsAppLink = () => {
    const typeLabel = projectType === "build" ? "Desain & Kontraktor (Pembangunan Fisik)" : "Desain Arsitektur Saja";
    let detailChoice = "";

    if (projectType === "design") {
      detailChoice = `Paket Desain: ${selectedPackageObj?.name || "Packet B"} (${formatRupiah(selectedPackageObj?.price_per_m2)}/m²)`;
    } else {
      const complexityLabel = complexity === "minimalist" ? "Minimalis Sederhana" : complexity === "tropical" ? "Modern Tropis" : "Klasik Luxury";
      const materialLabel = material === "standard" ? "Standard (Kokoh & Hemat)" : material === "premium" ? "Premium (Kuat & Elegan)" : "Luxury (Eksklusif & Smart)";
      detailChoice = `Gaya: ${complexityLabel} | Material Tier: ${materialLabel}`;
    }

    const addOnsArr = [];
    if (includePbg) addOnsArr.push(`PBG/IMB (${formatRupiah(pbgPrice)})`);
    if (includeStructure) addOnsArr.push(`Hitungan Struktur (${formatRupiah(structureRate)}/m²)`);
    const addOnsText = addOnsArr.length > 0 ? addOnsArr.join(", ") : "Tidak Ada";

    const text = `Halo Aruna Karsa, saya telah menggunakan Kalkulator RAB Website dengan rincian berikut:
- Layanan: ${typeLabel}
- Detail Pilihan: ${detailChoice}
- Luas Bangunan: ${area} m²
- Layanan Tambahan: ${addOnsText}
- Estimasi Total Biaya: ${formatRupiah(minCost)} - ${formatRupiah(maxCost)}

Mohon info jadwal konsultasi gratis & detail tahap penawaran teknisnya. Terima kasih.`;

    return `https://wa.me/628123456789?text=${encodeURIComponent(text)}`;
  };

  return (
    <div id="rab-calculator" className="bg-white dark:bg-zinc-950 p-6 md:p-10 rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 shadow-xl scroll-mt-24 transition-all duration-300">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-zinc-100 dark:border-zinc-900">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-amber-500/10 flex items-center justify-center text-brand-amber-600 dark:text-brand-amber-500 shadow-inner">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-display font-extrabold text-2xl text-zinc-900 dark:text-white">
              Kalkulator RAB Transparan
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider mt-0.5">
              Simulasi Rencana Anggaran Biaya Instan
            </p>
          </div>
        </div>

        {/* Quick Help Badge */}
        <div className="px-3.5 py-1.5 rounded-full bg-brand-amber-500/10 border border-brand-amber-500/20 text-brand-amber-600 dark:text-brand-amber-400 text-xs font-bold self-start sm:self-center flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5" />
          <span>Real-time Dynamic Pricing</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Input Options */}
        <div className="lg:col-span-6 space-y-6">

          {/* 1. Project Type Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              1. Pilih Jenis Kebutuhan
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setProjectType("design")}
                className={`py-3.5 px-4 rounded-2xl border text-sm font-bold transition-all duration-200 flex flex-col items-center justify-center gap-1 text-center ${
                  projectType === "design"
                    ? "bg-brand-amber-500/10 border-brand-amber-500 text-brand-amber-600 dark:text-brand-amber-400 shadow-sm"
                    : "bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700"
                }`}
              >
                <span>Desain Arsitektur Saja</span>
                <span className="text-[10px] opacity-75 font-medium">Paket Gambar A / B / C</span>
              </button>
              <button
                type="button"
                onClick={() => setProjectType("build")}
                className={`py-3.5 px-4 rounded-2xl border text-sm font-bold transition-all duration-200 flex flex-col items-center justify-center gap-1 text-center ${
                  projectType === "build"
                    ? "bg-brand-amber-500/10 border-brand-amber-500 text-brand-amber-600 dark:text-brand-amber-400 shadow-sm"
                    : "bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700"
                }`}
              >
                <span>Desain & Kontraktor</span>
                <span className="text-[10px] opacity-75 font-medium">Pembangunan Fisik Lengkap</span>
              </button>
            </div>
          </div>

          {/* 2. Mode Specific Options */}
          {projectType === "design" ? (
            /* Design Package Selection */
            <div className="space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                2. Pilih Paket Desain Arsitektur
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {packages.map((pkg: any) => {
                  const isSelected = designPackage === pkg.id;
                  const priceFormatted = formatRupiah(pkg.price_per_m2);
                  return (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => setDesignPackage(pkg.id)}
                      className={`p-3 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
                        isSelected
                          ? "bg-brand-amber-500/10 border-brand-amber-500 text-brand-amber-600 dark:text-brand-amber-400 ring-2 ring-brand-amber-500/20"
                          : "bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs">{pkg.name}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-brand-amber-500 shrink-0" />}
                        </div>
                        <p className="font-display font-extrabold text-sm text-zinc-900 dark:text-white mt-1">
                          {priceFormatted}
                        </p>
                      </div>
                      <span className="text-[9px] text-zinc-400 dark:text-zinc-500 font-mono mt-1">/ m²</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Build Mode Options: Complexity & Material */
            <div className="space-y-4">
              {/* Complexity Tier */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  2. Gaya Desain & Kompleksitas
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "minimalist", label: "Minimalis", sub: "1.0x Multiplier" },
                    { id: "tropical", label: "Modern Tropis", sub: "1.15x Multiplier" },
                    { id: "luxury", label: "Mewah / Klasik", sub: "1.35x Multiplier" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setComplexity(item.id as any)}
                      className={`py-3 px-2 rounded-xl border text-xs font-bold transition-all text-center ${
                        complexity === item.id
                          ? "bg-brand-amber-500/10 border-brand-amber-500 text-brand-amber-600 dark:text-brand-amber-400"
                          : "bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
                      }`}
                    >
                      <div className="font-bold">{item.label}</div>
                      <div className="text-[9px] opacity-75 mt-0.5 font-mono">{item.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Material Tier */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  3. Spesifikasi Material Fisik
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "standard", label: "Standard", sub: formatRupiah(buildBaseRates.standard) + "/m²" },
                    { id: "premium", label: "Premium", sub: formatRupiah(buildBaseRates.premium) + "/m²" },
                    { id: "luxury", label: "Luxury", sub: formatRupiah(buildBaseRates.luxury) + "/m²" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setMaterial(item.id as any)}
                      className={`py-3 px-2 rounded-xl border text-xs font-bold transition-all text-center ${
                        material === item.id
                          ? "bg-brand-amber-500/10 border-brand-amber-500 text-brand-amber-600 dark:text-brand-amber-400"
                          : "bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
                      }`}
                    >
                      <div className="font-bold">{item.label}</div>
                      <div className="text-[9px] opacity-75 mt-0.5 font-mono">{item.sub}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 3. Building Area Slider + Quick Presets */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              <span>{projectType === "design" ? "3. Luas Rencana Desain" : "4. Perkiraan Luas Bangunan"}</span>
              <span className="text-brand-amber-600 dark:text-brand-amber-400 font-mono text-base font-extrabold">{area} m²</span>
            </div>
            <input
              type="range"
              min={30}
              max={800}
              step={5}
              value={area}
              onChange={(e) => setArea(Number(e.target.value))}
              className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-brand-amber-500"
            />
            {/* Quick preset buttons for user friendliness */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mr-1">Ukuran Cepat:</span>
              {areaPresets.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setArea(size)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                    area === size
                      ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm"
                      : "bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                  }`}
                >
                  {size} m²
                </button>
              ))}
            </div>
          </div>

          {/* 4. Optional Add-on Services Checkboxes */}
          <div className="space-y-2.5 pt-2 border-t border-zinc-100 dark:border-zinc-900">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Layanan Tambahan (Opsional)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* PBG/IMB Option */}
              <label
                onClick={() => setIncludePbg(!includePbg)}
                className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                  includePbg
                    ? "bg-brand-amber-500/10 border-brand-amber-500 text-brand-amber-600 dark:text-brand-amber-400"
                    : "bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                    includePbg ? "bg-brand-amber-500 border-brand-amber-500 text-white" : "border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950"
                  }`}>
                    {includePbg && <Check className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-900 dark:text-white">Perizinan PBG / IMB</p>
                    <p className="text-[10px] text-zinc-400 font-mono">+{formatRupiah(pbgPrice)}</p>
                  </div>
                </div>
              </label>

              {/* Structural Calc Option */}
              <label
                onClick={() => setIncludeStructure(!includeStructure)}
                className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                  includeStructure
                    ? "bg-brand-amber-500/10 border-brand-amber-500 text-brand-amber-600 dark:text-brand-amber-400"
                    : "bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                    includeStructure ? "bg-brand-amber-500 border-brand-amber-500 text-white" : "border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950"
                  }`}>
                    {includeStructure && <Check className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-900 dark:text-white">Hitungan Struktur Sipil</p>
                    <p className="text-[10px] text-zinc-400 font-mono">+{formatRupiah(structureRate)} / m²</p>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Price Output & Breakdown Card */}
        <div className="lg:col-span-6 space-y-6">
          <div className="p-8 rounded-3xl bg-zinc-900 text-white dark:bg-zinc-900 border border-zinc-800 shadow-2xl relative overflow-hidden flex flex-col justify-between h-full min-h-[420px]">
            {/* Background Subtle Accent */}
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:20px_20px]" />

            <div className="relative space-y-6 z-10">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <span className="text-[10px] font-bold tracking-widest text-brand-amber-500 uppercase">
                  ESTIMASI TOTAL ANGGARAN
                </span>
                <span className="text-[10px] text-zinc-400 font-medium px-2.5 py-1 rounded-full bg-zinc-800/80">
                  {projectType === "design" ? "Desain Arsitektur" : "Konstruksi + Desain"}
                </span>
              </div>

              {/* Total Price Range Display */}
              <div className="space-y-1.5">
                <div className="font-display font-black text-3xl sm:text-4xl text-gradient">
                  {formatRupiah(minCost)} - {formatRupiah(maxCost)}
                </div>
                <p className="text-xs text-zinc-400 font-medium leading-relaxed">
                  {projectType === "design"
                    ? `Perkiraan biaya pembuatan berkas desain lengkap untuk bangunan ${area} m² (termasuk visualisasi & gambar kerja).`
                    : `Estimasi total ini meliputi perizinan dasar, upah tukang, material pembangunan, dan pengawasan proyek (${area} m²).`}
                </p>
              </div>

              {/* Itemized Calculation Summary Box */}
              <div className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 space-y-2 text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>
                    {projectType === "design" ? `${selectedPackageObj?.name || "Desain"} (${area} m² × ${formatRupiah(selectedPackageObj?.price_per_m2 || 18000)})` : `Struktur & Finishing (${area} m²)`}
                  </span>
                  <span className="font-mono text-white font-bold">{formatRupiah(baseCost)}</span>
                </div>
                {includePbg && (
                  <div className="flex justify-between text-zinc-400">
                    <span>Jasa Perizinan PBG / IMB</span>
                    <span className="font-mono text-white font-bold">{formatRupiah(pbgCost)}</span>
                  </div>
                )}
                {includeStructure && (
                  <div className="flex justify-between text-zinc-400">
                    <span>Hitungan Struktur ({area} m² × {formatRupiah(structureRate)})</span>
                    <span className="font-mono text-white font-bold">{formatRupiah(structureCost)}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-zinc-800 flex justify-between font-bold text-white">
                  <span>Total Estimasi Dasar</span>
                  <span className="font-mono text-brand-amber-400">{formatRupiah(totalCalculated)}</span>
                </div>
              </div>

              {/* Cost breakdowns progress bars (for build mode) */}
              {projectType === "build" && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Alokasi Anggaran Utama (RAB)
                  </h4>
                  <div className="space-y-2">
                    {buildBreakdown.map((item, idx) => {
                      const cost = Math.round(baseCost * (item.percentage / 100));
                      return (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between text-[11px] font-medium text-zinc-300">
                            <span>{item.name}</span>
                            <span className="font-mono text-white">{formatRupiah(cost)} ({item.percentage}%)</span>
                          </div>
                          <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-brand-amber-500 rounded-full"
                              style={{ width: `${item.percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Design Package features output summary (for design mode) */}
              {projectType === "design" && selectedPackageObj && (
                <div className="space-y-2.5 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-brand-amber-500" />
                    Item Berkas {selectedPackageObj.name} Termasuk:
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-zinc-300">
                    {selectedPackageObj.features?.map((feat: string, idx: number) => (
                      <li key={idx} className="flex items-center gap-2 font-medium">
                        <ChevronRight className="w-3.5 h-3.5 text-brand-amber-500 shrink-0" />
                        <span className="line-clamp-1">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Materials Spec sheet summary for build mode */}
              {projectType === "build" && (
                <div className="space-y-2.5 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-brand-amber-500" />
                    Spesifikasi Material Utama ({material.toUpperCase()})
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-zinc-300">
                    {specSheets[material].slice(0, 4).map((spec, idx) => (
                      <li key={idx} className="flex items-center gap-2 font-medium">
                        <ChevronRight className="w-3.5 h-3.5 text-brand-amber-500 shrink-0" />
                        <span className="line-clamp-1">{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* WA Action Button */}
            <div className="pt-6 relative z-10">
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full p-4 rounded-2xl bg-brand-amber-600 hover:bg-brand-amber-500 text-white font-bold tracking-wide flex items-center justify-center gap-3 transition-all duration-300 shadow-lg shadow-brand-amber-600/25 hover:-translate-y-0.5 active:translate-y-0 text-sm"
              >
                <MessageSquare className="w-5 h-5" />
                Konsultasikan Detail RAB via WA
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
