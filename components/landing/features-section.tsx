import { CalendarRange, BarChart3, ShieldCheck } from "lucide-react";

export function FeaturesSection({ t }: { t: (key: string) => string }) {
  return (
    <div className="mt-24 grid grid-cols-1 gap-8 sm:grid-cols-3 max-w-5xl w-full text-left mx-auto relative z-10 px-6 pb-20">
      <div className="bg-primary border border-black/20 p-8 rounded-2xl">
        <CalendarRange className="h-8 w-8 text-black mb-4" />
        <h3 className="text-lg font-bold text-black mb-2">{t("feature1Title")}</h3>
        <p className="text-sm text-black/80 leading-relaxed">{t("feature1Desc")}</p>
      </div>
      <div className="bg-primary border border-black/20 p-8 rounded-2xl">
        <BarChart3 className="h-8 w-8 text-black mb-4" />
        <h3 className="text-lg font-bold text-black mb-2">{t("feature2Title")}</h3>
        <p className="text-sm text-black/80 leading-relaxed">{t("feature2Desc")}</p>
      </div>
      <div className="bg-primary border border-black/20 p-8 rounded-2xl">
        <ShieldCheck className="h-8 w-8 text-black mb-4" />
        <h3 className="text-lg font-bold text-black mb-2">{t("feature3Title")}</h3>
        <p className="text-sm text-black/80 leading-relaxed">{t("feature3Desc")}</p>
      </div>
    </div>
  );
}
