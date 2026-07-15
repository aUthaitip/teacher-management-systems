import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection({ t }: { t: (key: string) => string }) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 md:py-28 text-center flex-1 flex flex-col items-center justify-center relative z-10">
      <span className="rounded-full bg-primary border border-black/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-black/80">
        {t("heroSubtitle")}
      </span>

      <h1 className="mt-8 max-w-4xl text-4xl font-extrabold tracking-tight text-black md:text-7xl leading-tight">
        {t("heroTitle1")} <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-black via-black/80 to-black/60">
          {t("heroTitle2")}
        </span>
      </h1>

      <p className="mt-6 max-w-2xl text-sm text-black/80 sm:text-base leading-relaxed">
        {t("heroDesc")}
      </p>

      <div className="mt-10 flex flex-col gap-4 sm:flex-row justify-center w-full max-w-xs sm:max-w-none">
        <Link href="/register" className="w-full sm:w-auto">
          <Button size="lg" className="w-full sm:w-auto bg-card hover:bg-primary/90 text-black font-bold py-6 px-8 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-lg">
            {t("getStarted")}
            <ArrowRight className="h-5 w-5" />
          </Button>
        </Link>

        <Link href="/login" className="w-full sm:w-auto">
          <Button variant="outline" size="lg" className="w-full sm:w-auto border-black/20 text-black/80 hover:bg-primary/90 hover:text-black py-6 px-8 rounded-xl font-bold transition-all">
            {t("signInTeacher")}
          </Button>
        </Link>
      </div>
    </section>
  );
}
