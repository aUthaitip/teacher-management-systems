import Link from "next/link";
import { ChevronRight, BookOpen, CalendarDays, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

export function QuickMenu({ t }: { t: (k: string) => string }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-black text-foreground tracking-tight">
        {t("quickMenu") || "Quick Menu"}
      </h2>
      
      <div className="bg-card p-4 rounded-2xl border border-border/50 shadow-sm space-y-3">
        <div className="group relative flex items-center gap-4 p-3.5 rounded-xl hover:bg-muted/50 transition-all duration-300 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative p-2.5 bg-primary/10 text-primary rounded-xl group-hover:scale-110 transition-transform duration-300">
            <BookOpen className="h-5 w-5" />
          </div>
          <div className="relative flex-1 min-w-0">
            <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{t("quickManageSubjects") || "Manage Subjects"}</h4>
            <p className="text-xs text-muted-foreground truncate">{t("quickManageSubjectsDesc") || "Add, edit or delete subjects"}</p>
          </div>
          <Link href="/subjects" className="relative">
            <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>

        <div className="group relative flex items-center gap-4 p-3.5 rounded-xl hover:bg-muted/50 transition-all duration-300 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative p-2.5 bg-indigo-50 text-indigo-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
            <CalendarDays className="h-5 w-5" />
          </div>
          <div className="relative flex-1 min-w-0">
            <h4 className="text-sm font-bold text-foreground group-hover:text-indigo-600 transition-colors">{t("quickAttendance") || "Check Attendance"}</h4>
            <p className="text-xs text-muted-foreground truncate">{t("quickAttendanceDesc") || "Record daily presence"}</p>
          </div>
          <Link href="/subjects" className="relative">
            <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground group-hover:text-indigo-600 group-hover:translate-x-1 transition-all">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>

        <div className="group relative flex items-center gap-4 p-3.5 rounded-xl hover:bg-muted/50 transition-all duration-300 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative p-2.5 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
            <Award className="h-5 w-5" />
          </div>
          <div className="relative flex-1 min-w-0">
            <h4 className="text-sm font-bold text-foreground group-hover:text-emerald-600 transition-colors">{t("quickScores") || "Manage Scores"}</h4>
            <p className="text-xs text-muted-foreground truncate">{t("quickScoresDesc") || "Record grades and results"}</p>
          </div>
          <Link href="/subjects" className="relative">
            <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground group-hover:text-emerald-600 group-hover:translate-x-1 transition-all">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
