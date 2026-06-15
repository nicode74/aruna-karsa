"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Calendar, Clock, ArrowRight, User } from "lucide-react";

import { blogPosts as defaultBlogPosts } from "../blog/posts";

export interface Post {
  slug: string;
  title: string;
  category: string;
  date: string;
  readTime?: string;
  read_time?: string;
  excerpt: string;
  image?: string;
  image_url?: string;
  author: string;
}

interface BlogSectionProps {
  isDetailed?: boolean;
  title?: string;
  subtitle?: string;
  posts?: Post[];
}

export default function BlogSection({
  isDetailed = false,
  title,
  subtitle,
  posts: propPosts
}: BlogSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const posts = ((propPosts || defaultBlogPosts) as any[]).map((post) => ({
    ...post,
    image: post.image_url || post.image || "/images/construction_site.png",
    readTime: post.read_time || post.readTime || "5 Menit Baca"
  }));

  const categories = ["all", "Tips Budget", "Konstruksi", "Arsitektur"];

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const displayPosts = isDetailed ? filteredPosts : posts.slice(0, 3);
  const sectionTitle = title || "BLOG & ARTIKEL";
  const sectionSubtitle = subtitle || "Inspirasi Desain & Wawasan Konstruksi";

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
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-bold text-brand-amber-600 dark:text-brand-amber-500 hover:text-brand-amber-700 dark:hover:text-brand-amber-400 transition-colors duration-200 group shrink-0"
            >
              Lihat Semua Artikel
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>

        {/* Search and Category Filters (Only in detailed view) */}
        {isDetailed && (
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 pb-6 border-b border-zinc-100 dark:border-zinc-900">
            {/* Categories */}
            <div className="flex flex-wrap gap-2 order-2 md:order-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-200 border ${
                    selectedCategory === cat
                      ? "bg-brand-amber-500 border-brand-amber-500 text-white shadow-md shadow-brand-amber-500/25"
                      : "bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700"
                  }`}
                >
                  {cat === "all" ? "Semua Kategori" : cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:max-w-xs order-1 md:order-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari artikel..."
                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 pl-10 pr-4 py-2.5 rounded-xl text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-brand-amber-500 transition-colors"
              />
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        )}

        {/* Blog Grid */}
        {displayPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayPosts.map((post) => (
              <article
                key={post.slug}
                className="group flex flex-col justify-between rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 overflow-hidden shadow-sm hover:shadow-xl hover:border-brand-amber-500/30 transition-all duration-300"
              >
                <div className="space-y-6">
                  {/* Image Frame */}
                  <div className="relative aspect-video w-full overflow-hidden bg-zinc-200 dark:bg-zinc-800">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-w-768px) 100vw, 30vw"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1.5 rounded-xl bg-zinc-900/75 border border-white/10 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Content Info */}
                  <div className="px-6 space-y-3">
                    <div className="flex items-center gap-4 text-xs text-zinc-400 dark:text-zinc-500 font-semibold uppercase">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{post.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>

                    <Link href={`/blog/${post.slug}`} className="block">
                      <h3 className="font-display font-bold text-xl text-zinc-900 dark:text-white group-hover:text-brand-amber-600 dark:group-hover:text-brand-amber-500 transition-colors leading-tight">
                        {post.title}
                      </h3>
                    </Link>

                    <p className="text-sm text-zinc-500 dark:text-zinc-400 font-normal line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                {/* Footer details */}
                <div className="p-6 mt-6 border-t border-zinc-100 dark:border-zinc-900 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400 font-semibold">
                    <User className="w-4 h-4 text-zinc-400" />
                    <span>{post.author}</span>
                  </div>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-amber-600 dark:text-brand-amber-500 group-hover:underline"
                  >
                    Selengkapnya
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-zinc-400 dark:text-zinc-600">
            Tidak ada artikel yang cocok dengan pencarian Anda.
          </div>
        )}
      </div>
    </section>
  );
}
