import { Teacher } from "@/lib/AppContext";
import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

export function WelcomeBanner({ teacher, t }: { teacher: Teacher | null, t: (k: string) => string }) {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("สวัสดีตอนเช้า");
    else if (hour < 18) setGreeting("สวัสดีตอนบ่าย");
    else setGreeting("สวัสดีตอนเย็น");
  }, []);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-primary  p-8 border-none shadow-lg text-white">
      {/* Decorative shapes */}
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
      
      <div className="relative z-10 max-w-2xl flex flex-col items-start">
        <div className="flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-md px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm border border-white/20">
          <Sparkles className="h-4 w-4" />
          <span>{t("welcomeBack") || "Welcome Back"}</span>
        </div>
        <h1 className="mt-5 text-4xl md:text-5xl font-black tracking-tight drop-shadow-md">
          {greeting}, {teacher?.name || t("myProfile")}
        </h1>
        <p className="mt-3 text-white/90 font-medium text-lg max-w-xl leading-relaxed">
          {t("bannerDesc") || "Ready to manage your classrooms and students today?"}
        </p>
      </div>
    </div>
  );
}
