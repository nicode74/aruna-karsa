import React from "react";
import { getPageData, getProjects } from "../../lib/supabase/helpers";
import Header from "../components/Header";
import Hero from "../components/Hero";
import PortfolioSection from "../components/PortfolioSection";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";

export async function generateMetadata() {
  const { page } = await getPageData("portfolio");
  return {
    title: page?.title || "Portofolio Proyek | Aruna Karsa",
    description: page?.description || "Lihat galeri proyek arsitektur, konstruksi rumah mewah, dan desain interior terbaik kami dari Aruna Karsa.",
  };
}

export default async function PortfolioPage() {
  const { config, page } = await getPageData("portfolio");
  
  // Fetch dynamic collections
  const projects = await getProjects();

  const sections = page?.sections || [
    { id: "navigation", enabled: true },
    { id: "hero", enabled: true },
    { id: "portfolio", enabled: true },
    { id: "contact", enabled: true },
    { id: "footer", enabled: true }
  ];

  const showHeader = sections.find((s: any) => s.id === "navigation")?.enabled !== false;
  const showFooter = sections.find((s: any) => s.id === "footer")?.enabled !== false;

  return (
    <>
      {showHeader && <Header config={config} />}
      <main className="flex-grow">
        {sections.map((section: any) => {
          if (!section.enabled) return null;
          if (section.id === "navigation" || section.id === "footer") return null;

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
            case "portfolio":
              return (
                <PortfolioSection
                  key={section.id}
                  isDetailed={true} // Detailed for portfolio page
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
                  title={section.title}
                  subtitle={section.subtitle}
                />
              );
            default:
              return null;
          }
        })}
      </main>
      {showFooter && <Footer config={config} />}
    </>
  );
}
