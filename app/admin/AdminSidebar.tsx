"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { logout } from "../actions/authActions";
import {
  LayoutDashboard,
  Briefcase,
  FolderKanban,
  FileText,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  Compass,
  ExternalLink,
  Mail,
  FileSpreadsheet,
  Wrench,
  Star,
  ListTodo,
  Tag,
} from "lucide-react";

interface AdminSidebarProps {
  userEmail: string;
}

export default function AdminSidebar({ userEmail }: AdminSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const pathname = usePathname();

  // Sync component state with the current class on <html> (set by blocking script in layout)
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    if (theme === "light") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setTheme("dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setTheme("light");
    }
  };

  const menuItems = [
    { name: "Pengaturan Utama", href: "/admin", icon: LayoutDashboard },
    { name: "Halaman & Seksi", href: "/admin/pages", icon: Compass },
    { name: "Daftar Harga", href: "/admin/pricelist", icon: Tag },
    { name: "Proyek Aktif", href: "/admin/active-projects", icon: Wrench },
    { name: "Invoice Tools", href: "/admin/invoices", icon: FileSpreadsheet },
    { name: "Layanan", href: "/admin/services", icon: Briefcase },
    { name: "Portofolio", href: "/admin/portfolio", icon: FolderKanban },
    { name: "Blog Posts", href: "/admin/blog", icon: FileText },
    { name: "Pesan Masuk", href: "/admin/contacts", icon: Mail },
    { name: "Kelola Ulasan", href: "/admin/reviews", icon: Star },
    { name: "Tugas & Timeline", href: "/admin/tasks", icon: ListTodo },
  ];


  // Derive initials from email for the avatar
  const initials = userEmail
    .split("@")[0]
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      {/* ── Mobile Top Bar ─────────────────────────────────── */}
      <header className="lg:hidden h-16 bg-white dark:bg-zinc-900 border-b border-zinc-200/50 dark:border-zinc-800/50 px-6 flex items-center justify-between sticky top-0 z-30 transition-colors">
        <div className="relative h-8 w-32">
          <Image
            src="/logo/logo-horizontal.png"
            alt="Aruna Karsa Logo"
            fill
            className="object-contain dark:brightness-200 dark:contrast-200"
          />
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300"
          aria-label="Toggle Navigation"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* ── Mobile Sidebar Overlay ──────────────────────────── */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ── Sidebar Shell ──────────────────────────────────── */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-white dark:bg-zinc-950 border-r border-zinc-200/50 dark:border-zinc-800/50 z-40 flex flex-col transition-all duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0 top-16 lg:top-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="hidden lg:flex items-center px-6 h-20 border-b border-zinc-100 dark:border-zinc-800/50 shrink-0">
          <div className="relative h-9 w-36">
            <Image
              src="/logo/logo-horizontal.png"
              alt="Aruna Karsa Logo"
              fill
              className="object-contain dark:brightness-200 dark:contrast-200"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <p className="px-4 pb-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-600">
            Menu
          </p>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold tracking-wide transition-all ${
                  isActive
                    ? "bg-brand-amber-500/10 dark:bg-brand-amber-500/10 text-brand-amber-600 dark:text-brand-amber-400"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                <span
                  className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    isActive
                      ? "bg-brand-amber-500/15"
                      : "bg-zinc-100 dark:bg-zinc-800/60 group-hover:bg-zinc-200"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </span>
                {item.name}
              </Link>
            );
          })}

          {/* Divider */}
          <div className="pt-4 pb-2">
            <div className="border-t border-zinc-100 dark:border-zinc-800/50" />
          </div>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold tracking-wide text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
          >
            <span className="shrink-0 w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800/60 flex items-center justify-center">
              <ExternalLink className="w-4 h-4" />
            </span>
            Lihat Website
          </a>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-200/50 dark:border-zinc-800/50 space-y-3 shrink-0">
          {/* User info row */}
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-xl bg-brand-amber-500/15 flex items-center justify-center shrink-0">
              <span className="text-xs font-extrabold text-brand-amber-600 dark:text-brand-amber-400">{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">Logged in as</p>
              <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate" title={userEmail}>
                {userEmail}
              </p>
            </div>
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="shrink-0 w-9 h-9 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
          </div>

          {/* Logout */}
          <button
            onClick={() => logout()}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-red-200/60 dark:border-red-950/40 bg-red-500/5 hover:bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-wider transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Keluar Sesi
          </button>
        </div>
      </aside>
    </>
  );
}
