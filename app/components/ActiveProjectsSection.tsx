"use client";

import React from "react";
import { Wrench, Calendar, CheckCircle2, RefreshCw, User, BarChart } from "lucide-react";

export interface ActiveProject {
  id: string;
  name: string;
  client_name: string;
  status: "Perencanaan" | "Konstruksi" | "Finishing" | "Selesai";
  progress_percentage: number;
  start_date: string;
  target_date: string;
  description?: string;
}

interface ActiveProjectsSectionProps {
  title?: string;
  subtitle?: string;
  projects?: ActiveProject[];
}

export default function ActiveProjectsSection({
  title,
  subtitle,
  projects = [],
}: ActiveProjectsSectionProps) {
  const displayTitle = title || "PROYEK BERJALAN";
  const displaySubtitle = subtitle || "Proses Konstruksi & Progres Kerja Nyata Kami";

  // Filter out complete projects if needed or show all
  const activeOnly = projects.filter((p) => p.status !== "Selesai");
  const displayList = activeOnly.length > 0 ? activeOnly : projects;

  return (
    <section className="py-24 bg-zinc-50 dark:bg-zinc-900 transition-colors">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-brand-amber-600 dark:text-brand-amber-500">
            {displayTitle}
          </h2>
          <p className="font-display font-extrabold text-3xl sm:text-4xl text-zinc-900 dark:text-white leading-tight">
            {displaySubtitle}
          </p>
          <div className="w-16 h-1 bg-brand-amber-500 mx-auto rounded-full mt-4" />
        </div>

        {displayList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayList.map((project) => (
              <div
                key={project.id}
                className="group p-6 rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm hover:shadow-xl hover:border-brand-amber-500/30 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-6">
                  {/* Status Badge & Header */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider ${
                        project.status === "Konstruksi"
                          ? "bg-brand-amber-500/10 text-brand-amber-600 dark:text-brand-amber-500 border border-brand-amber-500/20"
                          : project.status === "Finishing"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 border border-emerald-500/20"
                          : project.status === "Perencanaan"
                          ? "bg-blue-500/10 text-blue-600 dark:text-blue-500 border border-blue-500/20"
                          : "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border border-zinc-500/20"
                      }`}
                    >
                      {project.status === "Selesai" ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "3s" }} />
                      )}
                      {project.status}
                    </span>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                      <BarChart className="w-3.5 h-3.5" />
                      <span>{project.progress_percentage}% Progres</span>
                    </div>
                  </div>

                  {/* Title & Desc */}
                  <div className="space-y-2">
                    <h3 className="font-display font-bold text-xl text-zinc-900 dark:text-white group-hover:text-brand-amber-600 dark:group-hover:text-brand-amber-500 transition-colors">
                      {project.name}
                    </h3>
                    {project.description && (
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-3">
                        {project.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-900 space-y-4">
                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-brand-amber-500 to-brand-amber-600 rounded-full transition-all duration-500"
                        style={{ width: `${project.progress_percentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Client & Timeline Info */}
                  <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-zinc-400 shrink-0" />
                      <span className="truncate">{project.client_name}</span>
                    </div>
                    <div className="flex items-center gap-2 justify-end text-right">
                      <Calendar className="w-4 h-4 text-zinc-400 shrink-0" />
                      <span className="truncate">Hingga {project.target_date}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-zinc-400 dark:text-zinc-600 font-medium">
            Saat ini tidak ada proyek berjalan yang sedang dikerjakan.
          </div>
        )}
      </div>
    </section>
  );
}
