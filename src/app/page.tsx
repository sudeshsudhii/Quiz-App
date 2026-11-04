import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import TwoModesSection from "@/components/landing/TwoModesSection";
import SlideTypesSection from "@/components/landing/SlideTypesSection";
import FAQSection from "@/components/landing/FAQSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col selection:bg-purple-500 selection:text-white">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TwoModesSection />
        <SlideTypesSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
