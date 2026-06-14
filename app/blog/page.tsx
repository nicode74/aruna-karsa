import React from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import BlogSection from "../components/BlogSection";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";

export const metadata = {
  title: "Blog & Wawasan Konstruksi",
  description: "Dapatkan inspirasi desain arsitektur terbaru, panduan menyusun RAB, dan tips teknik sipil dari Aruna Karsa.",
};

export default function BlogPage() {
  return (
    <>
      <Header />
      <main className="flex-grow">
        <Hero />
        
        {/* Blog section in detailed mode with search filter */}
        <BlogSection isDetailed={true} />
        
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
