"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/lib/AppContext";
import { useLanguage } from "@/lib/LanguageContext";
import { 
  ArrowLeft, 
  Users, 
  CalendarDays, 
  Award, 
  Info,
  History
} from "lucide-react";
import { AttendanceTab } from "@/components/classrooms/attendance-tab";
import { ScoresTab } from "@/components/classrooms/scores-tab";
import { StudentsTab } from "@/components/classrooms/students-tab";
import { InfoTab } from "@/components/classrooms/info-tab";
import { HistoryTab } from "@/components/classrooms/history-tab";
import { GradesTab } from "@/components/classrooms/grades-tab";
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";

export default function ClassroomDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { classrooms, subjects, isLoaded } = useApp();
  const { language, t } = useLanguage();

  const id = params?.id as string;

  const classroom = classrooms.find((c) => c.id === id);
  const subject = subjects.find((s) => s.id === classroom?.subjectId);

  const [activeTab, setActiveTab] = useState<"attendance" | "scores" | "grades" | "students" | "info" | "history">("attendance");

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!classroom) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-destructive">{t("noClassroomFound")}</h2>
        <Button onClick={() => router.push("/subjects")} className="mt-4">
          {t("backToMain")}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Back button and Class Banner */}
      <div className="flex items-center gap-3">
        <Link href="/subjects" className="p-2 hover:bg-muted rounded-xl transition-colors">
          <ArrowLeft className="h-5 w-5 text-muted-foreground" />
        </Link>
        <div>
          <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded uppercase tracking-wider">
            {subject?.code} - {subject?.name}
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tight mt-1">
            {t("classroomLabel")} {classroom.name}
          </h1>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b overflow-x-auto gap-2">
        <button
          onClick={() => setActiveTab("attendance")}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 font-bold text-sm shrink-0 transition-all cursor-pointer ${
            activeTab === "attendance"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <CalendarDays className="h-4.5 w-4.5" />
          {t("attendanceTab")}
        </button>
        <button
          onClick={() => setActiveTab("scores")}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 font-bold text-sm shrink-0 transition-all cursor-pointer ${
            activeTab === "scores"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Award className="h-4.5 w-4.5" />
          {t("scoresTab")}
        </button>
        <button
          onClick={() => setActiveTab("grades")}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 font-bold text-sm shrink-0 transition-all cursor-pointer ${
            activeTab === "grades"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Calculator className="h-4.5 w-4.5" />
          {language === "th" ? "สรุปเกรด" : "Grades"}
        </button>
        <button
          onClick={() => setActiveTab("students")}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 font-bold text-sm shrink-0 transition-all cursor-pointer ${
            activeTab === "students"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Users className="h-4.5 w-4.5" />
          {t("studentsTab")}
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 font-bold text-sm shrink-0 transition-all cursor-pointer ${
            activeTab === "history"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <History className="h-4.5 w-4.5" />
          {language === "th" ? "ประวัติ & สถิติ" : "History & Stats"}
        </button>
        <button
          onClick={() => setActiveTab("info")}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 font-bold text-sm shrink-0 transition-all cursor-pointer ${
            activeTab === "info"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Info className="h-4.5 w-4.5" />
          {t("infoTab")}
        </button>
      </div>

      {/* Tab Panels */}
      <div className="mt-6">
        {activeTab === "attendance" && <AttendanceTab classroomId={id} />}
        {activeTab === "scores" && <ScoresTab classroomId={id} />}
        {activeTab === "grades" && <GradesTab classroomId={id} />}
        {activeTab === "students" && <StudentsTab classroomId={id} />}
        {activeTab === "history" && <HistoryTab classroomId={id} />}
        {activeTab === "info" && <InfoTab classroomId={id} />}
      </div>
    </div>
  );
}
