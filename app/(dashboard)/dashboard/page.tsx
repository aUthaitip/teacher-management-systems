"use client";

import { useApp } from "@/lib/AppContext";
import { useLanguage } from "@/lib/LanguageContext";
import { WelcomeBanner } from "@/components/dashboard/welcome-banner";
import { DashboardStats } from "@/components/dashboard/stats-cards";
import { SubjectsList } from "@/components/dashboard/subjects-list";
import { QuickMenu } from "@/components/dashboard/quick-menu";

export default function DashboardPage() {
  const { currentTeacher, subjects, classrooms, students, isLoaded } = useApp();
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

  return (
    <div className="space-y-8">
      <WelcomeBanner teacher={currentTeacher} t={t} />

      <DashboardStats 
        subjectsCount={teacherSubjects.length}
        classroomsCount={teacherClassrooms.length}
        studentsCount={teacherStudents.length}
        t={t}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <SubjectsList 
          subjects={teacherSubjects}
          classrooms={classrooms}
          t={t}
        />
        <QuickMenu t={t} />
      </div>
    </div>
  );
}
