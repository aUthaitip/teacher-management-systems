import { Teacher } from "@/lib/AppContext";

export function WelcomeBanner({ teacher, t }: { teacher: Teacher | null, t: (k: string) => string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-card p-8 border shadow-sm">
      <div className="relative z-10 max-w-2xl">
        <span className="rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
          {t("welcomeBack")}
        </span>
        <h1 className="mt-4 text-3xl md:text-4xl font-black tracking-tight text-foreground">
          {t("hello")}, {teacher?.name || t("myProfile")}
        </h1>
        <p className="mt-2 text-muted-foreground font-medium">
          {t("bannerDesc")}
        </p>
      </div>
    </div>
  );
}
