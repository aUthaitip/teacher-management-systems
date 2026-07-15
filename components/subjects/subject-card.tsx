import Link from "next/link";
import { Edit, Trash2, GraduationCap, ArrowRight, FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Subject, Classroom, Student } from "@/lib/AppContext";

interface SubjectCardProps {
  subject: Subject;
  classrooms: Classroom[];
  students: Student[];
  onEdit: (id: string, name: string, code: string, gradeLevel: string) => void;
  onDeleteSubject: (id: string) => void;
  onDeleteClassroom: (id: string) => void;
  onAddClassroom: (subjectId: string) => void;
}

export function SubjectCard({ 
  subject, 
  classrooms, 
  students, 
  onEdit, 
  onDeleteSubject, 
  onDeleteClassroom, 
  onAddClassroom 
}: SubjectCardProps) {
  const subjClassrooms = classrooms.filter(c => c.subjectId === subject.id);

  return (
    <Card className="bg-card border shadow-sm hover:shadow transition-all flex flex-col justify-between overflow-hidden">
      <CardHeader className="bg-muted/10 p-6 border-b flex flex-row items-start justify-between space-y-0">
        <div className="space-y-1.5">
          <div className="flex gap-1.5 items-center">
            <span className="text-[10px] font-black uppercase bg-primary text-primary-foreground px-2 py-0.5 rounded shadow-sm">
              {subject.code}
            </span>
            {subject.gradeLevel && (
              <span className="text-[10px] font-bold bg-muted text-zinc-700 border px-2 py-0.5 rounded shadow-sm">
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
            onClick={() => onEdit(subject.id, subject.name, subject.code, subject.gradeLevel || "ม.1")}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onDeleteSubject(subject.id)}
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
                    className="flex items-center justify-between bg-card border p-3 rounded-xl transition-all shadow-sm"
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
                        onClick={() => onDeleteClassroom(room.id)}
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
          onClick={() => onAddClassroom(subject.id)}
          className="w-full border-dashed hover:border-primary hover:text-primary font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all mt-4 cursor-pointer"
        >
          <FolderPlus className="h-4 w-4" />
          เปิดห้องเรียน/ชั้นเรียนย่อย
        </Button>
      </CardContent>
    </Card>
  );
}
