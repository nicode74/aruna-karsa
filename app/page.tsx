import React from "react";
import { getPageData, getServices, getProjects, getActiveProjects, getPublishedReviews } from "../lib/supabase/helpers";
import Header from "./components/Header";
import Hero from "./components/Hero";
import AboutSection from "./components/AboutSection";
import ServicesSection from "./components/ServicesSection";
import PortfolioSection from "./components/PortfolioSection";
import ActiveProjectsSection from "./components/ActiveProjectsSection";
import ReviewsSection from "./components/ReviewsSection";
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
  const activeProjects = await getActiveProjects();
  const reviews = await getPublishedReviews();

  const sections = page?.sections || [
    { id: "navigation", enabled: true },
    { id: "hero", enabled: true },
    { id: "about", enabled: true },
    { id: "services", enabled: true },
    { id: "active_projects", enabled: true },
    { id: "portfolio", enabled: true },
    { id: "reviews", enabled: true },
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
            case "active_projects":
              return (
                <ActiveProjectsSection
                  key={section.id}
                  title={section.title}
                  subtitle={section.subtitle}
                  projects={activeProjects}
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
            case "reviews":
              return (
                <ReviewsSection
                  key={section.id}
                  title={section.title}
                  subtitle={section.subtitle}
                  reviews={reviews}
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
