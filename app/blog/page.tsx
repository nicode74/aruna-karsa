import React from "react";
import { getPageData, getBlogPosts } from "../../lib/supabase/helpers";
import Header from "../components/Header";
import Hero from "../components/Hero";
import BlogSection from "../components/BlogSection";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";

export async function generateMetadata() {
  const { page } = await getPageData("blog");
  return {
    title: page?.title || "Blog & Wawasan Konstruksi | Aruna Karsa",
    description: page?.description || "Dapatkan inspirasi desain arsitektur terbaru, panduan menyusun RAB, dan tips teknik sipil dari Aruna Karsa.",
  };
}

export default async function BlogPage() {
  const { config, page } = await getPageData("blog");
  
  // Fetch dynamic blog posts
  const posts = await getBlogPosts(true); // onlyPublished = true

  const sections = page?.sections || [
    { id: "navigation", enabled: true },
    { id: "hero", enabled: true },
    { id: "blog", enabled: true },
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
            case "blog":
              return (
                <BlogSection
                  key={section.id}
                  isDetailed={true} // Detailed for blog listing page
                  title={section.title}
                  subtitle={section.subtitle}
                  posts={posts}
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
