import React from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import AboutSection from "../components/AboutSection";
import ServicesSection from "../components/ServicesSection";
import PortfolioSection from "../components/PortfolioSection";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";

export const metadata = {
  title: "Tentang Kami",
  description: "Pelajari visi, misi, dan nilai-nilai fundamental Aruna Karsa dalam menghadirkan desain arsitektur berkualitas dan transparan.",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="flex-grow">
        <Hero />
        
        {/* Detailed version of About Section */}
        <AboutSection isDetailed={true} />
        
        {/* Services & Portfolio previews */}
        <ServicesSection isDetailed={false} />
        <PortfolioSection isDetailed={false} />
        
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
