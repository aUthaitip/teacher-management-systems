"use client";

import Link from "next/link";
import { GraduationCap, Globe, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/LanguageContext";

interface NavbarProps {
  showAuthLinks?: boolean;
}

export function Navbar({ showAuthLinks = false }: NavbarProps) {
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <header className="border-b border-black/20/80 backdrop-blur-md sticky top-0 z-50 bg-primary/60 relative">
      <div className="mx-auto max-w-7xl px-3 py-2 sm:px-6 sm:py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-90">
          <div className="bg-card p-1.5 sm:p-2 rounded-lg sm:rounded-xl text-black shadow-lg">
            <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <span className="text-sm sm:text-xl font-bold tracking-tight text-black">{t("appTitle")}</span>
        </Link>
        <div className="flex gap-1.5 sm:gap-3 items-center">
          {/* Language Switcher */}
          <Button
            variant="ghost"
            onClick={toggleLanguage}
            className="text-black hover:text-black font-bold gap-1 cursor-pointer h-8 px-2 text-xs sm:h-10 sm:px-4 sm:text-sm"
          >
            <Globe className="h-3.5 w-3.5" />
            <span>{language === "th" ? "EN" : "TH"}</span>
          </Button>

          {showAuthLinks ? (
            <>
              <Link href="/login">
                <Button variant="ghost" className="text-black hover:text-black font-bold h-8 px-2 text-xs sm:h-10 sm:px-4 sm:text-sm">
                  {t("login")}
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-card hover:bg-zinc-200 text-black font-bold h-8 px-2.5 text-xs sm:h-10 sm:px-4 sm:text-sm rounded-lg sm:rounded-xl transition-colors cursor-pointer">
                  {t("register")}
                </Button>
              </Link>
            </>
          ) : (
            <Link href="/">
              <Button variant="ghost" className="text-black hover:text-black font-bold flex items-center gap-1 h-8 px-2 text-xs sm:h-10 sm:px-4 sm:text-sm">
                <Home className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{language === "th" ? "หน้าแรก" : "Home"}</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
