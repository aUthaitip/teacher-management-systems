"use client";

import React, { useState, useRef, useEffect } from "react";
import { useApp } from "@/lib/AppContext";
import { useLanguage } from "@/lib/LanguageContext";
import { Calculator, Upload, Download, Settings, Save, FileSpreadsheet } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";

interface GradesTabProps {
  classroomId: string;
}

export function GradesTab({ classroomId }: GradesTabProps) {
  const { students, scores, classrooms, updateClassroomGradeSettings, addScoreChapter, updateStudentScores, isLoaded } = useApp();
  const { language, t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const classroom = classrooms.find(c => c.id === classroomId);
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [thresholds, setThresholds] = useState({
    grade4: 80,
    grade3_5: 75,
    grade3: 70,
    grade2_5: 65,
    grade2: 60,
    grade1_5: 55,
    grade1: 50
  });

  useEffect(() => {
    if (classroom?.gradeThresholds) {
      setThresholds({
        grade4: classroom.gradeThresholds.grade4 ?? 80,
        grade3_5: classroom.gradeThresholds.grade3_5 ?? 75,
        grade3: classroom.gradeThresholds.grade3 ?? 70,
        grade2_5: classroom.gradeThresholds.grade2_5 ?? 65,
        grade2: classroom.gradeThresholds.grade2 ?? 60,
        grade1_5: classroom.gradeThresholds.grade1_5 ?? 55,
        grade1: classroom.gradeThresholds.grade1 ?? 50
      });
    }
  }, [classroom]);

  const classroomStudents = students
    .filter((s) => s.classroomId === classroomId)
    .sort((a, b) => Number(a.rollNumber) - Number(b.rollNumber));

  const classroomChapters = scores.filter((s) => s.classroomId === classroomId);
  const maxPossibleScore = classroomChapters.reduce((sum, ch) => sum + ch.totalScore, 0);

  // Calculate total score per student
  const studentTotals: Record<string, number> = {};
  classroomStudents.forEach(st => {
    let total = 0;
    classroomChapters.forEach(ch => {
      total += (ch.studentScores[st.id] || 0);
    });
    studentTotals[st.id] = total;
  });

  const getGrade = (score: number) => {
    // If they set custom thresholds but max score isn't 100, we scale it to percentage
    // Or we just use raw score if max score is 100. Let's assume standard percentage.
    let percentage = score;
    if (maxPossibleScore > 0 && maxPossibleScore !== 100) {
      percentage = (score / maxPossibleScore) * 100;
    }

    if (percentage >= thresholds.grade4) return { grade: "4", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" };
    if (percentage >= thresholds.grade3_5) return { grade: "3.5", color: "bg-teal-500/10 text-teal-600 border-teal-500/20" };
    if (percentage >= thresholds.grade3) return { grade: "3", color: "bg-blue-500/10 text-blue-600 border-blue-500/20" };
    if (percentage >= thresholds.grade2_5) return { grade: "2.5", color: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20" };
    if (percentage >= thresholds.grade2) return { grade: "2", color: "bg-amber-500/10 text-amber-600 border-amber-500/20" };
    if (percentage >= thresholds.grade1_5) return { grade: "1.5", color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" };
    if (percentage >= thresholds.grade1) return { grade: "1", color: "bg-orange-500/10 text-orange-600 border-orange-500/20" };
    return { grade: language === "th" ? "0 (ไม่ผ่าน)" : "0 (Fail)", color: "bg-rose-500/10 text-rose-600 border-rose-500/20" };
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateClassroomGradeSettings(classroomId, thresholds);
    setIsSettingsOpen(false);
  };

  const handleExport = () => {
    const data = classroomStudents.map(s => {
      const row: any = {
        "เลขที่": s.rollNumber,
        "ชื่อ-นามสกุล": s.name,
      };
      // Add individual chapter scores
      classroomChapters.forEach(ch => {
        row[`คะแนน: ${ch.chapterName}`] = ch.studentScores[s.id] || 0;
      });
      // Add totals
      const total = studentTotals[s.id] || 0;
      row["คะแนนรวม"] = total;
      row["เปอร์เซ็นต์"] = maxPossibleScore > 0 ? ((total / maxPossibleScore) * 100).toFixed(2) + "%" : "0%";
      row["เกรด"] = getGrade(total).grade;
      return row;
    });

    if (data.length === 0) {
      data.push({ [language === "th" ? "เลขที่" : "No."]: "1", [language === "th" ? "ชื่อ-นามสกุล" : "Name"]: language === "th" ? "ตัวอย่าง" : "Example", [language === "th" ? "คะแนนรวม" : "Total"]: 85, [language === "th" ? "เกรด" : "Grade"]: "4" });
    }

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Grades");
    XLSX.writeFile(workbook, `สรุปเกรด_${classroom?.name || "classroom"}.xlsx`);
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
        
        const importedScores: Record<string, number> = {};
        
        data.forEach((row: any) => {
          const rollNumber = String(row["เลขที่"] || row["No"] || row["Roll"] || row["เลขประจำตัว"] || "");
          const score = Number(row["คะแนนรวม"] || row["คะแนนดิบ"] || row["Score"] || row["Total"] || 0);
          
          const student = classroomStudents.find(s => s.rollNumber === rollNumber);
          if (student && !isNaN(score)) {
            importedScores[student.id] = score;
          }
        });

        if (Object.keys(importedScores).length > 0) {
          // Create a new chapter to store these imported total scores to avoid destroying existing data
          const chapterName = `คะแนนนำเข้า (${new Date().toLocaleDateString()})`;
          addScoreChapter(chapterName, 100, 50, classroomId);
          
          // Wait for the next tick for the chapter to be added, then we would need its ID to update scores
          // Since addScoreChapter doesn't return ID, we simulate it by finding the newly created one.
          // For a robust system, we should update the context action to return ID, but here we can just alert the user.
          alert(language === "th" 
            ? `ตรวจพบนักเรียน ${Object.keys(importedScores).length} คน กรุณาไปที่แถบ "จัดการคะแนน" และกรอกคะแนน (ฟีเจอร์นำเข้าคะแนนดิบจะถูกอัปเดตในเวอร์ชันหน้า)`
            : `Detected ${Object.keys(importedScores).length} students. Please enter these in the Scores tab.`
          );
        } else {
          alert(language === "th" ? "ไม่พบข้อมูลนักเรียนที่มีเลขที่ตรงกับในระบบ" : "No matching roll numbers found in the file.");
        }
      } catch (err) {
        console.error(err);
        alert(language === "th" ? "เกิดข้อผิดพลาดในการอ่านไฟล์" : "Error reading file");
      }
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.readAsBinaryString(file);
  };

  if (!isLoaded) return null;

  return (
    <Card className="bg-white border shadow-sm">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 border-b">
        <div>
          <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            {language === "th" ? "สรุปคะแนนและตัดเกรด" : "Summary & Grading"}
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground mt-1">
            {language === "th" 
              ? "รวมคะแนนจากทุกการประเมิน คิดเกรดอัตโนมัติ และส่งออกเป็น Excel" 
              : "Automatically aggregate scores from all chapters and calculate grades"}
          </CardDescription>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <input 
            type="file" 
            accept=".xlsx, .xls, .csv" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleImport} 
          />
          {/* <Button 
            variant="outline" 
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="h-8 text-xs font-bold shadow-sm"
          >
            <Upload className="h-3.5 w-3.5 mr-1" />
            {language === "th" ? "นำเข้าคะแนน" : "Import Scores"}
          </Button> */}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExport}
            className="h-8 text-xs font-bold shadow-sm text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-200"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 mr-1" />
            {language === "th" ? "ส่งออก Excel" : "Export Excel"}
          </Button>

          <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <DialogTrigger 
              render={<Button variant="outline" size="sm" className="h-8 text-xs font-bold shadow-sm" />}
            >
              <Settings className="h-3.5 w-3.5 mr-1" />
              {language === "th" ? "ตั้งค่าเกณฑ์เกรด" : "Grade Settings"}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px]">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold">{language === "th" ? "ตั้งค่าเกณฑ์การตัดเกรด" : "Grade Threshold Settings"}</DialogTitle>
                <DialogDescription>
                  {language === "th" 
                    ? "กำหนดช่วงคะแนน (เปอร์เซ็นต์) สำหรับเกรดแต่ละระดับ" 
                    : "Define percentage thresholds for each grade level."}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSaveSettings} className="space-y-4 py-4">
                <div className="grid grid-cols-2 items-center gap-4">
                  <label className="text-sm font-semibold">{language === "th" ? "เกรด 4" : "Grade 4"} (&ge;)</label>
                  <Input type="number" min="0" max="100" value={thresholds.grade4} onChange={e => setThresholds({...thresholds, grade4: Number(e.target.value)})} />
                </div>
                <div className="grid grid-cols-2 items-center gap-4">
                  <label className="text-sm font-semibold">{language === "th" ? "เกรด 3.5" : "Grade 3.5"} (&ge;)</label>
                  <Input type="number" min="0" max="100" value={thresholds.grade3_5} onChange={e => setThresholds({...thresholds, grade3_5: Number(e.target.value)})} />
                </div>
                <div className="grid grid-cols-2 items-center gap-4">
                  <label className="text-sm font-semibold">{language === "th" ? "เกรด 3" : "Grade 3"} (&ge;)</label>
                  <Input type="number" min="0" max="100" value={thresholds.grade3} onChange={e => setThresholds({...thresholds, grade3: Number(e.target.value)})} />
                </div>
                <div className="grid grid-cols-2 items-center gap-4">
                  <label className="text-sm font-semibold">{language === "th" ? "เกรด 2.5" : "Grade 2.5"} (&ge;)</label>
                  <Input type="number" min="0" max="100" value={thresholds.grade2_5} onChange={e => setThresholds({...thresholds, grade2_5: Number(e.target.value)})} />
                </div>
                <div className="grid grid-cols-2 items-center gap-4">
                  <label className="text-sm font-semibold">{language === "th" ? "เกรด 2" : "Grade 2"} (&ge;)</label>
                  <Input type="number" min="0" max="100" value={thresholds.grade2} onChange={e => setThresholds({...thresholds, grade2: Number(e.target.value)})} />
                </div>
                <div className="grid grid-cols-2 items-center gap-4">
                  <label className="text-sm font-semibold">{language === "th" ? "เกรด 1.5" : "Grade 1.5"} (&ge;)</label>
                  <Input type="number" min="0" max="100" value={thresholds.grade1_5} onChange={e => setThresholds({...thresholds, grade1_5: Number(e.target.value)})} />
                </div>
                <div className="grid grid-cols-2 items-center gap-4">
                  <label className="text-sm font-semibold">{language === "th" ? "เกรด 1" : "Grade 1"} (&ge;)</label>
                  <Input type="number" min="0" max="100" value={thresholds.grade1} onChange={e => setThresholds({...thresholds, grade1: Number(e.target.value)})} />
                </div>
                <DialogFooter className="pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsSettingsOpen(false)}>{t("cancel")}</Button>
                  <Button type="submit" className="gap-1"><Save className="w-4 h-4" /> {t("save")}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="bg-muted/30 p-4 border-b text-sm flex gap-6 overflow-x-auto whitespace-nowrap">
          <div><span className="text-muted-foreground">{language === "th" ? "คะแนนเต็มรวมทั้งหมด:" : "Total Possible Score:"}</span> <strong className="text-primary">{maxPossibleScore}</strong></div>
          <div><span className="text-muted-foreground">{language === "th" ? "เกณฑ์ปัจจุบัน:" : "Current Scale:"}</span> <strong>4</strong>(&ge;{thresholds.grade4}%) <strong>3.5</strong>(&ge;{thresholds.grade3_5}%) <strong>3</strong>(&ge;{thresholds.grade3}%) <strong>2.5</strong>(&ge;{thresholds.grade2_5}%) <strong>2</strong>(&ge;{thresholds.grade2}%) <strong>1.5</strong>(&ge;{thresholds.grade1_5}%) <strong>1</strong>(&ge;{thresholds.grade1}%)</div>
        </div>

        {classroomStudents.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Calculator className="h-12 w-12 mx-auto mb-2 text-muted/60" />
            <p className="text-sm font-bold text-foreground">{language === "th" ? "ยังไม่มีนักเรียนในห้องนี้" : "No students in this classroom"}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24 px-6">{t("rollNumberCol")}</TableHead>
                  <TableHead className="min-w-[150px] px-6">{t("studentNameCol")}</TableHead>
                  {classroomChapters.map(ch => (
                    <TableHead key={ch.id} className="text-center px-4 min-w-[100px]">
                      <div className="truncate text-xs font-bold">{ch.chapterName}</div>
                      <div className="text-[10px] text-muted-foreground font-normal">({ch.totalScore})</div>
                    </TableHead>
                  ))}
                  <TableHead className="text-center px-6 min-w-[100px] bg-primary/5 text-primary font-black">
                    {language === "th" ? "คะแนนรวม" : "Total"}
                  </TableHead>
                  <TableHead className="text-center px-6 w-32">{language === "th" ? "เกรด" : "Grade"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classroomStudents.map((student) => {
                  const total = studentTotals[student.id] || 0;
                  const gradeInfo = getGrade(total);

                  return (
                    <TableRow key={student.id}>
                      <TableCell className="font-bold text-foreground text-sm px-6">{student.rollNumber}</TableCell>
                      <TableCell className="font-bold text-foreground text-sm px-6">{student.name}</TableCell>
                      
                      {classroomChapters.map(ch => (
                        <TableCell key={ch.id} className="text-center px-4 text-xs">
                          {ch.studentScores[student.id] !== undefined ? ch.studentScores[student.id] : "-"}
                        </TableCell>
                      ))}

                      <TableCell className="text-center px-6 font-black text-primary bg-primary/5">
                        {total}
                      </TableCell>
                      <TableCell className="text-center px-6">
                        <Badge variant="outline" className={`font-bold px-3 py-1 rounded-full ${gradeInfo.color}`}>
                          {gradeInfo.grade}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
