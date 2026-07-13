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
        <div className="bg-white rounded-xl border p-12 text-center max-w-xl mx-auto shadow-sm">
          <BookOpen className="h-12 w-12 mx-auto text-muted/60 mb-3" />
          <h3 className="text-lg font-bold text-foreground">ยังไม่มีรายวิชาที่สอน</h3>
          <p className="text-sm text-muted-foreground mt-1">เริ่มสร้างรายวิชาและเปิดห้องเรียนย่อยเพื่อเช็กชื่อและลงคะแนนนักเรียนของคุณ</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teacherSubjects.map((subject) => {
            const subjClassrooms = classrooms.filter(c => c.subjectId === subject.id);
            return (
              <Card key={subject.id} className="bg-white border shadow-sm hover:shadow transition-all flex flex-col justify-between overflow-hidden">
                <CardHeader className="bg-muted/10 p-6 border-b flex flex-row items-start justify-between space-y-0">
                  <div className="space-y-1.5">
                    <div className="flex gap-1.5 items-center">
                      <span className="text-[10px] font-black uppercase bg-primary text-primary-foreground px-2 py-0.5 rounded shadow-sm">
                        {subject.code}
                      </span>
                      {subject.gradeLevel && (
                        <span className="text-[10px] font-bold bg-zinc-100 text-zinc-700 border px-2 py-0.5 rounded shadow-sm">
                          ชั้น {subject.gradeLevel}
                        </span>
                      )}
                    </div>
                    <CardTitle className="text-lg font-bold text-foreground mt-2">
                      {subject.name}
                    </CardTitle>
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => openEditSubj(subject.id, subject.name, subject.code, subject.gradeLevel || "ม.1")}
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => deleteSubject(subject.id)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6 flex-1 flex flex-col justify-between space-y-5">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                      <span>ห้องเรียนในวิชานี้ ({subjClassrooms.length})</span>
                    </div>
                    {subjClassrooms.length === 0 ? (
                      <p className="text-xs text-muted-foreground italic">ยังไม่มีห้องเรียนในรายวิชานี้</p>
                    ) : (
                      <div className="space-y-2">
                        {subjClassrooms.map((room) => {
                          const roomStudents = students.filter(s => s.classroomId === room.id);
                          return (
                            <div 
                              key={room.id} 
                              className="flex items-center justify-between bg-white border p-3 rounded-xl transition-all shadow-sm"
                            >
                              <div className="flex items-center gap-2.5">
                                <GraduationCap className="h-4.5 w-4.5 text-primary bg-primary/10 p-0.5 rounded" />
                                <div>
                                  <h4 className="text-sm font-bold text-foreground leading-tight">{room.name}</h4>
                                  <span className="text-[10px] text-muted-foreground">{roomStudents.length} นักเรียน</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => deleteClassroom(room.id)}
                                  className="h-7 w-7 text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10 rounded-md"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                                <Link href={`/classrooms/${room.id}`}>
                                  <Button size="sm" className="text-xs font-bold py-1 px-3 h-8 rounded-lg">
                                    เข้าห้องเรียน
                                    <ArrowRight className="ml-1 h-3 w-3" />
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <Button 
                    variant="outline" 
                    onClick={() => { setSelectedSubjectId(subject.id); setIsClassOpen(true); }}
                    className="w-full border-dashed hover:border-primary hover:text-primary font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all mt-4 cursor-pointer"
                  >
                    <FolderPlus className="h-4 w-4" />
                    เปิดห้องเรียน/ชั้นเรียนย่อย
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
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
