"use client";

import React, { useState } from "react";
import { savePricelist } from "../../actions/dbActions";
import { DEFAULT_PRICELIST } from "../../../lib/supabase/helpers";
import {
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  Plus,
  X,
  Layers,
  Calculator,
  FileCheck,
  ShieldCheck,
} from "lucide-react";

interface PricelistFormProps {
  initialPricelist?: any;
}

export default function PricelistForm({ initialPricelist }: PricelistFormProps) {
  const [pricelist, setPricelist] = useState<any>(initialPricelist || DEFAULT_PRICELIST);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // New item input states
  const [newRegion, setNewRegion] = useState("");
  const [newFeatureInput, setNewFeatureInput] = useState<{ [pkgId: string]: string }>({});

  const handlePackageChange = (idx: number, field: string, value: any) => {
    setPricelist((prev: any) => {
      const updatedPackages = [...(prev.packages || DEFAULT_PRICELIST.packages)];
      updatedPackages[idx] = {
        ...updatedPackages[idx],
        [field]: field === "price_per_m2" ? parseInt(value) || 0 : value,
      };
      return { ...prev, packages: updatedPackages };
    });
  };

  const handleAddFeature = (pkgIdx: number, pkgId: string) => {
    const feat = newFeatureInput[pkgId]?.trim();
    if (!feat) return;

    setPricelist((prev: any) => {
      const updatedPackages = [...(prev.packages || DEFAULT_PRICELIST.packages)];
      const currentFeatures = updatedPackages[pkgIdx].features || [];
      updatedPackages[pkgIdx] = {
        ...updatedPackages[pkgIdx],
        features: [...currentFeatures, feat],
      };
      return { ...prev, packages: updatedPackages };
    });

    setNewFeatureInput((prev) => ({ ...prev, [pkgId]: "" }));
  };

  const handleRemoveFeature = (pkgIdx: number, featIdx: number) => {
    setPricelist((prev: any) => {
      const updatedPackages = [...(prev.packages || DEFAULT_PRICELIST.packages)];
      const currentFeatures = updatedPackages[pkgIdx].features || [];
      updatedPackages[pkgIdx] = {
        ...updatedPackages[pkgIdx],
        features: currentFeatures.filter((_: any, i: number) => i !== featIdx),
      };
      return { ...prev, packages: updatedPackages };
    });
  };

  const handleRabChange = (field: string, value: string) => {
    setPricelist((prev: any) => ({
      ...prev,
      rab_standalone: {
        ...(prev.rab_standalone || DEFAULT_PRICELIST.rab_standalone),
        [field]: parseInt(value) || 0,
      },
    }));
  };

  const handlePbgChange = (field: string, value: any) => {
    setPricelist((prev: any) => ({
      ...prev,
      pbg_imb: {
        ...(prev.pbg_imb || DEFAULT_PRICELIST.pbg_imb),
        [field]: field === "price" ? parseInt(value) || 0 : value,
      },
    }));
  };

  const handleAddRegion = () => {
    if (!newRegion.trim()) return;
    setPricelist((prev: any) => {
      const pbg = prev.pbg_imb || DEFAULT_PRICELIST.pbg_imb;
      return {
        ...prev,
        pbg_imb: {
          ...pbg,
          regions: [...(pbg.regions || []), newRegion.trim()],
        },
      };
    });
    setNewRegion("");
  };

  const handleRemoveRegion = (idx: number) => {
    setPricelist((prev: any) => {
      const pbg = prev.pbg_imb || DEFAULT_PRICELIST.pbg_imb;
      return {
        ...prev,
        pbg_imb: {
          ...pbg,
          regions: (pbg.regions || []).filter((_: any, i: number) => i !== idx),
        },
      };
    });
  };

  const handleStructureChange = (field: string, value: any) => {
    setPricelist((prev: any) => ({
      ...prev,
      structure_calc: {
        ...(prev.structure_calc || DEFAULT_PRICELIST.structure_calc),
        [field]: field === "price_per_m2" ? parseInt(value) || 0 : value,
      },
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const res = await savePricelist(pricelist);
    setSaving(false);

    if (res.error) {
      setMessage({ type: "error", text: `Gagal menyimpan daftar harga: ${res.error}` });
    } else {
      setMessage({ type: "success", text: "Daftar harga berhasil diperbarui & diterbitkan!" });
    }
  };

  const packages = pricelist.packages || DEFAULT_PRICELIST.packages;
  const rab = pricelist.rab_standalone || DEFAULT_PRICELIST.rab_standalone;
  const pbg = pricelist.pbg_imb || DEFAULT_PRICELIST.pbg_imb;
  const structure = pricelist.structure_calc || DEFAULT_PRICELIST.structure_calc;

  return (
    <form onSubmit={handleSave} className="space-y-10 max-w-5xl">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-3xl text-zinc-900 dark:text-white">
            Kelola Daftar Harga (Pricelist)
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Atur tarif paket desain arsitektur, RAB standalone, perizinan PBG/IMB, dan hitungan struktur
          </p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-zinc-900 hover:bg-brand-amber-600 dark:bg-zinc-100 dark:hover:bg-brand-amber-500 dark:text-zinc-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md hover:-translate-y-0.5"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Simpan Perubahan Harga
        </button>
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
          {message.type === "success" ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* 1. Architectural Design Packages */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-zinc-200/50 dark:border-zinc-800/50">
          <div className="w-10 h-10 rounded-xl bg-brand-amber-500/10 text-brand-amber-600 dark:text-brand-amber-500 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display font-extrabold text-xl text-zinc-900 dark:text-white">
              Paket Desain Arsitektur (Per m²)
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Tarif per meter persegi untuk Packet A, Packet B, dan Packet C
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.map((pkg: any, idx: number) => (
            <div
              key={pkg.id || idx}
              className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800/60 space-y-4"
            >
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Nama Paket
                </label>
                <input
                  type="text"
                  value={pkg.name}
                  onChange={(e) => handlePackageChange(idx, "name", e.target.value)}
                  className="mt-1 w-full bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-sm font-bold px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Harga per m² (IDR)
                </label>
                <input
                  type="number"
                  value={pkg.price_per_m2}
                  onChange={(e) => handlePackageChange(idx, "price_per_m2", e.target.value)}
                  className="mt-1 w-full bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white font-mono text-sm px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
                />
              </div>

              {/* Item Features list */}
              <div className="space-y-2 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block">
                  Item / Gambar Termasuk
                </label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={newFeatureInput[pkg.id] || ""}
                    onChange={(e) => setNewFeatureInput({ ...newFeatureInput, [pkg.id]: e.target.value })}
                    placeholder="Tambah item..."
                    className="flex-1 bg-white dark:bg-zinc-900 text-xs text-zinc-900 dark:text-white px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddFeature(idx, pkg.id)}
                    className="p-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg text-zinc-700 dark:text-zinc-300"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <ul className="space-y-1.5 pt-1">
                  {pkg.features?.map((feat: string, featIdx: number) => (
                    <li
                      key={featIdx}
                      className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 text-xs text-zinc-700 dark:text-zinc-300"
                    >
                      <span className="truncate mr-2">{feat}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(idx, featIdx)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-3.5 h-3.5 shrink-0" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Secondary Pricing Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* RAB Standalone */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-zinc-200/50 dark:border-zinc-800/50">
            <Calculator className="w-5 h-5 text-brand-amber-500" />
            <h3 className="font-display font-bold text-base text-zinc-900 dark:text-white">
              RAB Standalone
            </h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Tanpa Analisis (IDR)
              </label>
              <input
                type="number"
                value={rab.without_analysis}
                onChange={(e) => handleRabChange("without_analysis", e.target.value)}
                className="mt-1 w-full bg-zinc-50 dark:bg-zinc-950 font-mono text-sm px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Dengan Analisis (IDR)
              </label>
              <input
                type="number"
                value={rab.with_analysis}
                onChange={(e) => handleRabChange("with_analysis", e.target.value)}
                className="mt-1 w-full bg-zinc-50 dark:bg-zinc-950 font-mono text-sm px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* PBG / IMB Licensing */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-zinc-200/50 dark:border-zinc-800/50">
            <FileCheck className="w-5 h-5 text-brand-amber-500" />
            <h3 className="font-display font-bold text-base text-zinc-900 dark:text-white">
              Jasa PBG / IMB
            </h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Biaya Perizinan (IDR)
              </label>
              <input
                type="number"
                value={pbg.price}
                onChange={(e) => handlePbgChange("price", e.target.value)}
                className="mt-1 w-full bg-zinc-50 dark:bg-zinc-950 font-mono text-sm px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Deskripsi Tambahan
              </label>
              <input
                type="text"
                value={pbg.description || ""}
                onChange={(e) => handlePbgChange("description", e.target.value)}
                className="mt-1 w-full bg-zinc-50 dark:bg-zinc-950 text-xs px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block">
                Wilayah Layanan
              </label>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={newRegion}
                  onChange={(e) => setNewRegion(e.target.value)}
                  placeholder="Tambah daerah..."
                  className="flex-1 bg-zinc-50 dark:bg-zinc-950 text-xs px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white"
                />
                <button
                  type="button"
                  onClick={handleAddRegion}
                  className="p-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg text-zinc-700 dark:text-zinc-300"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-1 pt-1">
                {pbg.regions?.map((reg: string, idx: number) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-xs text-zinc-700 dark:text-zinc-300"
                  >
                    {reg}
                    <button type="button" onClick={() => handleRemoveRegion(idx)} className="text-red-500 hover:text-red-700">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Structural Calculation */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-zinc-200/50 dark:border-zinc-800/50">
            <ShieldCheck className="w-5 h-5 text-brand-amber-500" />
            <h3 className="font-display font-bold text-base text-zinc-900 dark:text-white">
              Hitungan Struktur
            </h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Mulai Dari (IDR per m²)
              </label>
              <input
                type="number"
                value={structure.price_per_m2}
                onChange={(e) => handleStructureChange("price_per_m2", e.target.value)}
                className="mt-1 w-full bg-zinc-50 dark:bg-zinc-950 font-mono text-sm px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Catatan (NB)
              </label>
              <input
                type="text"
                value={structure.note || ""}
                onChange={(e) => handleStructureChange("note", e.target.value)}
                className="mt-1 w-full bg-zinc-50 dark:bg-zinc-950 text-xs px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white"
              />
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Save Action */}
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-zinc-900 hover:bg-brand-amber-600 dark:bg-zinc-100 dark:hover:bg-brand-amber-500 dark:text-zinc-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg hover:-translate-y-0.5"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Simpan Perubahan Harga
        </button>
      </div>
    </form>
  );
}
