"use client";

import React, { useState, useRef } from "react";
import { useApp, Student } from "@/lib/AppContext";
import { useLanguage } from "@/lib/LanguageContext";
import { Plus, Trash2, Edit, UserPlus, Users, Upload, Download } from "lucide-react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface StudentsTabProps {
  classroomId: string;
}

export function StudentsTab({ classroomId }: StudentsTabProps) {
  const { students, addStudent, addStudentsBatch, updateStudent, deleteStudent, isLoaded } = useApp();
  const { language, t } = useLanguage();
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [studentRoll, setStudentRoll] = useState("");
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const data = classroomStudents.map(s => ({
      "เลขที่": s.rollNumber,
      "ชื่อ-นามสกุล": s.name
    }));
    if (data.length === 0) {
      data.push({ "เลขที่": "1", "ชื่อ-นามสกุล": "ชื่อ นามสกุล ตัวอย่าง" });
    }
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
    XLSX.writeFile(workbook, `รายชื่อนักเรียน_${classroomId}.xlsx`);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        
        const newStudents = data.map((row: any) => {
          const rollNumber = row["เลขที่"] || row["No"] || row["Roll"] || row["เลขประจำตัว"] || "";
          const name = row["ชื่อ-นามสกุล"] || row["ชื่อ"] || row["Name"] || row["Fullname"] || "";
          return { rollNumber: String(rollNumber), name: String(name) };
        }).filter(s => s.name && s.rollNumber);

        if (newStudents.length > 0) {
          addStudentsBatch(newStudents, classroomId);
          alert(language === "th" ? `นำเข้าสำเร็จ ${newStudents.length} รายการ` : `Imported ${newStudents.length} students successfully`);
        } else {
          alert(language === "th" ? "ไม่พบข้อมูลนักเรียนในไฟล์ (กรุณาใช้คอลัมน์ 'เลขที่' และ 'ชื่อ-นามสกุล')" : "No valid data found (use 'เลขที่' and 'ชื่อ-นามสกุล' columns)");
        }
      } catch (err) {
        console.error(err);
        alert(language === "th" ? "เกิดข้อผิดพลาดในการอ่านไฟล์" : "Error reading file");
      }
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.readAsBinaryString(file);
  };

  const classroomStudents = students
    .filter((s) => s.classroomId === classroomId)
    .sort((a, b) => Number(a.rollNumber) - Number(b.rollNumber));

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !studentRoll) return;

    if (editingStudentId) {
      updateStudent(editingStudentId, studentName, studentRoll);
      setEditingStudentId(null);
    } else {
      addStudent(studentName, studentRoll, classroomId);
    }

    setStudentName("");
    setStudentRoll("");
    setIsStudentModalOpen(false);
  };

  const openEditStudent = (student: Student) => {
    setEditingStudentId(student.id);
    setStudentName(student.name);
    setStudentRoll(student.rollNumber);
    setIsStudentModalOpen(true);
  };

  if (!isLoaded) return null;

  return (
    <Card className="bg-card border shadow-sm">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 border-b">
        <div>
          <CardTitle className="text-lg font-bold text-foreground">{t("studentRegistersTitle")}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">{t("studentRegistersDesc")}</CardDescription>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0">
          <input 
            type="file" 
            accept=".xlsx, .xls, .csv" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleImport} 
          />
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExport}
            className="h-8 text-xs font-bold shadow-sm"
          >
            <Download className="h-3.5 w-3.5 mr-1" />
            {language === "th" ? "ส่งออก" : "Export"}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="h-8 text-xs font-bold shadow-sm"
          >
            <Upload className="h-3.5 w-3.5 mr-1" />
            {language === "th" ? "นำเข้า" : "Import"}
          </Button>

          <Dialog open={isStudentModalOpen} onOpenChange={setIsStudentModalOpen}>
            <DialogTrigger className="flex h-8 items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer shadow">
              <UserPlus className="h-4 w-4 mr-1" />
              {t("addStudentBtn")}
            </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                {editingStudentId ? t("editStudentTitle") : t("registerStudentTitle")}
              </DialogTitle>
              <DialogDescription>
                {t("registerStudentDesc")}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleStudentSubmit} className="space-y-4 py-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase">{t("rollNumberCol")}</label>
                <Input
                  type="number"
                  min="1"
                  placeholder={t("rollNumberPl")}
                  value={studentRoll}
                  onChange={(e) => setStudentRoll(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase">{t("studentNameCol")}</label>
                <Input
                  placeholder={t("studentNamePl")}
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  required
                />
              </div>
              <DialogFooter className="pt-4 gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => { setIsStudentModalOpen(false); setEditingStudentId(null); setStudentName(""); setStudentRoll(""); }}
                >
                  {t("cancel")}
                </Button>
                <Button type="submit">
                  {t("save")}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {classroomStudents.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-2 text-muted/60" />
            <p className="text-sm font-bold text-foreground">{t("noStudentsScores")}</p>
            <p className="text-xs mt-1">{t("registerStudentDesc")}</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24 px-6">{t("rollNumberCol")}</TableHead>
                <TableHead className="px-6">{t("studentNameCol")}</TableHead>
                <TableHead className="text-right w-36 px-6">{t("manageCol")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classroomStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-bold text-foreground text-sm px-6">{student.rollNumber}</TableCell>
                  <TableCell className="font-bold text-foreground text-sm px-6">{student.name}</TableCell>
                  <TableCell className="text-right space-x-1 px-6">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => openEditStudent(student)}
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => {
                        if (confirm(t("deleteConfirm") || "คุณแน่ใจหรือไม่ที่จะลบข้อมูลนี้?")) {
                          deleteStudent(student.id);
                        }
                      }}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
