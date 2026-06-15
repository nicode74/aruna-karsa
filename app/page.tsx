import React from "react";
import { getPageData, getServices, getProjects } from "../lib/supabase/helpers";
import Header from "./components/Header";
import Hero from "./components/Hero";
import AboutSection from "./components/AboutSection";
import ServicesSection from "./components/ServicesSection";
import PortfolioSection from "./components/PortfolioSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";

export async function generateMetadata() {
  const { page } = await getPageData("home");
  return {
    title: page?.title || "Beranda | Aruna Karsa",
    description: page?.description || "Aruna Karsa adalah penyedia layanan desain arsitektur, perencanaan anggaran biaya (RAB) transparan, dan kontraktor konstruksi tepercaya.",
  };
}

export default async function Home() {
  const { config, page } = await getPageData("home");
  
  // Fetch dynamic collections
  const services = await getServices();
  const projects = await getProjects();

  const sections = page?.sections || [
    { id: "hero", enabled: true },
    { id: "about", enabled: true },
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
            case "about":
              return (
                <AboutSection
                  key={section.id}
                  isDetailed={false}
                  title={section.title}
                  subtitle={section.subtitle}
                />
              );
            case "services":
              return (
                <ServicesSection
                  key={section.id}
                  isDetailed={false}
                  title={section.title}
                  subtitle={section.subtitle}
                  services={services}
                />
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
