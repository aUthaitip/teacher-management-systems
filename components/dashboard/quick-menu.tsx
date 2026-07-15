import Link from "next/link";
import { ChevronRight, BookOpen, CalendarDays, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

export function QuickMenu({ t }: { t: (k: string) => string }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-black text-foreground tracking-tight">
        {t("quickMenu")}
      </h2>
      
      <div className="bg-card p-5 rounded-xl border shadow-sm space-y-4">
        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/40 transition-colors">
          <div className="p-2 bg-primary/10 text-primary rounded-lg">
            <BookOpen className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-foreground">{t("quickManageSubjects")}</h4>
            <p className="text-xs text-muted-foreground truncate">{t("quickManageSubjectsDesc")}</p>
          </div>
          <Link href="/subjects">
            <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/40 transition-colors">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <CalendarDays className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-foreground">{t("quickAttendance")}</h4>
            <p className="text-xs text-muted-foreground truncate">{t("quickAttendanceDesc")}</p>
          </div>
          <Link href="/subjects">
            <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/40 transition-colors">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
            <Award className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-foreground">{t("quickScores")}</h4>
            <p className="text-xs text-muted-foreground truncate">{t("quickScoresDesc")}</p>
          </div>
          <Link href="/subjects">
            <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
