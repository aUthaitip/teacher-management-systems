"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-primary text-black relative overflow-hidden flex flex-col justify-between selection:bg-card selection:text-black">
      {/* Subtle grid pattern overlay for a high-end designer look */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-60"></div>
      
      {/* Subtle monochrome ambient lights */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/80 rounded-full mix-blend-screen filter blur-3xl opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-primary/80/50 rounded-full mix-blend-screen filter blur-3xl opacity-20 pointer-events-none"></div>

      <Navbar showAuthLinks={true} />
      
      <div className="flex-1 flex flex-col justify-center">
        <HeroSection t={t} />
        <FeaturesSection t={t} />
      </div>

      <Footer />
    </main>
  );
}
