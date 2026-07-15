"use client";

import React, { useEffect, useState } from "react";
import { useApp } from "@/lib/AppContext";
import { useLanguage } from "@/lib/LanguageContext";
import Link from "next/link";
import { GraduationCap, ArrowLeft, Users, BookOpen, ShieldCheck, Globe, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/lib/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

interface FirebaseUser {
  id: string;
  name: string;
  email: string;
  school: string;
}

export default function AdminPage() {
  const { deleteTeacher, currentTeacher, teachers, subjects, classrooms, students, isLoaded } = useApp();
  const { language, toggleLanguage } = useLanguage();

  const [firebaseTeachers, setFirebaseTeachers] = useState<FirebaseUser[]>([]);
  const [loadingFirebase, setLoadingFirebase] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersList: FirebaseUser[] = [];
        querySnapshot.forEach((docSnap) => {
          usersList.push({ id: docSnap.id, ...docSnap.data() } as FirebaseUser);
        });
        setFirebaseTeachers(usersList);
      } catch (err) {
        console.error("Error fetching users from Firebase:", err);
      } finally {
        setLoadingFirebase(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDeleteTeacher = async (id: string, name: string) => {
    const confirmText = language === "th"
      ? `ต้องการลบครู "${name}" ออกจากระบบหรือไม่? (ครูจะไม่สามารถเข้าสู่ระบบได้อีก)`
      : `Are you sure you want to delete teacher "${name}"? (They will be banned from logging in)`;
    if (confirm(confirmText)) {
      try {
        await deleteDoc(doc(db, "users", id));
        setFirebaseTeachers(prev => prev.filter(t => t.id !== id));
        deleteTeacher(id); // Keep sync with local context if needed
      } catch (err) {
        console.error("Error deleting user:", err);
        alert("Failed to delete user");
      }
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden selection:bg-primary selection:text-primary-foreground">
      {/* Subtle light grid pattern background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-50 pointer-events-none"></div>

      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-40 relative">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-xl text-primary-foreground shadow-sm">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight leading-none text-foreground">
                {language === "th" ? "แผงผู้ดูแลระบบ" : "Admin Panel"}
              </h1>
              <span className="text-[10px] text-muted-foreground">
                {language === "th" ? "ระบบจัดการชั้นเรียน" : "Teacher Management Systems"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <Button
              variant="ghost"
              onClick={toggleLanguage}
              className="text-muted-foreground hover:text-black font-bold gap-1 cursor-pointer h-9 px-3 text-sm"
            >
              <Globe className="h-4 w-4" />
              {language === "th" ? "EN" : "TH"}
            </Button>

            <Link href="/dashboard">
              <Button variant="outline" className="border-border text-zinc-700 hover:bg-muted hover:text-black flex items-center gap-1.5 h-9 rounded-lg cursor-pointer">
                <ArrowLeft className="h-4 w-4" />
                {language === "th" ? "กลับหน้าครูผู้สอน" : "Back to Teacher View"}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 relative z-10 space-y-8">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-foreground">
            {language === "th" ? "แดชบอร์ดผู้ดูแลระบบ" : "Admin Dashboard"}
          </h2>
          <p className="text-muted-foreground mt-1">
            {language === "th" 
              ? "ข้อมูลผู้ลงใช้งานจริงทั้งหมดในเครื่องเบราว์เซอร์นี้" 
              : "Active configuration and analytics parsed from live client database."}
          </p>
        </div>

        {/* System Overview Stats (Stark light cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Card className="bg-card border-border text-foreground shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <Users className="h-5 w-5 text-muted-foreground" />
                <span className="text-2xl font-black">{firebaseTeachers.length}</span>
              </div>
              <h4 className="text-xs font-bold text-muted-foreground mt-4 uppercase">
                {language === "th" ? "คุณครูสมัครใช้งานสะสม" : "Total Teachers"}
              </h4>
            </CardContent>
          </Card>

          <Card className="bg-card border-border text-foreground shadow-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center justify-between w-full">
                  <BookOpen className="h-5 w-5 text-muted-foreground" />
                  <span className="text-2xl font-black">{subjects.length}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-4">
                <h4 className="text-xs font-bold text-muted-foreground uppercase">
                  {language === "th" ? "วิชาเรียนทั้งหมดในระบบ" : "Total System Subjects"}
                </h4>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-[10px] h-6 py-0 px-2 w-fit text-rose-500 hover:text-rose-600 hover:bg-rose-50 border-rose-100 mt-1"
                  onClick={() => {
                    const confirmMsg = language === "th" ? "ต้องการลบข้อมูลวิชาและห้องเรียนที่ตกค้างจากครูที่ถูกลบไปแล้วใช่หรือไม่?" : "Are you sure you want to clear orphaned subjects and classrooms?";
                    if (window.confirm(confirmMsg)) {
                      const validTeacherIds = new Set(firebaseTeachers.map(t => t.id));
                      
                      const lsSubjects = JSON.parse(localStorage.getItem("tms_subjects") || "[]");
                      const cleanSubjects = lsSubjects.filter((s: any) => s.teacherIds.some((id: string) => validTeacherIds.has(id)));
                      localStorage.setItem("tms_subjects", JSON.stringify(cleanSubjects));
                      
                      const lsClassrooms = JSON.parse(localStorage.getItem("tms_classrooms") || "[]");
                      const cleanSubjIds = new Set(cleanSubjects.map((s: any) => s.id));
                      const cleanClassrooms = lsClassrooms.filter((c: any) => cleanSubjIds.has(c.subjectId));
                      localStorage.setItem("tms_classrooms", JSON.stringify(cleanClassrooms));
                      
                      const lsStudents = JSON.parse(localStorage.getItem("tms_students") || "[]");
                      const cleanClassIds = new Set(cleanClassrooms.map((c: any) => c.id));
                      const cleanStudents = lsStudents.filter((st: any) => cleanClassIds.has(st.classroomId));
                      localStorage.setItem("tms_students", JSON.stringify(cleanStudents));
                      
                      window.location.reload();
                    }
                  }}
                >
                  {language === "th" ? "เคลียร์วิชาตกค้าง" : "Clear Orphaned"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border text-foreground shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <GraduationCap className="h-5 w-5 text-muted-foreground" />
                <span className="text-2xl font-black">{classrooms.length}</span>
              </div>
              <h4 className="text-xs font-bold text-muted-foreground mt-4 uppercase">
                {language === "th" ? "ห้องเรียนทั้งหมดในระบบ" : "Total System Classrooms"}
              </h4>
            </CardContent>
          </Card>

          <Card className="bg-card border-border text-foreground shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <ShieldCheck className="h-5 w-5 text-muted-foreground" />
                <span className="text-2xl font-black">{students.length}</span>
              </div>
              <h4 className="text-xs font-bold text-muted-foreground mt-4 uppercase">
                {language === "th" ? "จำนวนนักเรียนรวม" : "Total Enrolled Students"}
              </h4>
            </CardContent>
          </Card>
        </div>

        {/* Teachers Table (Stark Light Monochrome Style) */}
        <Card className="bg-card border-border text-foreground shadow-sm">
          <CardHeader className="p-6 border-b border-border">
            <CardTitle className="text-lg font-bold">
              {language === "th" ? "ข้อมูลคุณครูและประวัติจริงในระบบ" : "Live Teacher Registry Audits"}
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              {language === "th" 
                ? "แสดงรายชื่อและสถิติวิชา/ห้องเรียนที่ครูแต่ละคนกำลังใช้งานจริง" 
                : "Active statistics of subjects, classrooms, and relational database objects per registered account."}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="border-b border-border bg-background/50">
                <TableRow className="border-b border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground font-bold px-6 py-3">
                    {language === "th" ? "ชื่อครูผู้ใช้งาน" : "Teacher Identity"}
                  </TableHead>
                  <TableHead className="text-muted-foreground font-bold px-6 py-3 text-center">
                    {language === "th" ? "วิชาเรียน" : "Subjects"}
                  </TableHead>
                  <TableHead className="text-muted-foreground font-bold px-6 py-3 text-center">
                    {language === "th" ? "ห้องเรียน" : "Classrooms"}
                  </TableHead>
                  <TableHead className="text-muted-foreground font-bold px-6 py-3 text-center">
                    {language === "th" ? "นักเรียนรวม" : "Students"}
                  </TableHead>
                  <TableHead className="text-muted-foreground font-bold px-6 py-3 text-right">
                    {language === "th" ? "การจัดการ" : "Action"}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingFirebase ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      {language === "th" ? "กำลังโหลดข้อมูล..." : "Loading data..."}
                    </TableCell>
                  </TableRow>
                ) : firebaseTeachers.map((teacher) => {
                  // Calculate statistics based on real relations
                  // Fallback: match by local ID if they created subjects before Firebase ID migration
                  const localTeacher = teachers.find(t => t.email.toLowerCase() === teacher.email.toLowerCase());
                  const possibleIds = [teacher.id];
                  if (localTeacher) possibleIds.push(localTeacher.id);

                  const teacherSubjects = subjects.filter(s => s.teacherIds.some(id => possibleIds.includes(id)));
                  const teacherSubjIds = teacherSubjects.map(s => s.id);
                  const teacherClassrooms = classrooms.filter(c => teacherSubjIds.includes(c.subjectId));
                  const teacherClassroomIds = teacherClassrooms.map(c => c.id);
                  const teacherStudents = students.filter(s => teacherClassroomIds.includes(s.classroomId));

                  return (
                    <TableRow key={teacher.id} className="border-b border-border hover:bg-background/20">
                      <TableCell className="px-6 py-4">
                        <div className="font-bold text-foreground">{teacher.name}</div>
                        <div className="text-xs text-muted-foreground font-mono mt-0.5">{teacher.email}</div>
                        <div className="text-[10px] text-muted-foreground mt-1">{teacher.school}</div>
                      </TableCell>

                      <TableCell className="text-center font-bold text-sm px-6 py-4">{teacherSubjects.length}</TableCell>
                      <TableCell className="text-center font-bold text-sm px-6 py-4">{teacherClassrooms.length}</TableCell>
                      <TableCell className="text-center font-bold text-sm px-6 py-4">{teacherStudents.length}</TableCell>
                      
                      <TableCell className="px-6 py-4 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteTeacher(teacher.id, teacher.name)}
                          className="h-8 w-8 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-md cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {!loadingFirebase && firebaseTeachers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-sm text-muted-foreground italic">
                      {language === "th" ? "ไม่มีบัญชีครูลงทะเบียนในระบบในเบราว์เซอร์นี้" : "No teacher registry data detected."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
