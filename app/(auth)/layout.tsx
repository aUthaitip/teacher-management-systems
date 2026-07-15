"use client";

import React from "react";
import Link from "next/link";
import { GraduationCap, Globe, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/LanguageContext";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <div className="min-h-screen bg-primary text-primary-foreground relative overflow-hidden flex flex-col justify-between selection:bg-card selection:text-black">
      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-60"></div>
      
      {/* Subtle ambient light */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/80 rounded-full mix-blend-screen filter blur-3xl opacity-20 pointer-events-none"></div>

      {/* Unified Auth Header / Navbar */}
      <Navbar showAuthLinks={false} />

      {/* Content Area */}
      <main className="flex-1 flex items-center justify-center p-6 relative z-10">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}