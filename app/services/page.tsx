import React from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import ServicesSection from "../components/ServicesSection";
import InteractiveRAB from "../components/InteractiveRAB";
import PortfolioSection from "../components/PortfolioSection";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";

export const metadata = {
  title: "Layanan & Kalkulator RAB",
  description: "Layanan arsitektur, konstruksi bangun baru, interior mewah, dan kalkulator RAB transparan Aruna Karsa.",
};

export default function ServicesPage() {
  return (
    <>
      <Header />
      <main className="flex-grow">
        <Hero />
        
        {/* Detailed services showing key bullet items */}
        <ServicesSection isDetailed={true} />
        
        {/* Custom Interactive RAB Estimator block */}
        <section className="py-20 bg-white dark:bg-zinc-950 transition-colors">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-brand-amber-600 dark:text-brand-amber-500">
                TRANSPARANSI BIAYA
              </h2>
              <p className="font-display font-extrabold text-3xl sm:text-4xl text-zinc-900 dark:text-white leading-tight">
                Hitung Perkiraan Biaya Bangun Rumah Anda
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
                Sesuaikan luas tanah, gaya desain, dan spesifikasi material untuk mendapatkan gambaran anggaran awal (RAB) tepercaya.
              </p>
            </div>
            <InteractiveRAB />
          </div>
        </section>

        {/* Portfolio & Contact */}
        <PortfolioSection isDetailed={false} />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
