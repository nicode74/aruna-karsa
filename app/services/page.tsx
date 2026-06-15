import React from "react";
import { getPageData, getServices, getProjects } from "../../lib/supabase/helpers";
import Header from "../components/Header";
import Hero from "../components/Hero";
import ServicesSection from "../components/ServicesSection";
import InteractiveRAB from "../components/InteractiveRAB";
import PortfolioSection from "../components/PortfolioSection";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";

export async function generateMetadata() {
  const { page } = await getPageData("services");
  return {
    title: page?.title || "Layanan & Kalkulator RAB | Aruna Karsa",
    description: page?.description || "Layanan arsitektur, konstruksi bangun baru, interior mewah, dan kalkulator RAB transparan Aruna Karsa.",
  };
}

export default async function ServicesPage() {
  const { config, page } = await getPageData("services");
  
  // Fetch dynamic collections
  const services = await getServices();
  const projects = await getProjects();

  const sections = page?.sections || [
    { id: "hero", enabled: true },
    { id: "services", enabled: true },
    { id: "portfolio", enabled: true },
    { id: "contact", enabled: true }
  ];

  return (
    <>
      <Header config={config} />
      <main className="flex-grow">
        {sections.map((section: any) => {
          if (!section.enabled) return null;

          switch (section.id) {
            case "hero":
              return (
                <Hero
                  key={section.id}
                  title={section.title}
                  subtitle={section.subtitle}
                  ctaText={section.ctaText}
                  ctaHref={section.ctaHref}
                  bgImage={section.bgImage}
                />
              );
            case "services":
              return (
                <React.Fragment key={section.id}>
                  <ServicesSection
                    isDetailed={true} // Detailed for services page
                    title={section.title}
                    subtitle={section.subtitle}
                    services={services}
                  />
                  {/* RAB Calculator block */}
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
                </React.Fragment>
              );
            case "portfolio":
              return (
                <PortfolioSection
                  key={section.id}
                  isDetailed={false}
                  title={section.title}
                  subtitle={section.subtitle}
                  projects={projects}
                />
              );
            case "contact":
              return (
                <ContactSection
                  key={section.id}
                  config={config}
                />
              );
            default:
              return null;
          }
        })}
      </main>
      <Footer config={config} />
    </>
  );
}
