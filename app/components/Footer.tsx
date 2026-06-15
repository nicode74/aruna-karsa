"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Send, ArrowUpRight } from "lucide-react";

export default function Footer({ config }: { config?: any }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const logoUrl = config?.logo_url || "/logo/logo-horizontal.png";
  const siteName = config?.site_name || "Aruna Karsa";
  const contactAddress = config?.contact_address || "Jl. Raya Sunrise No. 45, Kebayoran Baru, Jakarta Selatan, 12130";
  const contactPhone = config?.contact_phone || "+62 812-3456-789";
  const contactEmail = config?.contact_email || "info@arunakarsa.co.id";
  const footerText = config?.footer_text || "Aruna Karsa adalah tekad untuk menghadirkan awal yang baru dalam setiap ruang yang dibangun, menjadikannya bukan sekadar bangunan, tetapi rumah bagi harapan dan kehidupan.";
  const socials = config?.social_links || { instagram: "https://instagram.com", facebook: "https://facebook.com", whatsapp: "https://wa.me/628123456789" };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("success");
    setEmail("");
    setTimeout(() => setStatus("idle"), 3000);
  };

  return (
    <footer className="bg-zinc-900 text-zinc-400 pt-20 pb-10 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        {/* Company Column */}
        <div className="space-y-6">
          <Link href="/" className="inline-block group">
            <Image
              src={logoUrl}
              alt={`${siteName} Logo`}
              width={200}
              height={50}
              className="h-12 w-auto object-contain brightness-200 contrast-200 opacity-90 transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </Link>
          <p className="text-sm leading-relaxed text-zinc-400">
            {footerText}
          </p>
          <div className="flex items-center gap-3">
            {socials.instagram && (
              <a
                href={socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-zinc-800 hover:bg-brand-amber-600 hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>
            )}
            {socials.facebook && (
              <a
                href={socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-zinc-800 hover:bg-brand-amber-600 hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
            )}
            {socials.whatsapp && (
              <a
                href={socials.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-zinc-800 hover:bg-brand-amber-600 hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm"
                aria-label="WhatsApp"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                </svg>
              </a>
            )}
          </div>
        </div>

        {/* Navigation Column */}
        <div className="space-y-6">
          <h4 className="font-display text-white font-semibold text-base uppercase tracking-wider">
            Tautan Cepat
          </h4>
          <ul className="space-y-3">
            {[
              { name: "Beranda", href: "/" },
              { name: "Tentang Kami", href: "/about" },
              { name: "Layanan", href: "/services" },
              { name: "Portofolio", href: "/portfolio" },
              { name: "Blog", href: "/blog" },
              { name: "Kontak", href: "/contact" },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-zinc-400 hover:text-brand-amber-500 hover:translate-x-1 flex items-center gap-1 transition-all duration-200"
                >
                  <ArrowUpRight className="w-3.5 h-3.5 text-zinc-600" />
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contacts Column */}
        <div className="space-y-6">
          <h4 className="font-display text-white font-semibold text-base uppercase tracking-wider">
            Kontak & Kantor
          </h4>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-brand-amber-500 shrink-0 mt-0.5" />
              <span>
                {contactAddress}
              </span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-brand-amber-500 shrink-0" />
              <a href={`tel:${contactPhone.replace(/[^+\d]/g, "")}`} className="hover:text-brand-amber-500">
                {contactPhone}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-brand-amber-500 shrink-0" />
              <a href={`mailto:${contactEmail}`} className="hover:text-brand-amber-500">
                {contactEmail}
              </a>
            </li>
          </ul>
        </div>

        {/* Newsletter Column */}
        <div className="space-y-6">
          <h4 className="font-display text-white font-semibold text-base uppercase tracking-wider">
            Berlangganan Newsletter
          </h4>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Dapatkan tips desain interior, arsitektur, dan tren pembangunan langsung di inbox Anda.
          </p>
          <form onSubmit={handleSubscribe} className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Alamat Email Anda"
              className="w-full bg-zinc-800 text-white placeholder-zinc-500 text-sm px-4 py-3 rounded-xl border border-zinc-700 focus:outline-none focus:border-brand-amber-500 transition-colors pr-12"
              required
            />
            <button
              type="submit"
              className="absolute right-1 top-1 bottom-1 px-3 bg-brand-amber-500 hover:bg-brand-amber-600 text-white rounded-lg transition-colors flex items-center justify-center"
              aria-label="Subscribe"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          {status === "success" && (
            <p className="text-xs text-green-500 font-medium">
              Terima kasih! Anda telah terdaftar dalam newsletter kami.
            </p>
          )}
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-6 border-t border-zinc-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <p>© {new Date().getFullYear()} Aruna Karsa (PT Aruna Karsa Nusantara). Seluruh hak cipta dilindungi.</p>
        <div className="flex gap-6">
          <Link href="/privacy" className="hover:text-white transition-colors">
            Kebijakan Privasi
          </Link>
          <Link href="/terms" className="hover:text-white transition-colors">
            Syarat & Ketentuan
          </Link>
        </div>
      </div>
    </footer>
  );
}
