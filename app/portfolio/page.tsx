import React from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import PortfolioSection from "../components/PortfolioSection";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";

export const metadata = {
  title: "Portofolio Proyek",
  description: "Lihat galeri proyek arsitektur, konstruksi rumah mewah, dan desain interior terbaik kami dari Aruna Karsa.",
};

export default function PortfolioPage() {
  return (
    <>
      <Header />
      <main className="flex-grow">
        <Hero />
        
        {/* Detailed Portfolio with filters */}
        <PortfolioSection isDetailed={true} />
        
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
