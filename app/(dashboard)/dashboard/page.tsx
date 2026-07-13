"use client";

import { useApp } from "@/lib/AppContext";
import { useLanguage } from "@/lib/LanguageContext";
import Link from "next/link";
import { BookOpen, Users, GraduationCap, ChevronRight, Award, CalendarDays } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { currentTeacher, teachers, subjects, classrooms, students, isLoaded } = useApp();
  const { t } = useLanguage();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Filter items owned/taught by the current teacher
  const teacherSubjects = subjects.filter(s => currentTeacher && s.teacherIds.includes(currentTeacher.id));
  const teacherSubjIds = teacherSubjects.map(s => s.id);
  const teacherClassrooms = classrooms.filter(c => teacherSubjIds.includes(c.subjectId));
  const teacherClassroomIds = teacherClassrooms.map(c => c.id);
  const teacherStudents = students.filter(s => teacherClassroomIds.includes(s.classroomId));

  const stats = [
    {
      label: t("totalSubjects"),
      value: teacherSubjects.length,
      icon: BookOpen,
      color: "bg-primary/10 text-primary border-primary/20",
      description: t("subjectsTaught")
    },
    {
      label: t("totalClassrooms"),
      value: teacherClassrooms.length,
      icon: GraduationCap,
      color: "bg-indigo-500/10 text-indigo-600 border-indigo-100",
      description: t("classroomSub")
    },
    {
      label: t("totalStudents"),
      value: teacherStudents.length,
      icon: Users,
      color: "bg-emerald-500/10 text-emerald-600 border-emerald-100",
      description: t("studentsSub")
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner - Modern clean light background card */}
      <div className="relative overflow-hidden rounded-2xl bg-white p-8 border shadow-sm">
        <div className="relative z-10 max-w-2xl">
          <span className="rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            {t("welcomeBack")}
          </span>
          <h1 className="mt-4 text-3xl md:text-4xl font-black tracking-tight text-foreground">
            {t("hello")}, {currentTeacher?.name || t("myProfile")}
          </h1>
          <p className="mt-2 text-muted-foreground font-medium">
            {t("bannerDesc")}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} className="bg-white border shadow-sm hover:shadow transition-all">
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

      {/* Grid: Subjects list and Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Taught Subjects List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-foreground tracking-tight">
              {t("mySubjectsTitle")}
            </h2>
            <Link href="/subjects">
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 font-bold gap-1">
                {t("viewAll") ?? "View All"}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {teacherSubjects.length === 0 ? (
              <Card className="border border-dashed p-8 text-center text-muted-foreground bg-white">
                <BookOpen className="h-10 w-10 mx-auto mb-2 text-muted/60" />
                <p className="text-sm font-semibold">{t("noSubjects")}</p>
                <Link href="/subjects" className="mt-3 inline-block">
                  <Button size="sm" className="font-bold">
                    {t("addFirstSubject")}
                  </Button>
                </Link>
              </Card>
            ) : (
              teacherSubjects.map((subject) => {
                const subjClassrooms = classrooms.filter(c => c.subjectId === subject.id);
                return (
                  <Card key={subject.id} className="bg-white border shadow-sm hover:shadow transition-all">
                    <CardHeader className="p-5 pb-2 flex flex-row items-start justify-between space-y-0">
                      <div>
                        <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded uppercase tracking-wider">
                          {subject.code}
                        </span>
                        <CardTitle className="text-lg font-bold text-foreground mt-2">
                          {subject.name}
                        </CardTitle>
                      </div>
                      <Link href={`/subjects`}>
                        <Button variant="outline" size="sm" className="font-bold text-xs">
                          {t("viewDetails")}
                        </Button>
                      </Link>
                    </CardHeader>
                    <CardContent className="p-5 pt-0">
                      <div className="mt-2 text-sm text-muted-foreground">
                        {subjClassrooms.length === 0 ? (
                          <span className="text-xs text-amber-600 bg-amber-50 border border-amber-100 px-2 py-1 rounded">{t("noRoomsYet")}</span>
                        ) : (
                          <div className="flex flex-wrap gap-2 mt-1">
                            {subjClassrooms.map((room) => (
                              <Link key={room.id} href={`/classrooms/${room.id}`}>
                                <span className="inline-flex items-center gap-1 text-xs font-semibold bg-muted hover:bg-primary/10 hover:text-primary border px-2.5 py-1 rounded-lg text-foreground transition-colors">
                                  {room.name}
                                  <ChevronRight className="h-3 w-3 shrink-0" />
                                </span>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Quick shortcuts/Guide */}
        <div className="space-y-4">
          <h2 className="text-xl font-black text-foreground tracking-tight">
            {t("quickMenu")}
          </h2>
          
          <div className="bg-white p-5 rounded-xl border shadow-sm space-y-4">
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
      </div>
    </div>
  );
}