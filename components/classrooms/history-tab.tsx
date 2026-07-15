"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/AppContext";
import { useLanguage } from "@/lib/LanguageContext";
import { CalendarDays, AlertTriangle, Check, XCircle, Clock, ChevronDown, ChevronUp, BarChart3, PieChart as PieChartIcon } from "lucide-react";
import { BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts";
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
  const [selectedHistoryDate, setSelectedHistoryDate] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);

  const classroomStudents = students
    .filter((s) => s.classroomId === classroomId)
    .sort((a, b) => Number(a.rollNumber) - Number(b.rollNumber));

  const classroomAttendance = attendance.filter((a) => a.classroomId === classroomId);

  const getTermFromDate = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const year = d.getFullYear();
    const month = d.getMonth() + 1; // 1-12
    
    let term = 1;
    let academicYear = year + 543; // Thai year
    
    // Term 1: May (5) to Oct (10)
    // Term 2: Nov (11) to Apr (4)
    if (month >= 5 && month <= 10) {
      term = 1;
    } else if (month >= 11 || month <= 4) {
      term = 2;
      if (month <= 4) academicYear -= 1; // Jan-Apr belongs to the previous academic year
    }
    
    return {
      label: language === "th" ? `ภาคเรียนที่ ${term}/${academicYear}` : `Term ${term}/${academicYear}`,
      value: `${academicYear}-${term}` // For proper sorting
    };
  };

  // Generate the last 4 terms as default options so the dropdown is always selectable
  const generateRecentTerms = () => {
    const terms = [];
    const d = new Date();
    let currentYear = d.getFullYear() + 543;
    let currentMonth = d.getMonth() + 1;
    
    let startTerm = 1;
    if (currentMonth >= 11 || currentMonth <= 4) {
      startTerm = 2;
      if (currentMonth <= 4) currentYear -= 1;
    }
    
    for (let i = 0; i < 4; i++) {
      let t = startTerm - (i % 2);
      let y = currentYear - Math.floor(i / 2);
      if (t <= 0) {
        t += 2;
        y -= 1;
      }
      terms.push({
        label: language === "th" ? `ภาคเรียนที่ ${t}/${y}` : `Term ${t}/${y}`,
        value: `${y}-${t}`
      });
    }
    return terms;
  };

  // Get available terms (combine data terms and recent terms)
  const dataTerms = classroomAttendance.map(a => getTermFromDate(a.date)).filter(t => t !== "");
  const allTerms = [...generateRecentTerms(), ...dataTerms];
  
  // Deduplicate and sort chronologically (newest first)
  const uniqueTermsMap = new Map();
  allTerms.forEach(t => uniqueTermsMap.set(t.value, t.label));
  
  const availableTerms = Array.from(uniqueTermsMap.entries())
    .map(([value, label]) => ({ value, label }))
    .sort((a, b) => b.value.localeCompare(a.value))
    .map(t => t.label);

  const activeTerm = selectedTerm || (availableTerms.length > 0 ? availableTerms[0] : null);

  // Filter attendance by selected term for overall stats
  const termAttendance = activeTerm 
    ? classroomAttendance.filter(a => getTermFromDate(a.date).label === activeTerm)
    : classroomAttendance;

  // Get list of unique dates sorted descending
  const attendanceDates = Array.from(new Set(classroomAttendance.map((a) => a.date))).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );
  
  const activeHistoryDate = selectedHistoryDate || (attendanceDates.length > 0 ? attendanceDates[0] : null);

  // Calculate statistics per student
  const studentStats = classroomStudents.map((student) => {
    const studentRecords = termAttendance.filter((a) => a.studentId === student.id);
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

  // Get list of available months
  const availableMonths = Array.from(new Set(classroomAttendance.map(a => a.date.substring(0, 7)))).sort().reverse();
  
  const activeMonth = selectedMonth || (availableMonths.length > 0 ? availableMonths[0] : null);

  let pieData: any[] = [];
  if (activeMonth) {
    const monthRecords = classroomAttendance.filter(a => a.date.startsWith(activeMonth));
    const totalP = monthRecords.filter(a => a.status === "present").length;
    const totalL = monthRecords.filter(a => a.status === "late").length;
    const totalA = monthRecords.filter(a => a.status === "absent").length;
    const total = monthRecords.length;

    if (total > 0) {
      pieData = [
        { name: language === "th" ? "มาเรียน" : "Present", value: totalP, percentage: Math.round((totalP/total)*100), color: "#10b981" },
        { name: language === "th" ? "มาสาย" : "Late", value: totalL, percentage: Math.round((totalL/total)*100), color: "#f59e0b" },
        { name: language === "th" ? "ขาดเรียน" : "Absent", value: totalA, percentage: Math.round((totalA/total)*100), color: "#e11d48" }
      ];
    }
  }

  if (!isLoaded) return null;

  return (
    <div className="space-y-6">
      {/* 1. Weekly Statistics Dashboard (สถิติรายสัปดาห์ / สรุปผู้ขาดเยอะสายเยอะ) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Card: Warnings (นร. ที่มีอัตราขาด/สายสูง) */}
        <Card className="bg-card border shadow-sm md:col-span-1 border-rose-100 bg-rose-50/10">
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
                    className="flex items-center justify-between p-2.5 rounded-lg border border-rose-100 bg-card shadow-xs"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-foreground leading-tight">{student.name}</h4>
                      <span className="text-[10px] text-muted-foreground">{language === "th" ? "เลขที่" : "No."} {student.rollNumber}</span>
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
        <Card className="bg-card border shadow-sm md:col-span-2">
          <CardHeader className="p-5 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                <BarChart3 className="h-4.5 w-4.5" />
                {language === "th" ? "สถิติการเข้าเรียนของนักเรียนทุกคน" : "Individual Attendance Stats"}
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-1">
                {language === "th" ? "สรุปยอด มาเรียน สาย ขาด ประจำภาคเรียน" : "Tally of presents, lates, and absences for the term"}
              </CardDescription>
            </div>
            {availableTerms.length > 0 && (
              <select
                className="border border-border bg-card text-foreground rounded-md px-3 py-1.5 text-sm font-bold shadow-sm"
                value={activeTerm || ""}
                onChange={(e) => setSelectedTerm(e.target.value)}
              >
                {availableTerms.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            )}
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

      {/* 1.5. Monthly Statistics Graph (กราฟสถิติรายเดือน) */}
      <Card className="bg-card border shadow-sm">
        <CardHeader className="p-6 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <PieChartIcon className="h-5 w-5" />
              {language === "th" ? "สถิติการเข้าเรียนรายเดือนของห้อง" : "Monthly Classroom Statistics"}
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-1">
              {language === "th" ? "แสดงสัดส่วนร้อยละ (เปอร์เซ็นต์) ของการ มาเรียน มาสาย ขาดเรียน ของทั้งห้องในเดือนที่เลือก" : "Displays the percentage of present, late, and absent records for the selected month."}
            </CardDescription>
          </div>
          {availableMonths.length > 0 && (
            <select
              className="border border-border bg-card text-foreground rounded-md px-3 py-1.5 text-sm font-bold shadow-sm"
              value={activeMonth || ""}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              {availableMonths.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          )}
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {availableMonths.length === 0 ? (
            <p className="text-center py-8 text-sm text-muted-foreground italic">
              {language === "th" ? "ยังไม่มีข้อมูลสถิติ" : "No statistics available."}
            </p>
          ) : (
            <div className="space-y-8">
              <div className="h-[400px] w-full">
                {pieData.length === 0 ? (
                  <p className="text-center py-20 text-sm text-muted-foreground italic">
                    {language === "th" ? "ไม่มีข้อมูลการเช็กชื่อในเดือนนี้" : "No attendance data for this month."}
                  </p>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={130}
                        innerRadius={60}
                        label={({ payload }) => `${payload.name} ${payload.percentage}%`}
                        labelLine={true}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value, name, props) => {
                          const p = props.payload.percentage;
                          return [`${value} ครั้ง (${p}%)`, name];
                        }}
                        contentStyle={{ borderRadius: '8px', border: '1px solid #f0f0f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '14px', paddingTop: '20px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>

              <div className="border rounded-xl shadow-sm overflow-hidden bg-background animate-fadeIn">
                <Table>
                  <TableHeader className="bg-card">
                    <TableRow>
                      <TableHead className="w-16">{t("rollNumberCol")}</TableHead>
                      <TableHead>{t("studentNameCol")}</TableHead>
                      <TableHead className="text-center w-20 text-emerald-600 font-bold">{t("presentBtn")}</TableHead>
                      <TableHead className="text-center w-20 text-amber-500 font-bold">{t("lateBtn")}</TableHead>
                      <TableHead className="text-center w-20 text-rose-500 font-bold">{t("absentBtn")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(() => {
                      // We still want to show the student breakdown table below the chart
                      // So calculate monthStudentStats just for the table
                      const monthStudentStats = classroomStudents.map(student => {
                        const sRecords = classroomAttendance.filter((r: any) => r.studentId === student.id && r.date.startsWith(activeMonth!));
                        return { 
                          id: student.id,
                          name: student.name, 
                          rollNumber: student.rollNumber,
                          present: sRecords.filter((r: any) => r.status === "present").length, 
                          late: sRecords.filter((r: any) => r.status === "late").length, 
                          absent: sRecords.filter((r: any) => r.status === "absent").length, 
                        };
                      });
                      
                      return monthStudentStats.sort((a,b) => b.absent - a.absent || b.late - a.late).map((st) => (
                        <TableRow key={st.id} className="hover:bg-muted/10 transition-colors">
                          <TableCell className="font-bold text-xs">{st.rollNumber}</TableCell>
                          <TableCell className="font-bold text-xs">{st.name}</TableCell>
                          <TableCell className="text-center text-xs font-semibold">{st.present}</TableCell>
                          <TableCell className="text-center text-xs font-semibold">{st.late}</TableCell>
                          <TableCell className="text-center text-xs font-semibold text-rose-600">{st.absent}</TableCell>
                        </TableRow>
                      ));
                    })()}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* 2. Daily Log / Archive (ประวัติเช็กชื่อย้อนหลังรายวัน) */}
      <Card className="bg-card border shadow-sm">
        <CardHeader className="p-6 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              {language === "th" ? "บันทึกประวัติการเช็กชื่อย้อนหลังรายวัน" : "Daily Attendance Archive"}
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-1">
              {language === "th" ? "เลือกวันที่ที่เคยเช็กชื่อเพื่อตรวจสอบรายชื่อนักเรียนในวันนั้น" : "Select a date to view the attendance log for that specific day."}
            </CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
            <input 
              type="date"
              className="border border-border bg-card text-foreground rounded-md px-3 py-1.5 text-sm font-bold shadow-sm"
              value={activeHistoryDate || ""}
              onChange={(e) => setSelectedHistoryDate(e.target.value)}
            />
            {attendanceDates.length > 0 && (
              <select
                className="border border-border bg-card text-foreground rounded-md px-3 py-1.5 text-sm font-bold shadow-sm"
                value={activeHistoryDate || ""}
                onChange={(e) => setSelectedHistoryDate(e.target.value)}
              >
                {attendanceDates.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          {!activeHistoryDate || !attendanceDates.includes(activeHistoryDate) ? (
            <p className="text-center py-8 text-sm text-muted-foreground italic">
              {language === "th" ? "ไม่พบข้อมูลการเช็กชื่อในวันที่เลือก" : "No attendance records found for the selected date."}
            </p>
          ) : (
            activeHistoryDate && (
              <div className="border rounded-xl bg-card overflow-hidden transition-all shadow-xs animate-fadeIn">
                <div className="flex items-center justify-between p-4 bg-muted/10 border-b border-border">
                  <div className="flex items-center gap-2.5">
                    <CalendarDays className="h-4.5 w-4.5 text-muted-foreground" />
                    <span className="font-bold text-sm text-foreground">
                      {language === "th" ? `ข้อมูลวันที่: ${activeHistoryDate}` : `Date: ${activeHistoryDate}`}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Count Overview Badges */}
                    <div className="flex gap-2">
                      <Badge className="bg-emerald-500/10 text-emerald-600 border-none font-bold text-[10px]">
                        {language === "th" ? "มา" : "P"} {classroomAttendance.filter(a => a.date === activeHistoryDate && a.status === "present").length}
                      </Badge>
                      <Badge className="bg-amber-500/10 text-amber-600 border-none font-bold text-[10px]">
                        {language === "th" ? "สาย" : "L"} {classroomAttendance.filter(a => a.date === activeHistoryDate && a.status === "late").length}
                      </Badge>
                      <Badge className="bg-rose-500/10 text-rose-600 border-none font-bold text-[10px]">
                        {language === "th" ? "ขาด" : "A"} {classroomAttendance.filter(a => a.date === activeHistoryDate && a.status === "absent").length}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="p-0 bg-background/20">
                  <Table>
                    <TableHeader className="bg-card">
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="w-16">{t("rollNumberCol")}</TableHead>
                        <TableHead>{t("studentNameCol")}</TableHead>
                        <TableHead className="text-right w-44">{t("attendanceStatusCol")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {classroomStudents.map((st) => {
                        const rec = classroomAttendance.find((r) => r.studentId === st.id && r.date === activeHistoryDate);
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
                                <span className="inline-flex items-center text-[10px] font-black text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-full gap-1">
                                  {t("absentBtn")}
                                  {rec?.reason === "leave_personal" && ` (${language === "th" ? "ลากิจ" : "Personal"})`}
                                  {rec?.reason === "leave_sick" && ` (${language === "th" ? "ป่วย" : "Sick"})`}
                                  {rec?.reason === "no_show" && ` (${language === "th" ? "ไม่มา" : "No Show"})`}
                                </span>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )
          )}
        </CardContent>
      </Card>
    </div>
  );
}
