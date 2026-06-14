"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Sun, Moon, Menu, X } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Check initial theme from document class asynchronously to avoid hydration/render conflicts
    const timer = setTimeout(() => {
      const isDark = document.documentElement.classList.contains("dark");
      setTheme(isDark ? "dark" : "light");
    }, 0);

    // Handle scroll shadow
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
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

  const navLinks = [
    { name: "Beranda", href: "/" },
    { name: "Tentang Kami", href: "/about" },
    { name: "Layanan", href: "/services" },
    { name: "Portofolio", href: "/portfolio" },
    { name: "Blog", href: "/blog" },
    { name: "Kontak", href: "/contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "glass-panel shadow-md border-b border-zinc-200/40 dark:border-zinc-800/40 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center group">
          <Image
            src="/logo/logo-horizontal.png"
            alt="Aruna Karsa Logo"
            width={200}
            height={50}
            className="h-12 w-auto object-contain dark:brightness-200 dark:contrast-200 transition-transform duration-300 group-hover:scale-[1.02]"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium tracking-wide transition-colors duration-200 relative py-1 ${
                  isActive
                    ? "text-brand-amber-600 dark:text-brand-amber-500"
                    : "text-zinc-600 dark:text-zinc-300 hover:text-brand-amber-600 dark:hover:text-brand-amber-500"
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-amber-500 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Right Panel */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-300 transition-colors duration-200 shadow-sm"
            aria-label="Toggle Theme"
          >
            {theme === "light" ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4" />
            )}
          </button>
          <Link
            href="/services#rab-calculator"
            className="px-5 py-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-semibold tracking-wide shadow-md shadow-zinc-900/10 dark:shadow-white/5 hover:bg-brand-amber-600 dark:hover:bg-brand-amber-500 hover:text-white dark:hover:text-white transition-all duration-300 hover:-translate-y-0.5"
          >
            Kalkulator RAB
          </Link>
        </div>

        {/* Mobile menu button & Theme toggle */}
        <div className="flex md:hidden items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-300 shadow-sm"
            aria-label="Toggle Theme"
          >
            {theme === "light" ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-300 shadow-sm"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-x-0 top-[65px] bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 md:hidden transition-all duration-300 ease-in-out z-40 overflow-hidden ${
          isOpen ? "max-h-[380px] py-6 opacity-100" : "max-h-0 py-0 opacity-0"
        }`}
      >
        <div className="flex flex-col px-6 gap-4">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`text-base font-semibold py-2 border-b border-zinc-100 dark:border-zinc-900 ${
                  isActive
                    ? "text-brand-amber-600 dark:text-brand-amber-500"
                    : "text-zinc-600 dark:text-zinc-300 hover:text-brand-amber-600 dark:hover:text-brand-amber-500"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          <Link
            href="/services#rab-calculator"
            onClick={() => setIsOpen(false)}
            className="mt-2 w-full py-3 rounded-xl bg-brand-amber-500 text-white text-center font-bold tracking-wide shadow-lg shadow-brand-amber-500/20 hover:bg-brand-amber-600 transition-colors"
          >
            Estimasi Biaya (RAB)
          </Link>
        </div>
      </div>
    </header>
  );
}
