import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Users, GraduationCap } from "lucide-react";

interface DashboardStatsProps {
  subjectsCount: number;
  classroomsCount: number;
  studentsCount: number;
  t: (k: string) => string;
}

export function DashboardStats({ subjectsCount, classroomsCount, studentsCount, t }: DashboardStatsProps) {
  const stats = [
    {
      label: t("totalSubjects"),
      value: subjectsCount,
      icon: BookOpen,
      color: "bg-primary/10 text-primary border-primary/20",
      description: t("subjectsTaught")
    },
    {
      label: t("totalClassrooms"),
      value: classroomsCount,
      icon: GraduationCap,
      color: "bg-indigo-500/10 text-indigo-600 border-indigo-100",
      description: t("classroomSub")
    },
    {
      label: t("totalStudents"),
      value: studentsCount,
      icon: Users,
      color: "bg-emerald-500/10 text-emerald-600 border-emerald-100",
      description: t("studentsSub")
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <Card key={i} className="bg-card border shadow-sm hover:shadow transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-xl border ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <span className="text-3xl font-black text-foreground tracking-tight">
                  {stat.value}
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-sm font-bold text-foreground">{stat.label}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.description}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
