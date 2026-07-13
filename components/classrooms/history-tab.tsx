"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/AppContext";
import { useLanguage } from "@/lib/LanguageContext";
import { CalendarDays, AlertTriangle, Check, XCircle, Clock, ChevronDown, ChevronUp, BarChart3 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface HistoryTabProps {
  classroomId: string;
}

export function HistoryTab({ classroomId }: HistoryTabProps) {
  const { students, attendance, isLoaded } = useApp();
  const { language, t } = useLanguage();

  const [expandedDate, setExpandedDate] = useState<string | null>(null);

  const classroomStudents = students
    .filter((s) => s.classroomId === classroomId)
    .sort((a, b) => Number(a.rollNumber) - Number(b.rollNumber));

  const classroomAttendance = attendance.filter((a) => a.classroomId === classroomId);

  // Get list of unique dates sorted descending
  const attendanceDates = Array.from(new Set(classroomAttendance.map((a) => a.date))).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  // Calculate statistics per student
  const studentStats = classroomStudents.map((student) => {
    const studentRecords = classroomAttendance.filter((a) => a.studentId === student.id);
    const present = studentRecords.filter((r) => r.status === "present").length;
    const absent = studentRecords.filter((r) => r.status === "absent").length;
    const late = studentRecords.filter((r) => r.status === "late").length;
    const total = studentRecords.length;
    const attendanceRate = total > 0 ? Math.round((present / total) * 100) : 100;

    return {
      student,
      present,
      absent,
      late,
      total,
      attendanceRate,
    };
  });

  // Identify students with warning: absent >= 3 or rate < 80%
  const flaggedStudents = studentStats
    .filter((s) => s.absent >= 2 || s.attendanceRate < 80)
    .sort((a, b) => b.absent - a.absent); // show highest absences first

  if (!isLoaded) return null;

  return (
    <div className="space-y-6">
      {/* 1. Weekly Statistics Dashboard (สถิติรายสัปดาห์ / สรุปผู้ขาดเยอะสายเยอะ) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Card: Warnings (นร. ที่มีอัตราขาด/สายสูง) */}
        <Card className="bg-white border shadow-sm md:col-span-1 border-rose-100 bg-rose-50/10">
          <CardHeader className="p-5 border-b border-rose-100/50">
            <CardTitle className="text-sm font-bold text-rose-700 flex items-center gap-2">
              <AlertTriangle className="h-4.5 w-4.5" />
              {language === "th" ? "นักเรียนที่ต้องเฝ้าระวัง" : "Students at Risk"}
            </CardTitle>
            <CardDescription className="text-xs text-rose-500">
              {language === "th" ? "นักเรียนที่ขาดเรียนสะสมตั้งแต่ 2 ครั้งขึ้นไป" : "Students with 2 or more absences"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5">
            {flaggedStudents.length === 0 ? (
              <p className="text-xs text-muted-foreground italic text-center py-4">
                {language === "th" ? "ไม่มีนักเรียนที่ต้องเฝ้าระวังในขณะนี้" : "No high risk students at this time."}
              </p>
            ) : (
              <div className="space-y-3">
                {flaggedStudents.map(({ student, absent, late, attendanceRate }) => (
                  <div 
                    key={student.id} 
                    className="flex items-center justify-between p-2.5 rounded-lg border border-rose-100 bg-white shadow-xs"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-foreground leading-tight">{student.name}</h4>
                      <span className="text-[10px] text-muted-foreground">เลขที่ {student.rollNumber}</span>
                    </div>
                    <div className="text-right">
                      <Badge variant="destructive" className="text-[10px] font-bold rounded-full">
                        {language === "th" ? `ขาด ${absent} ครั้ง` : `${absent} Absences`}
                      </Badge>
                      <p className="text-[9px] text-muted-foreground mt-0.5">
                        {language === "th" ? `เข้าเรียน ${attendanceRate}%` : `Rate: ${attendanceRate}%`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right Card: Overall stats table */}
        <Card className="bg-white border shadow-sm md:col-span-2">
          <CardHeader className="p-5 border-b flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                <BarChart3 className="h-4.5 w-4.5" />
                {language === "th" ? "สถิติการเข้าเรียนของนักเรียนทุกคน" : "Individual Attendance Stats"}
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                {language === "th" ? "สรุปยอด มาเรียน สาย ขาด ของภาคเรียนนี้" : "Tally of presents, lates, and absences"}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {studentStats.length === 0 ? (
              <p className="text-center py-6 text-xs text-muted-foreground italic">ไม่มีนักเรียนในระบบ</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16 px-4 py-2">{t("rollNumberCol")}</TableHead>
                    <TableHead className="px-4 py-2">{t("studentNameCol")}</TableHead>
                    <TableHead className="text-center w-20 px-2 py-2 text-emerald-600 font-bold">{t("presentBtn")}</TableHead>
                    <TableHead className="text-center w-20 px-2 py-2 text-amber-500 font-bold">{t("lateBtn")}</TableHead>
                    <TableHead className="text-center w-20 px-2 py-2 text-rose-500 font-bold">{t("absentBtn")}</TableHead>
                    <TableHead className="text-right w-24 px-4 py-2">{language === "th" ? "ร้อยละการเข้า" : "Rate %"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentStats.map(({ student, present, absent, late, attendanceRate }) => (
                    <TableRow key={student.id} className="hover:bg-muted/10">
                      <TableCell className="font-bold px-4 py-2.5 text-xs">{student.rollNumber}</TableCell>
                      <TableCell className="font-bold px-4 py-2.5 text-xs">{student.name}</TableCell>
                      <TableCell className="text-center px-2 py-2.5 text-xs font-semibold">{present}</TableCell>
                      <TableCell className="text-center px-2 py-2.5 text-xs font-semibold">{late}</TableCell>
                      <TableCell className="text-center px-2 py-2.5 text-xs font-semibold text-rose-600">{absent}</TableCell>
                      <TableCell className="text-right px-4 py-2.5 text-xs font-bold">
                        <span className={attendanceRate < 80 ? "text-rose-600" : "text-emerald-600"}>
                          {attendanceRate}%
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 2. Daily Log / Archive (ประวัติเช็กชื่อย้อนหลังรายวัน) */}
      <Card className="bg-white border shadow-sm">
        <CardHeader className="p-6 border-b">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            {language === "th" ? "บันทึกประวัติการเช็กชื่อย้อนหลัง" : "Attendance Daily Archives"}
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            {language === "th" ? "เลือกวันที่ที่เคยเช็กชื่อเพื่อตรวจสอบรายชื่อนักเรียนในวันนั้น" : "Select a date to expand historical daily logs."}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          {attendanceDates.length === 0 ? (
            <p className="text-center py-8 text-sm text-muted-foreground italic">
              {language === "th" ? "ยังไม่มีบันทึกประวัติการเช็กชื่อสำหรับห้องนี้" : "No daily records exist for this classroom yet."}
            </p>
          ) : (
            attendanceDates.map((date) => {
              const dayRecords = classroomAttendance.filter((a) => a.date === date);
              const presentCount = dayRecords.filter((r) => r.status === "present").length;
              const lateCount = dayRecords.filter((r) => r.status === "late").length;
              const absentCount = dayRecords.filter((r) => r.status === "absent").length;
              const isExpanded = expandedDate === date;

              return (
                <div 
                  key={date} 
                  className="border rounded-xl bg-white overflow-hidden transition-all shadow-xs"
                >
                  {/* Date Header Accordion Trigger */}
                  <div 
                    onClick={() => setExpandedDate(isExpanded ? null : date)}
                    className="flex items-center justify-between p-4 bg-muted/10 hover:bg-muted/30 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <CalendarDays className="h-4.5 w-4.5 text-zinc-500" />
                      <span className="font-bold text-sm text-foreground">{date}</span>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Count Overview Badges */}
                      <div className="hidden sm:flex gap-2">
                        <Badge className="bg-emerald-500/10 text-emerald-600 border-none font-bold text-[10px]">
                          มา {presentCount}
                        </Badge>
                        <Badge className="bg-amber-500/10 text-amber-600 border-none font-bold text-[10px]">
                          สาย {lateCount}
                        </Badge>
                        <Badge className="bg-rose-500/10 text-rose-600 border-none font-bold text-[10px]">
                          ขาด {absentCount}
                        </Badge>
                      </div>
                      {isExpanded ? <ChevronUp className="h-4 w-4 text-zinc-400" /> : <ChevronDown className="h-4 w-4 text-zinc-400" />}
                    </div>
                  </div>

                  {/* Expanded Table view */}
                  {isExpanded && (
                    <div className="p-4 border-t bg-slate-50/20 animate-fadeIn">
                      <Table>
                        <TableHeader>
                          <TableRow className="hover:bg-transparent">
                            <TableHead className="w-16">เลขที่</TableHead>
                            <TableHead>ชื่อนักเรียน</TableHead>
                            <TableHead className="text-right w-36">สถานะเข้าเรียน</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {classroomStudents.map((st) => {
                            const rec = dayRecords.find((r) => r.studentId === st.id);
                            const status = rec ? rec.status : "present";
                            return (
                              <TableRow key={st.id} className="hover:bg-transparent">
                                <TableCell className="font-bold text-xs">{st.rollNumber}</TableCell>
                                <TableCell className="font-bold text-xs">{st.name}</TableCell>
                                <TableCell className="text-right">
                                  {status === "present" && (
                                    <span className="inline-flex items-center text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                                      {t("presentBtn")}
                                    </span>
                                  )}
                                  {status === "late" && (
                                    <span className="inline-flex items-center text-[10px] font-black text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">
                                      {t("lateBtn")}
                                    </span>
                                  )}
                                  {status === "absent" && (
                                    <span className="inline-flex items-center text-[10px] font-black text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-full">
                                      {t("absentBtn")}
                                    </span>
                                  )}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}
