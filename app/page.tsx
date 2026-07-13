"use client";

import Link from "next/link";
import { ArrowRight, GraduationCap, CalendarRange, BarChart3, ShieldCheck, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/LanguageContext";

export default function HomePage() {
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden flex flex-col justify-between selection:bg-white selection:text-black">
      {/* Subtle grid pattern overlay for a high-end designer look */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-60"></div>
      
      {/* Subtle monochrome ambient lights */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-zinc-800 rounded-full mix-blend-screen filter blur-3xl opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-zinc-800/50 rounded-full mix-blend-screen filter blur-3xl opacity-20 pointer-events-none"></div>

      {/* Navbar */}
      <header className="border-b border-zinc-800/80 backdrop-blur-md sticky top-0 z-50 bg-black/60 relative">
        <div className="mx-auto max-w-7xl px-3 py-2 sm:px-6 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="bg-white p-1.5 sm:p-2 rounded-lg sm:rounded-xl text-black shadow-lg">
              <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <span className="text-sm sm:text-xl font-bold tracking-tight text-white">{t("appTitle")}</span>
          </div>
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
            
            <Link href="/login">
              <Button variant="ghost" className="text-zinc-400 hover:text-white font-bold h-8 px-2 text-xs sm:h-10 sm:px-4 sm:text-sm">
                {t("login")}
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-white hover:bg-zinc-200 text-black font-bold h-8 px-2.5 text-xs sm:h-10 sm:px-4 sm:text-sm rounded-lg sm:rounded-xl transition-colors cursor-pointer">
                {t("register")}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-28 text-center flex-1 flex flex-col items-center justify-center relative z-10">
        <span className="rounded-full bg-zinc-900 border border-zinc-800 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-400">
          {t("heroSubtitle")}
        </span>

        <h1 className="mt-8 max-w-4xl text-4xl font-extrabold tracking-tight text-white md:text-7xl leading-tight">
          {t("heroTitle1")} <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-500">
            {t("heroTitle2")}
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-sm text-zinc-400 sm:text-base leading-relaxed">
          {t("heroDesc")}
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row justify-center w-full max-w-xs sm:max-w-none">
          <Link href="/register" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto bg-white hover:bg-zinc-200 text-black font-bold py-6 px-8 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-lg">
              {t("getStarted")}
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>

          <Link href="/login" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full sm:w-auto border-zinc-800 text-zinc-300 hover:bg-zinc-900 hover:text-white py-6 px-8 rounded-xl font-bold transition-all">
              {t("signInTeacher")}
            </Button>
          </Link>
        </div>

        {/* Feature Highlights */}
        <div className="mt-24 grid grid-cols-1 gap-8 sm:grid-cols-3 max-w-5xl w-full text-left">
          <div className="bg-zinc-950/60 border border-zinc-900 p-8 rounded-2xl">
            <CalendarRange className="h-8 w-8 text-white mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">{t("feature1Title")}</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">{t("feature1Desc")}</p>
          </div>
          <div className="bg-zinc-950/60 border border-zinc-900 p-8 rounded-2xl">
            <BarChart3 className="h-8 w-8 text-white mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">{t("feature2Title")}</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">{t("feature2Desc")}</p>
          </div>
          <div className="bg-zinc-950/60 border border-zinc-900 p-8 rounded-2xl">
            <ShieldCheck className="h-8 w-8 text-white mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">{t("feature3Title")}</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">{t("feature3Desc")}</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-6 text-center text-xs text-zinc-500 bg-black relative z-10">
        <div className="mx-auto max-w-7xl px-6">
          &copy; 2026 Classroom Management System. All rights reserved.
        </div>
      </footer>
    </main>
  );
}