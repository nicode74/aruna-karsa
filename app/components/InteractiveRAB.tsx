"use client";

import React, { useState } from "react";
import { Info, Calculator, MessageSquare, ChevronRight } from "lucide-react";

interface InteractiveRABProps {
  pricelist?: any;
}

export default function InteractiveRAB({ pricelist }: InteractiveRABProps) {
  const [projectType, setProjectType] = useState<"design" | "build">("build");
  const [area, setArea] = useState<number>(100);
  const [complexity, setComplexity] = useState<"minimalist" | "tropical" | "luxury">("tropical");
  const [material, setMaterial] = useState<"standard" | "premium" | "luxury">("premium");

  // Dynamic design package rates from pricelist or defaults (Packet A: 12k, Packet B: 18k, Packet C: 24k)
  const packetAPrice = pricelist?.packages?.find((p: any) => p.id === "packet_a")?.price_per_m2 || 12000;
  const packetBPrice = pricelist?.packages?.find((p: any) => p.id === "packet_b")?.price_per_m2 || 18000;
  const packetCPrice = pricelist?.packages?.find((p: any) => p.id === "packet_c")?.price_per_m2 || 24000;

  // Rates in IDR (Rp) per m²
  const baseRates = {
    design: {
      standard: packetAPrice,
      premium: packetBPrice,
      luxury: packetCPrice,
    },
    build: {
      standard: 3800000,
      premium: 5200000,
      luxury: 7500000,
    },
  };


  const complexityMultipliers = {
    minimalist: 1.0,
    tropical: 1.15,
    luxury: 1.35,
  };

  // Directly calculate costs dynamically during render to avoid synchronous state updates in useEffect
  const rate = baseRates[projectType][material];
  const multiplier = complexityMultipliers[complexity];
  const calculatedBase = rate * area * multiplier;

  // Output range (plus minus 5%)
  const minCost = Math.round((calculatedBase * 0.95) / 10000) * 10000;
  const maxCost = Math.round((calculatedBase * 1.05) / 10000) * 10000;

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Cost Breakdown calculations (only relevant for full build)
  const breakdown = [
    { name: "Pondasi & Struktur Utama (Beton/Baja)", percentage: 35 },
    { name: "Dinding & Finishing (Pasangan Bata, Cat, Lantai)", percentage: 30 },
    { name: "Atap, Rangka & Plafon", percentage: 18 },
    { name: "Mekanikal, Elektrikal & Plumbing (MEP)", percentage: 17 },
  ];

  const specSheets = {
    standard: ["Pondasi batu belah & beton bertulang", "Dinding bata ringan plaster acian + cat catylac", "Lantai Granit China 60x60", "Atap baja ringan + genteng flat beton", "Sanitair closet duduk TOTO standard"],
    premium: ["Struktur Beton K-300 SNI", "Dinding bata merah / hebel + cat Mowilex Weathercoat", "Lantai Homogeneous Tile Roman 80x80", "Kusen Aluminium Alexindo / YKK", "Sanitair closet duduk TOTO premium & shower set"],
    luxury: ["Struktur Beton K-350 & Kolom Baja", "Dinding bata merah double dinding + cat Dulux Ambiance", "Lantai Marmer Lokal Ujung Pandang / Impor", "Kusen Aluminium YKK AP + kaca double glass 8mm", "Smart Home System + Sanitair Kohler/Grohe"]
  };

  const getWhatsAppLink = () => {
    const typeLabel = projectType === "build" ? "Desain & Bangun Baru (Konstruksi)" : "Desain Arsitektur Saja";
    const complexityLabel = complexity === "minimalist" ? "Minimalis Sederhana" : complexity === "tropical" ? "Modern Tropis" : "Klasik Luxury";
    const materialLabel = material === "standard" ? "Standard (Kokoh & Hemat)" : material === "premium" ? "Premium (Kuat & Elegan)" : "Luxury (Eksklusif & Smart)";
    
    const text = `Halo Aruna Karsa, saya telah mencoba Kalkulator RAB Website dengan rincian berikut:
- Kebutuhan: ${typeLabel}
- Luas Rencana: ${area} m²
- Gaya Desain: ${complexityLabel}
- Material Tier: ${materialLabel}
- Perkiraan Anggaran: ${formatRupiah(minCost)} - ${formatRupiah(maxCost)}

Mohon info untuk jadwal konsultasi & detail spesifikasi teknisnya. Terima kasih.`;

    return `https://wa.me/628123456789?text=${encodeURIComponent(text)}`;
  };


  return (
    <div id="rab-calculator" className="bg-white dark:bg-zinc-950 p-8 md:p-12 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-xl scroll-mt-24">
      {/* Title */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-brand-amber-500/10 flex items-center justify-center text-brand-amber-600">
          <Calculator className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-display font-extrabold text-2xl text-zinc-900 dark:text-white">
            Kalkulator RAB Transparan
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider mt-0.5">
            Rencana Anggaran Biaya Awal (Estimasi Instan)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Side: Parameters Inputs */}
        <div className="lg:col-span-6 space-y-6">
          {/* Project Type Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Jenis Kebutuhan Proyek
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setProjectType("design")}
                className={`py-3.5 px-4 rounded-xl border text-sm font-bold transition-all duration-200 flex flex-col items-center justify-center gap-1.5 ${
                  projectType === "design"
                    ? "bg-brand-amber-500/5 border-brand-amber-500 text-brand-amber-600 dark:text-brand-amber-500"
                    : "bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700"
                }`}
              >
                <span>Desain Arsitektur</span>
                <span className="text-[10px] opacity-75 font-medium">Render 3D & DED Kerja</span>
              </button>
              <button
                type="button"
                onClick={() => setProjectType("build")}
                className={`py-3.5 px-4 rounded-xl border text-sm font-bold transition-all duration-200 flex flex-col items-center justify-center gap-1.5 ${
                  projectType === "build"
                    ? "bg-brand-amber-500/5 border-brand-amber-500 text-brand-amber-600 dark:text-brand-amber-500"
                    : "bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700"
                }`}
              >
                <span>Desain & Kontraktor</span>
                <span className="text-[10px] opacity-75 font-medium">Pembangunan Fisik + Desain</span>
              </button>
            </div>
          </div>

          {/* Building Area Size */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              <span>Perkiraan Luas Bangunan</span>
              <span className="text-zinc-900 dark:text-white font-mono text-sm">{area} m²</span>
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
            <div className="flex justify-between text-[10px] text-zinc-400 font-bold">
              <span>30 m² (Kecil/Tipe 36)</span>
              <span>800 m² (Mansion/Komersial)</span>
            </div>
          </div>

          {/* Complexity Tier */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Gaya Desain & Kompleksitas Struktur
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "minimalist", label: "Minimalis", sub: "Sederhana" },
                { id: "tropical", label: "Modern Tropis", sub: "Menengah" },
                { id: "luxury", label: "Mewah/Klasik", sub: "Kompleks" },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setComplexity(item.id as "minimalist" | "tropical" | "luxury")}
                  className={`py-3 px-2 rounded-xl border text-xs font-bold transition-all duration-200 flex flex-col items-center justify-center gap-1 ${
                    complexity === item.id
                      ? "bg-brand-amber-500/5 border-brand-amber-500 text-brand-amber-600 dark:text-brand-amber-500"
                      : "bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400"
                  }`}
                >
                  <span>{item.label}</span>
                  <span className="text-[9px] opacity-75 font-semibold font-mono">x{complexityMultipliers[item.id as keyof typeof complexityMultipliers]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Material Quality Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Kualitas Spesifikasi Material
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "standard", label: "Standard", sub: "Kokoh & Hemat" },
                { id: "premium", label: "Premium", sub: "Elegan & Kuat" },
                { id: "luxury", label: "Luxury", sub: "Impor & Mewah" },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setMaterial(item.id as "standard" | "premium" | "luxury")}
                  className={`py-3 px-2 rounded-xl border text-xs font-bold transition-all duration-200 flex flex-col items-center justify-center gap-1 ${
                    material === item.id
                      ? "bg-brand-amber-500/5 border-brand-amber-500 text-brand-amber-600 dark:text-brand-amber-500"
                      : "bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400"
                  }`}
                >
                  <span>{item.label}</span>
                  <span className="text-[9px] opacity-75 font-medium">{item.sub}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Cost Calculation Output Card */}
        <div className="lg:col-span-6 space-y-6">
          <div className="p-8 rounded-3xl bg-zinc-900 text-white dark:bg-zinc-900 border border-zinc-800 shadow-2xl relative overflow-hidden flex flex-col justify-between h-full min-h-[380px]">
            {/* Background Grid Accent */}
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:20px_20px]" />
            
            <div className="relative space-y-6 z-10">
              <span className="text-[10px] font-bold tracking-widest text-brand-amber-500 uppercase">
                ESTIMASI TOTAL ANGGARAN
              </span>

              {/* Total Price Range */}
              <div className="space-y-2">
                <div className="font-display font-black text-3xl sm:text-4xl text-gradient">
                  {formatRupiah(minCost)} - {formatRupiah(maxCost)}
                </div>
                <p className="text-xs text-zinc-400 font-medium leading-relaxed">
                  Estimasi anggaran awal ini meliputi biaya perizinan dasar, upah tukang, material pembangunan, dan fee arsitek (belum termasuk PPN & interior custom lepasan).
                </p>
              </div>

              {/* Cost breakdowns */}
              {projectType === "build" && (
                <div className="space-y-4 pt-4 border-t border-zinc-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Alokasi Anggaran (Rincian RAB)
                  </h4>
                  <div className="space-y-2.5">
                    {breakdown.map((item, idx) => {
                      const cost = Math.round((minCost + maxCost) / 2 * (item.percentage / 100));
                      return (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between text-xs font-medium text-zinc-300">
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


              {/* Materials Spec sheet summary */}
              <div className="space-y-3 pt-4 border-t border-zinc-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-brand-amber-500" />
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
            </div>

            {/* WA Button CTA */}
            <div className="pt-6 relative z-10">
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full p-4 rounded-xl bg-brand-amber-600 hover:bg-brand-amber-500 text-white font-bold tracking-wide flex items-center justify-center gap-3 transition-all duration-300 shadow-md shadow-brand-amber-600/20 hover:-translate-y-0.5 active:translate-y-0"
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
