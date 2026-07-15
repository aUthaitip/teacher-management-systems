"use client";

import { useState } from "react";
import { useApp } from "@/lib/AppContext";
import Link from "next/link";
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Edit, 
  GraduationCap, 
  ArrowRight, 
  FolderPlus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddSubjectDialog } from "@/components/subjects/add-subject-dialog";
import { AddClassroomDialog } from "@/components/subjects/add-classroom-dialog";
import { SubjectCard } from "@/components/subjects/subject-card";

export default function SubjectsPage() {
  const { 
    currentTeacher, 
    subjects, 
    classrooms, 
    students,
    isLoaded, 
    addSubject, 
    updateSubject, 
    deleteSubject,
    addClassroom,
    deleteClassroom
  } = useApp();

  // Dialog open states
  const [isSubjOpen, setIsSubjOpen] = useState(false);
  const [isClassOpen, setIsClassOpen] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");

  // Form states
  const [subjName, setSubjName] = useState("");
  const [subjCode, setSubjCode] = useState("");
  const [subjGradeLevel, setSubjGradeLevel] = useState("ม.1");
  const [editingSubjId, setEditingSubjId] = useState<string | null>(null);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const teacherSubjects = subjects.filter(s => currentTeacher && s.teacherIds.includes(currentTeacher.id));

  const handleSubjSubmit = (code: string, name: string, gradeLevel: string) => {
    if (editingSubjId) {
      updateSubject(editingSubjId, name, code, gradeLevel);
      setEditingSubjId(null);
    } else {
      addSubject(name, code, gradeLevel);
    }
    setSubjName("");
    setSubjCode("");
    setSubjGradeLevel("ม.1");
    setIsSubjOpen(false);
  };

  const handleClassSubmit = (className: string, classDesc: string) => {
    if (!selectedSubjectId) return;
    addClassroom(className, selectedSubjectId, classDesc);
    setIsClassOpen(false);
  };

  const openEditSubj = (id: string, name: string, code: string, gradeLevel: string) => {
    setEditingSubjId(id);
    setSubjName(name);
    setSubjCode(code);
    setSubjGradeLevel(gradeLevel || "ม.1");
    setIsSubjOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">
            รายวิชาและห้องเรียน
          </h1>
          <p className="text-muted-foreground mt-1">
            จัดการรายวิชาหลักที่รับผิดชอบการสอน และแยกห้องเรียนย่อยในแต่ละวิชา
          </p>
        </div>

        {/* Add Subject trigger */}
        <AddSubjectDialog
          open={isSubjOpen}
          onOpenChange={setIsSubjOpen}
          editingId={editingSubjId}
          initialCode={subjCode}
          initialName={subjName}
          initialGradeLevel={subjGradeLevel}
          onSubmit={handleSubjSubmit}
          triggerEl={
            <Button className="flex items-center gap-2 font-bold cursor-pointer shadow">
              <Plus className="h-5 w-5" />
              เพิ่มรายวิชาสอน
            </Button>
          }
        />
      </div>

      {teacherSubjects.length === 0 ? (
        <div className="bg-card rounded-xl border p-12 text-center max-w-xl mx-auto shadow-sm">
          <BookOpen className="h-12 w-12 mx-auto text-muted/60 mb-3" />
          <h3 className="text-lg font-bold text-foreground">ยังไม่มีรายวิชาที่สอน</h3>
          <p className="text-sm text-muted-foreground mt-1">เริ่มสร้างรายวิชาและเปิดห้องเรียนย่อยเพื่อเช็กชื่อและลงคะแนนนักเรียนของคุณ</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teacherSubjects.map((subject) => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              classrooms={classrooms}
              students={students}
              onEdit={openEditSubj}
              onDeleteSubject={deleteSubject}
              onDeleteClassroom={deleteClassroom}
              onAddClassroom={(subId) => {
                setSelectedSubjectId(subId);
                setIsClassOpen(true);
              }}
            />
          ))}        </div>
      )}

      {/* Add Classroom Dialog */}
      <AddClassroomDialog
        open={isClassOpen}
        onOpenChange={setIsClassOpen}
        onSubmit={handleClassSubmit}
      />
    </div>
  );
}
