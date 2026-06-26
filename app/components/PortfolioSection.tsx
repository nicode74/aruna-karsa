"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Filter, MapPin, Calendar, Ruler, CheckCircle2, RefreshCw, Layers } from "lucide-react";

interface Project {
  id: any;
  title: string;
  category: "residential" | "commercial" | "interior";
  category_label?: string;
  categoryLabel?: string;
  location: string;
  year: string;
  area: string;
  status: "Selesai" | "Pembangunan" | "Perencanaan";
  image_url?: string;
  image?: string;
  description: string;
  client: string;
  materials: string[];
}

interface PortfolioSectionProps {
  isDetailed?: boolean;
  title?: string;
  subtitle?: string;
  projects?: Project[];
}

export default function PortfolioSection({
  isDetailed = false,
  title,
  subtitle,
  projects: propProjects,
}: PortfolioSectionProps) {
  const [filter, setFilter] = useState<"all" | "residential" | "commercial" | "interior">("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const defaultProjects: Project[] = [
    {
      id: 1,
      title: "Villa Kayu Aruna",
      category: "residential",
      categoryLabel: "Residensial",
      location: "Jimbaran, Bali",
      year: "2025",
      area: "350 m²",
      status: "Selesai",
      image: "/images/modern_villa.png",
      description: "Desain dan pembangunan villa mewah bernuansa modern-tropis dengan struktur beton ekspos, kaca tempered lebar, dan cladding kayu jati daur ulang yang ramah lingkungan.",
      client: "Bpk. Adrian Wijaya",
      materials: ["Beton Struktur K-350", "Kayu Jati Grade A", "Kaca Low-E 8mm", "Smart Home System Integrations"]
    },
    {
      id: 2,
      title: "Ruang Karsa Co-Working",
      category: "commercial",
      categoryLabel: "Komersial",
      location: "SCBD, Jakarta",
      year: "2026",
      area: "680 m²",
      status: "Selesai",
      image: "/images/luxury_interior.png",
      description: "Pengerjaan interior luxury office untuk co-working space eksklusif. Menyeimbangkan tata akustik ruang, kehangatan material kayu, pencahayaan indirect LED, dan zonasi fungsional.",
      client: "PT Karsa Ruang Bersama",
      materials: ["Acoustic Panel Board", "Finishing HPL Premium", "Direct & Indirect LED warm white", "Ergonomic Furniture Set"]
    },
    {
      id: 3,
      title: "Cluster Bintang Lestari",
      category: "residential",
      categoryLabel: "Residensial",
      location: "BSD City, Tangerang",
      year: "2026",
      area: "240 m² (Per Unit)",
      status: "Pembangunan",
      image: "/images/construction_site.png",
      description: "Proyek pembangunan cluster perumahan modern minimalis 2 lantai dengan pengerjaan struktur baja WF yang kuat, beton ready-mix tersertifikasi, dan pengawasan terstruktur harian.",
      client: "PT Lestari Indah Sentosa",
      materials: ["Baja Struktur WF 250", "Beton Ready-mix K-300", "Bata Ringan Hebel", "Rangka Atap Baja Ringan"]
    }
  ];

  const rawProjects = propProjects || defaultProjects;

  const projects = rawProjects.map(p => ({
    ...p,
    image: p.image_url || p.image || "/images/modern_villa.png",
    categoryLabel: p.category_label || p.categoryLabel || "Residensial"
  }));

  const filteredProjects = filter === "all"
    ? projects
    : projects.filter(p => p.category === filter);

  const sectionTitle = title || "PORTOFOLIO";
  const sectionSubtitle = subtitle || "Karya Konstruksi & Keindahan Arsitektur Kami";

  // In landing mode, limit projects to 3.
  const displayProjects = isDetailed ? filteredProjects : projects.slice(0, 3);

  return (
    <section className="py-24 bg-white dark:bg-zinc-950 transition-colors">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-4 max-w-2xl">
            <h2 className="text-xs font-bold uppercase tracking-widest text-brand-amber-600 dark:text-brand-amber-500">
              {sectionTitle}
            </h2>
            <p className="font-display font-extrabold text-3xl sm:text-4xl text-zinc-900 dark:text-white leading-tight">
              {sectionSubtitle}
            </p>
          </div>
          {!isDetailed && (
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 text-sm font-bold text-brand-amber-600 dark:text-brand-amber-500 hover:text-brand-amber-700 dark:hover:text-brand-amber-400 transition-colors duration-200 group shrink-0"
            >
              Lihat Semua Proyek
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>

        {/* Filters (Only in detailed view) */}
        {isDetailed && (
          <div className="flex flex-wrap items-center gap-3 mb-12 border-b border-zinc-100 dark:border-zinc-900 pb-6">
            <div className="flex items-center gap-2 text-zinc-400 dark:text-zinc-500 mr-2 text-sm font-medium">
              <Filter className="w-4 h-4" />
              <span>Kategori:</span>
            </div>
            {[
              { id: "all", label: "Semua Kategori" },
              { id: "residential", label: "Residensial" },
              { id: "commercial", label: "Komersial" },
              { id: "interior", label: "Interior" }
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setFilter(btn.id as "all" | "residential" | "commercial" | "interior")}
                className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-200 shadow-sm border ${
                  filter === btn.id
                    ? "bg-brand-amber-500 border-brand-amber-500 text-white shadow-md shadow-brand-amber-500/20"
                    : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        )}

        {/* Grid Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className="group cursor-pointer rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 hover:border-brand-amber-500/30 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 shadow-sm"
            >
              {/* Image Frame */}
              <div className="relative aspect-video w-full overflow-hidden bg-zinc-200 dark:bg-zinc-800">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-w-768px) 100vw, 30vw"
                />
                {/* Status Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-sm border text-white ${
                    project.status === "Selesai"
                      ? "bg-green-600/80 border-green-500/30"
                      : project.status === "Pembangunan"
                      ? "bg-brand-amber-600/80 border-brand-amber-500/30"
                      : "bg-blue-600/80 border-blue-500/30"
                  }`}>
                    {project.status === "Selesai" ? (
                      <CheckCircle2 className="w-3 h-3" />
                    ) : (
                      <RefreshCw className="w-3 h-3 animate-spin" />
                    )}
                    {project.status}
                  </span>
                </div>
              </div>

              {/* Text info */}
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 font-semibold tracking-wider uppercase">
                  <span>{project.categoryLabel}</span>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{project.location}</span>
                  </div>
                </div>

                <h3 className="font-display font-bold text-xl text-zinc-900 dark:text-white group-hover:text-brand-amber-600 dark:group-hover:text-brand-amber-500 transition-colors">
                  {project.title}
                </h3>

                <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                  {project.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Project Modal Overlay */}
        {selectedProject && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 overflow-y-auto p-4 sm:p-6 md:p-10 flex justify-center items-start sm:items-center animate-fadeIn">
            <div className="bg-white dark:bg-zinc-950 rounded-3xl max-w-3xl w-full border border-zinc-200 dark:border-zinc-800 shadow-2xl relative overflow-hidden my-8 sm:my-auto">
              {/* Header Image */}
              <div className="relative aspect-video w-full bg-zinc-200">
                <Image
                  src={selectedProject.image || "/images/modern_villa.png"}
                  alt={selectedProject.title}
                  fill
                  className="object-cover"
                />
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/55 hover:bg-black/80 text-white flex items-center justify-center transition-colors shadow-md border border-white/10"
                  aria-label="Close modal"
                >
                  &times;
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-8 space-y-6">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-zinc-500 dark:text-zinc-400 font-semibold border-b border-zinc-100 dark:border-zinc-900 pb-4">
                  <span className="text-brand-amber-600 dark:text-brand-amber-500 font-bold uppercase tracking-wider">
                    {selectedProject.categoryLabel}
                  </span>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-zinc-400" />
                    <span>{selectedProject.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-zinc-400" />
                    <span>Tahun {selectedProject.year}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Ruler className="w-4 h-4 text-zinc-400" />
                    <span>Luas {selectedProject.area}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-display font-extrabold text-2xl text-zinc-900 dark:text-white">
                    {selectedProject.title}
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed font-normal">
                    {selectedProject.description}
                  </p>
                </div>

                {/* Additional Spec Meta */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-zinc-100 dark:border-zinc-900 text-sm">
                  <div>
                    <h4 className="font-bold text-zinc-900 dark:text-white mb-2 flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-brand-amber-500" />
                      Detail Klien & Status
                    </h4>
                    <ul className="space-y-1.5 text-xs text-zinc-500 dark:text-zinc-400 font-semibold">
                      <li>Klien: <span className="text-zinc-700 dark:text-zinc-300">{selectedProject.client}</span></li>
                      <li>Status Proyek: <span className="text-zinc-700 dark:text-zinc-300">{selectedProject.status}</span></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900 dark:text-white mb-2 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-brand-amber-500" />
                      Spesifikasi Material Utama
                    </h4>
                    <ul className="grid grid-cols-2 gap-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                      {selectedProject.materials.map((mat, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-brand-amber-500" />
                          <span>{mat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
