import React from "react";
import { getPageData } from "../../lib/supabase/helpers";
import Header from "../components/Header";
import Hero from "../components/Hero";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";

export async function generateMetadata() {
  const { page } = await getPageData("contact");
  return {
    title: page?.title || "Hubungi Kami | Aruna Karsa",
    description: page?.description || "Hubungi tim pemasaran atau jadwalkan konsultasi arsitek langsung dengan Aruna Karsa.",
  };
}

export default async function ContactPage() {
  const { config, page } = await getPageData("contact");

  const sections = page?.sections || [
    { id: "hero", enabled: true },
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
