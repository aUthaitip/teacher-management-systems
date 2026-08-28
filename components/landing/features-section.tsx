import { CalendarRange, BarChart3, ShieldCheck } from "lucide-react";

export function FeaturesSection({ t }: { t: (key: string) => string }) {
  return (
    <div className="mt-24 grid grid-cols-1 gap-8 sm:grid-cols-3 max-w-5xl w-full text-left mx-auto relative z-10 px-6 pb-20">
      <div className="animate-fade-in-up animate-delay-[800ms] group bg-primary border border-black/20 p-8 rounded-2xl hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
        <div className="bg-card/50 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
          <CalendarRange className="h-7 w-7 text-black" />
        </div>
        <h3 className="text-lg font-bold text-black mb-3">{t("feature1Title")}</h3>
        <p className="text-sm text-black/80 leading-relaxed font-medium">{t("feature1Desc")}</p>
      </div>
      <div className="animate-fade-in-up animate-delay-[1000ms] group bg-primary border border-black/20 p-8 rounded-2xl hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
        <div className="bg-card/50 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
          <BarChart3 className="h-7 w-7 text-black" />
        </div>
        <h3 className="text-lg font-bold text-black mb-3">{t("feature2Title")}</h3>
        <p className="text-sm text-black/80 leading-relaxed font-medium">{t("feature2Desc")}</p>
      </div>
      <div className="animate-fade-in-up animate-delay-[1200ms] group bg-primary border border-black/20 p-8 rounded-2xl hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
        <div className="bg-card/50 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
          <ShieldCheck className="h-7 w-7 text-black" />
        </div>
        <h3 className="text-lg font-bold text-black mb-3">{t("feature3Title")}</h3>
        <p className="text-sm text-black/80 leading-relaxed font-medium">{t("feature3Desc")}</p>
      </div>
    </div>
  );
}
