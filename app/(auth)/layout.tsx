"use client";

import React from "react";
import Link from "next/link";
import { GraduationCap, Globe, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/LanguageContext";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden flex flex-col justify-between selection:bg-white selection:text-black">
      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-60"></div>
      
      {/* Subtle ambient light */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-zinc-800 rounded-full mix-blend-screen filter blur-3xl opacity-20 pointer-events-none"></div>

      {/* Unified Auth Header / Navbar */}
      <header className="border-b border-zinc-800/80 backdrop-blur-md sticky top-0 z-50 bg-black/60 relative">
        <div className="mx-auto max-w-7xl px-3 py-2 sm:px-6 sm:py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-90">
            <div className="bg-white p-1.5 sm:p-2 rounded-lg sm:rounded-xl text-black shadow-lg">
              <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <span className="text-sm sm:text-xl font-bold tracking-tight text-white">{t("appTitle")}</span>
          </Link>
          
          <div className="flex gap-1.5 sm:gap-3 items-center">
            {/* Language Switcher */}
            <Button
              variant="ghost"
              onClick={toggleLanguage}
              className="text-zinc-400 hover:text-white font-bold gap-1 cursor-pointer h-8 px-2 text-xs sm:h-10 sm:px-4 sm:text-sm"
            >
              <Globe className="h-3.5 w-3.5" />
              <span>{language === "th" ? "EN" : "TH"}</span>
            </Button>
            
            <Link href="/">
              <Button variant="ghost" className="text-zinc-400 hover:text-white font-bold flex items-center gap-1 h-8 px-2 text-xs sm:h-10 sm:px-4 sm:text-sm">
                <Home className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{language === "th" ? "หน้าแรก" : "Home"}</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Content Area */}
      <main className="flex-1 flex items-center justify-center p-6 relative z-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-6 text-center text-xs text-zinc-500 relative z-10 bg-black">
        <div className="mx-auto max-w-7xl px-6">
          &copy; 2026 Classroom Management System. All rights reserved.
        </div>
      </footer>
    </div>
  );
}