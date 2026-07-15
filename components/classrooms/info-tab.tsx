"use client";

import React from "react";
import { useApp } from "@/lib/AppContext";
import { useLanguage } from "@/lib/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface InfoTabProps {
  classroomId: string;
}

export function InfoTab({ classroomId }: InfoTabProps) {
  const { classrooms, subjects, students, scores, isLoaded } = useApp();
  const { t } = useLanguage();

  const classroom = classrooms.find((c) => c.id === classroomId);
  const subject = subjects.find((s) => s.id === classroom?.subjectId);
  const classroomStudents = students.filter((s) => s.classroomId === classroomId);
  const classroomChapters = scores.filter((s) => s.classroomId === classroomId);

  if (!isLoaded || !classroom) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="bg-card border shadow-sm md:col-span-2">
        <CardHeader className="p-6 border-b">
          <CardTitle className="text-lg font-bold text-foreground">{t("classInfoTitle")}</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h5 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t("classroomLabel")}</h5>
              <p className="text-base font-extrabold text-foreground mt-1">{classroom.name}</p>
            </div>
            <div>
              <h5 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t("subjectsAndClasses")}</h5>
              <p className="text-base font-extrabold text-foreground mt-1">({subject?.code}) {subject?.name}</p>
            </div>
            <div className="col-span-2">
              <h5 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t("classDescLabelTab")}</h5>
              <p className="text-sm font-semibold text-muted-foreground mt-1">{classroom.description || "-"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border shadow-sm">
        <CardHeader className="p-6 border-b">
          <CardTitle className="text-lg font-bold text-foreground">{t("statisticsTitle")}</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div>
            <h5 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t("totalStudents")}</h5>
            <p className="text-3xl font-black text-foreground mt-1">
              {classroomStudents.length} <span className="text-sm font-bold text-muted-foreground">{t("studentsCountUnit")}</span>
            </p>
          </div>
          <div>
            <h5 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t("chaptersCountUnit")}</h5>
            <p className="text-3xl font-black text-foreground mt-1">
              {classroomChapters.length} <span className="text-sm font-bold text-muted-foreground">{t("chaptersCountUnit")}</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
