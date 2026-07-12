"use client";

import React, { useState } from "react";
import { publishReview, deleteReview } from "../../actions/dbActions";
import {
  Star,
  Trash2,
  CheckSquare,
  XSquare,
  Search,
  MessageSquare,
  Loader2,
  CheckCircle,
  AlertCircle,
  Clock,
  Filter,
} from "lucide-react";

interface Review {
  id: string;
  name: string;
  rating: number;
  message: string;
  is_published: boolean;
  created_at: string;
}

interface ReviewsListProps {
  initialReviews: Review[];
}

export default function ReviewsList({ initialReviews }: ReviewsListProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "pending">("all");
  const [ratingFilter, setRatingFilter] = useState<number | "all">("all");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Format date helper
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  // Handle Publish/Unpublish toggle
  const handlePublishToggle = async (id: string, currentStatus: boolean) => {
    setLoadingId(id);
    setMessage(null);

    const res = await publishReview(id, !currentStatus);
    setLoadingId(null);

    if (res.error) {
      setMessage({ type: "error", text: `Gagal memperbarui status ulasan: ${res.error}` });
    } else {
      setMessage({
        type: "success",
        text: currentStatus ? "Ulasan berhasil ditarik dari publik!" : "Ulasan berhasil diterbitkan ke halaman utama!",
      });
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, is_published: !currentStatus } : r))
      );
    }
  };

  // Handle Delete review
  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus ulasan ini?")) return;
    setDeletingId(id);
    setMessage(null);

    const res = await deleteReview(id);
    setDeletingId(null);

    if (res.error) {
      setMessage({ type: "error", text: `Gagal menghapus ulasan: ${res.error}` });
    } else {
      setMessage({ type: "success", text: "Ulasan berhasil dihapus dari database!" });
      setReviews((prev) => prev.filter((r) => r.id !== id));
    }
  };

  // Filter reviews
  const filteredReviews = reviews.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.message.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "published" && r.is_published) ||
      (statusFilter === "pending" && !r.is_published);

    const matchesRating = ratingFilter === "all" || r.rating === ratingFilter;

    return matchesSearch && matchesStatus && matchesRating;
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, idx) => (
      <Star
        key={idx}
        className={`w-3.5 h-3.5 ${
          idx < rating
            ? "text-brand-amber-500 fill-brand-amber-500"
            : "text-zinc-300 dark:text-zinc-700"
        }`}
      />
    ));
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-3xl text-zinc-900 dark:text-white flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-brand-amber-500 shrink-0" />
            Kelola Ulasan Klien
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Moderasi, publikasikan, atau hapus ulasan testimonial dari klien website
          </p>
        </div>
        <div className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 px-4 py-2 rounded-2xl text-xs font-bold uppercase tracking-wider text-zinc-650 dark:text-zinc-350 self-start sm:self-auto">
          Total: {reviews.length} Ulasan
        </div>
      </div>

      {/* Alert Message */}
      {message && (
        <div
          className={`p-4 rounded-2xl flex items-start gap-3 border text-sm font-semibold transition-all ${
            message.type === "success"
              ? "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900/30 text-green-700 dark:text-green-400"
              : "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Filters & Search Controls */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari ulasan berdasarkan nama atau isi pesan..."
            className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm pl-12 pr-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800/80 focus:outline-none focus:border-brand-amber-500 transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-6 text-sm text-zinc-500">
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-zinc-400" />
            <span className="font-semibold text-xs uppercase tracking-wider">Status:</span>
            <div className="flex gap-1.5">
              {[
                { id: "all", label: "Semua" },
                { id: "published", label: "Terbit" },
                { id: "pending", label: "Moderasi" },
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => setStatusFilter(btn.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    statusFilter === btn.id
                      ? "bg-brand-amber-500 text-white"
                      : "bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100"
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* Rating Filter */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-xs uppercase tracking-wider">Bintang:</span>
            <div className="flex gap-1.5">
              <button
                onClick={() => setRatingFilter("all")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  ratingFilter === "all"
                    ? "bg-brand-amber-500 text-white"
                    : "bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100"
                }`}
              >
                Semua
              </button>
              {[5, 4, 3, 2, 1].map((stars) => (
                <button
                  key={stars}
                  onClick={() => setRatingFilter(stars)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                    ratingFilter === stars
                      ? "bg-brand-amber-500 text-white"
                      : "bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100"
                  }`}
                >
                  {stars} <Star className="w-3 h-3 fill-current" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Table / Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredReviews.length === 0 ? (
          <div className="md:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center text-zinc-400 dark:text-zinc-600">
              <MessageSquare className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-zinc-900 dark:text-white">Tidak Ada Ulasan</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto mt-1">
                {searchTerm || statusFilter !== "all" || ratingFilter !== "all"
                  ? "Tidak ditemukan ulasan yang cocok dengan kriteria pencarian atau filter Anda."
                  : "Belum ada ulasan klien yang terekam di database."}
              </p>
            </div>
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div
              key={review.id}
              className={`p-6 rounded-3xl bg-white dark:bg-zinc-900 border flex flex-col justify-between shadow-sm transition-all ${
                review.is_published
                  ? "border-green-500/20 dark:border-green-500/10"
                  : "border-zinc-200/60 dark:border-zinc-800/60"
              }`}
            >
              <div className="space-y-4">
                {/* Meta details */}
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-display font-bold text-base text-zinc-900 dark:text-white">
                      {review.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider border ${
                      review.is_published
                        ? "bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400"
                        : "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400"
                    }`}
                  >
                    {review.is_published ? (
                      <>
                        <CheckCircle className="w-3 h-3" />
                        Terbit
                      </>
                    ) : (
                      <>
                        <Clock className="w-3 h-3" />
                        Moderasi
                      </>
                    )}
                  </span>
                </div>

                {/* Message */}
                <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed italic max-h-32 overflow-y-auto whitespace-pre-wrap">
                  "{review.message}"
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800/40 flex items-center justify-between gap-2">
                <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-semibold uppercase tracking-wider">
                  {formatDate(review.created_at)}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePublishToggle(review.id, review.is_published)}
                    disabled={loadingId === review.id}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
                      review.is_published
                        ? "bg-amber-500/5 border-amber-500/15 text-amber-600 hover:bg-amber-500/10"
                        : "bg-green-500/5 border-green-500/15 text-green-600 hover:bg-green-500/10"
                    }`}
                  >
                    {loadingId === review.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : review.is_published ? (
                      <>
                        <XSquare className="w-3.5 h-3.5" />
                        Tarik
                      </>
                    ) : (
                      <>
                        <CheckSquare className="w-3.5 h-3.5" />
                        Terbitkan
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(review.id)}
                    disabled={deletingId === review.id}
                    className="p-2 text-red-500 hover:text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-colors border border-transparent hover:border-red-200 dark:hover:border-red-900/30"
                    aria-label="Delete review"
                  >
                    {deletingId === review.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
