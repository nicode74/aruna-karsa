import React from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import AboutSection from "./components/AboutSection";
import ServicesSection from "./components/ServicesSection";
import PortfolioSection from "./components/PortfolioSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <Hero />

        {/* Brief About Section */}
        <AboutSection isDetailed={false} />

        {/* Brief Services Section */}
        <ServicesSection isDetailed={false} />

        {/* Brief Portfolio Section */}
        <PortfolioSection isDetailed={false} />

        {/* Contact Section */}
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}

