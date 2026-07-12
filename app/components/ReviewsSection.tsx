"use client";

import React from "react";
import { Star, MessageSquare } from "lucide-react";

interface Review {
  id: string;
  name: string;
  rating: number;
  message: string;
  created_at: string;
}

interface ReviewsSectionProps {
  reviews?: Review[];
  title?: string;
  subtitle?: string;
}

export default function ReviewsSection({
  reviews = [],
  title,
  subtitle,
}: ReviewsSectionProps) {
  const defaultReviews: Review[] = [
    {
      id: "1",
      name: "Bpk. Ronald",
      rating: 5,
      message: "Sangat puas dengan pengerjaan villa kami. RAB sangat transparan dan pengerjaan tepat waktu dengan pengawasan harian yang ketat.",
      created_at: new Date().toISOString()
    },
    {
      id: "2",
      name: "Ibu Dian",
      rating: 5,
      message: "Arsip dan gambar detail kerja (DED) yang disediakan sangat presisi. Komunikasi dengan arsitek sangat lancar dan solutif.",
      created_at: new Date().toISOString()
    },
    {
      id: "3",
      name: "PT Tech Indo",
      rating: 4,
      message: "Renovasi kantor selesai sesuai jadwal. Desain interior modern minimalis yang dihadirkan membuat karyawan sangat nyaman.",
      created_at: new Date().toISOString()
    }
  ];

  const list = reviews.length > 0 ? reviews : defaultReviews;
  const sectionTitle = title || "ULASAN KLIEN";
  const sectionSubtitle = subtitle || "Apa Kata Mereka Tentang Layanan Aruna Karsa";

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, idx) => (
      <Star
        key={idx}
        className={`w-4 h-4 ${
          idx < rating
            ? "text-brand-amber-500 fill-brand-amber-500"
            : "text-zinc-300 dark:text-zinc-700"
        }`}
      />
    ));
  };

  return (
    <section className="py-24 bg-zinc-50 dark:bg-zinc-900 transition-colors">
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
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {list.map((review) => (
            <div
              key={review.id}
              className="p-8 rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800/50 hover:border-brand-amber-500/50 dark:hover:border-brand-amber-500/30 transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {renderStars(review.rating)}
                  </div>
                  <MessageSquare className="w-5 h-5 text-zinc-300 dark:text-zinc-700" />
                </div>
                <p className="text-sm text-zinc-650 dark:text-zinc-300 leading-relaxed font-normal italic">
                  "{review.message}"
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-900/60 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand-amber-500/10 text-brand-amber-600 dark:text-brand-amber-400 flex items-center justify-center font-bold text-sm shrink-0">
                  {review.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-zinc-900 dark:text-white uppercase tracking-wider">
                    {review.name}
                  </h4>
                  <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mt-0.5">
                    Klien Terverifikasi
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
