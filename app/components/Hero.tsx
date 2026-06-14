"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Building, Palette } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-20 overflow-hidden bg-radial from-brand-slate-50 via-zinc-100 to-zinc-200 dark:from-zinc-950 dark:via-brand-slate-950 dark:to-black">
      {/* Background Decorative Grid */}
      <div className="absolute inset-0 opacity-10 dark:opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }} />
      </div>

      {/* Decorative Orbs */}
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-br from-brand-amber-500/20 to-brand-amber-600/0 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-tr from-brand-amber-500/10 to-brand-amber-600/0 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full z-10">
        {/* Left Side: Copywriting */}
        <div className="lg:col-span-7 space-y-8 text-center lg:text-left flex flex-col items-center lg:items-start">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-amber-500/10 dark:bg-brand-amber-500/5 text-brand-amber-600 dark:text-brand-amber-500 text-xs font-bold uppercase tracking-wider shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pemberi Cahaya & Awal yang Baru</span>
          </div>

          <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.1] text-zinc-900 dark:text-white max-w-2xl">
            Dari Tekad Menjadi <span className="text-gradient">Hunian</span>, Dari Harapan Menjadi <span className="text-gradient">Kenyataan</span>.
          </h1>

          <p className="text-lg text-zinc-600 dark:text-zinc-300 max-w-lg leading-relaxed font-normal">
            Aruna Karsa merancang arsitektur dan membangun hunian yang melambangkan estetika, kekuatan struktur, serta keterbukaan anggaran sejak awal. Kami menghadirkan ruang hidup yang bermakna dan aman sepanjang masa.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link
              href="/contact"
              className="group px-8 py-4 rounded-xl bg-brand-amber-600 text-white font-bold tracking-wide shadow-lg shadow-brand-amber-600/25 hover:bg-brand-amber-500 hover:shadow-brand-amber-500/30 transition-all duration-300 flex items-center justify-center gap-2 hover:-translate-y-0.5"
            >
              Konsultasi Sekarang
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/portfolio"
              className="px-8 py-4 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white/50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-200 font-bold tracking-wide shadow-sm hover:border-zinc-400 dark:hover:border-zinc-600 transition-all duration-300 flex items-center justify-center hover:-translate-y-0.5"
            >
              Lihat Portofolio
            </Link>
          </div>

          {/* Quick Metrics / Values */}
          <div className="pt-8 border-t border-zinc-200/60 dark:border-zinc-800/60 grid grid-cols-3 gap-6 sm:gap-12 w-full max-w-lg">
            <div>
              <div className="text-2xl sm:text-3xl font-display font-extrabold text-zinc-900 dark:text-white">100%</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold uppercase mt-1">RAB Transparan</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-display font-extrabold text-zinc-900 dark:text-white">5+ Thn</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold uppercase mt-1">Daya Tahan Struktur</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-display font-extrabold text-zinc-900 dark:text-white">50+</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold uppercase mt-1">Hunian Impian</div>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Abstract Vector Design */}
        <div className="lg:col-span-5 relative flex items-center justify-center lg:justify-end">
          <div className="relative w-72 h-72 sm:w-96 sm:h-96 rounded-3xl bg-zinc-900 dark:bg-zinc-800 shadow-2xl overflow-hidden border border-zinc-800/80 group">
            {/* Architectural Grid Lines Overlay */}
            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:16px_16px]" />
            
            {/* Animated Golden Sun / Circle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-gradient-to-br from-brand-amber-500 to-amber-600 opacity-60 filter blur-xl animate-pulse" />
            
            {/* Geometric Vector Lines representation of building */}
            <div className="absolute inset-8 border border-white/10 rounded-2xl flex flex-col justify-between p-6">
              <div className="flex justify-between items-start">
                <div className="w-12 h-1 bg-white/20 rounded-full" />
                <div className="w-3 h-3 rounded-full bg-brand-amber-500" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-white/50 text-xs font-mono">
                  <Building className="w-3.5 h-3.5 text-brand-amber-500" />
                  <span>Karsa: Kekuatan & Presisi</span>
                </div>
                <div className="w-full h-[1px] bg-white/15" />
                <div className="flex items-center gap-2 text-white/50 text-xs font-mono">
                  <Palette className="w-3.5 h-3.5 text-brand-amber-500" />
                  <span>Aruna: Estetika & Cahaya</span>
                </div>
              </div>
            </div>

            {/* Accent Highlight */}
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-amber-500 via-amber-600 to-brand-amber-500" />
          </div>
        </div>
      </div>
    </section>
  );
}
