import React from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";

export const metadata = {
  title: "Hubungi Kami",
  description: "Hubungi tim pemasaran atau jadwalkan konsultasi arsitek langsung dengan Aruna Karsa.",
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="flex-grow">
        <Hero />
        
        {/* Contact form and details info */}
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
