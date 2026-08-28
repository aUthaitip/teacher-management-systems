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
      label: t("totalSubjects") || "Total Subjects",
      value: subjectsCount,
      icon: BookOpen,
      color: "bg-blue-500/10 text-blue-600 border-blue-200",
      accent: "bg-blue-600",
      description: t("subjectsTaught") || "Subjects you teach"
    },
    {
      label: t("totalClassrooms") || "Total Classrooms",
      value: classroomsCount,
      icon: GraduationCap,
      color: "bg-indigo-500/10 text-indigo-600 border-indigo-200",
      accent: "bg-indigo-600",
      description: t("classroomSub") || "Active classes"
    },
    {
      label: t("totalStudents") || "Total Students",
      value: studentsCount,
      icon: Users,
      color: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
      accent: "bg-emerald-500",
      description: t("studentsSub") || "Enrolled students"
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <Card key={i} className="group relative overflow-hidden bg-card border-border/50 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            {/* Top color accent bar */}
            <div className={`absolute top-0 left-0 w-full h-1.5 ${stat.accent}`} />
            
            <CardContent className="p-6 pt-7">
              <div className="flex items-center justify-between">
                <div className={`p-3.5 rounded-2xl border ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="h-6 w-6" />
                </div>
                <span className="text-4xl font-black text-foreground tracking-tight drop-shadow-sm">
                  {stat.value}
                </span>
              </div>
              <div className="mt-5">
                <h3 className="text-sm font-extrabold text-foreground uppercase tracking-wider">{stat.label}</h3>
                <p className="text-sm text-muted-foreground mt-1 font-medium">{stat.description}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
