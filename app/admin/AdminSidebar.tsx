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
} from "lucide-react";

interface AdminSidebarProps {
  userEmail: string;
}

export default function AdminSidebar({ userEmail }: AdminSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const pathname = usePathname();

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
    { name: "Layanan", href: "/admin/services", icon: Briefcase },
    { name: "Portofolio", href: "/admin/portfolio", icon: FolderKanban },
    { name: "Blog Posts", href: "/admin/blog", icon: FileText },
  ];

  return (
    <>
      {/* Mobile Top Bar */}
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

      {/* Sidebar Overlay for Mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Shell */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-white dark:bg-zinc-950 border-r border-zinc-200/50 dark:border-zinc-800/50 z-40 flex flex-col justify-between transition-all duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0 top-16 lg:top-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-6 space-y-8">
          {/* Logo (Desktop Only) */}
          <div className="hidden lg:block relative h-10 w-full mb-8">
            <Image
              src="/logo/logo-horizontal.png"
              alt="Aruna Karsa Logo"
              fill
              className="object-contain dark:brightness-200 dark:contrast-200"
            />
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold tracking-wide transition-all border-l-2 ${
                    isActive
                      ? "bg-brand-amber-500/10 dark:bg-brand-amber-500/10 border-brand-amber-500 text-brand-amber-600 dark:text-brand-amber-400"
                      : "border-transparent text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* View Site Link */}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold tracking-wide text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all border-l-2 border-transparent"
          >
            <ExternalLink className="w-4 h-4 shrink-0" />
            Lihat Website
          </a>
        </div>

        {/* Footer Panel */}
        <div className="p-6 border-t border-zinc-200/50 dark:border-zinc-800/50 space-y-4">
          <div className="flex items-center justify-between">
            <div className="truncate pr-2">
              <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">Logged in as</p>
              <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate" title={userEmail}>
                {userEmail}
              </p>
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900"
              aria-label="Toggle Theme"
            >
              {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
          </div>

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
