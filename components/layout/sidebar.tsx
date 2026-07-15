"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/lib/AppContext";
import { useLanguage } from "@/lib/LanguageContext";
import { 
  LayoutDashboard, 
  BookOpen, 
  User, 
  LogOut, 
  GraduationCap,
  School,
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentTeacher, logoutTeacher, isLoaded } = useApp();
  const { language, toggleLanguage, t } = useLanguage();

  const handleLogout = () => {
    logoutTeacher();
    router.push("/login");
  };

  const navItems = [
    {
      label: t("dashboard"),
      href: "/dashboard",
      icon: LayoutDashboard
    },
    {
      label: t("subjectsAndClasses"),
      href: "/subjects",
      icon: BookOpen
    },
    {
      label: t("myProfile"),
      href: "/profile",
      icon: User
    }
  ];

  if (!isLoaded) return null;

  return (
    <aside className="w-64 min-h-screen bg-card text-foreground border-r flex flex-col justify-between p-5">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-8 px-2 py-1">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-xl text-primary-foreground">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-base font-black tracking-tight leading-none text-foreground">Classroom</h1>
              <span className="text-[10px] text-muted-foreground">{t("systemSubtitle")}</span>
            </div>
          </div>

          {/* Language Switcher Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleLanguage}
            className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer flex items-center justify-center font-bold text-xs"
            title="Switch Language / เปลี่ยนภาษา"
          >
            <Globe className="h-4 w-4 mr-0.5" />
            {language === "th" ? "EN" : "TH"}
          </Button>
        </div>

        {/* Current Teacher Summary */}
        {currentTeacher && (
          <div className="bg-muted/50 border p-4 rounded-xl mb-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold overflow-hidden">
                {currentTeacher.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={currentTeacher.avatar} alt="avatar" className="h-full w-full object-cover" />
                ) : (
                  currentTeacher.name.charAt(0)
                )}
              </div>
              <div className="overflow-hidden">
                <h4 className="text-sm font-bold text-foreground truncate">{currentTeacher.name}</h4>
                <p className="text-[11px] text-muted-foreground truncate flex items-center gap-1 mt-0.5">
                  <School className="h-3 w-3 shrink-0" />
                  {currentTeacher.school}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Nav Links */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? "bg-primary text-primary-foreground shadow font-semibold" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? "text-primary-foreground" : "text-muted-foreground"}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200 cursor-pointer"
      >
        <LogOut className="h-5 w-5" />
        {t("logout")}
      </button>
    </aside>
  );
}