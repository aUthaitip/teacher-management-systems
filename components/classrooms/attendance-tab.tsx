"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/lib/AppContext";
import { useLanguage } from "@/lib/LanguageContext";
import { Save, CalendarDays, CheckCircle, XCircle, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AttendanceTabProps {
  classroomId: string;
}

export function AttendanceTab({ classroomId }: AttendanceTabProps) {
  const { students, attendance, saveAttendance, isLoaded } = useApp();
  const { t } = useLanguage();
  const [attendanceDate, setAttendanceDate] = useState<string>("");
  const [attendanceRecords, setAttendanceRecords] = useState<{ [studentId: string]: "present" | "absent" | "late" }>({});

  const classroomStudents = students
    .filter((s) => s.classroomId === classroomId)
    .sort((a, b) => Number(a.rollNumber) - Number(b.rollNumber));

  useEffect(() => {
    if (!attendanceDate) {
      setAttendanceDate(new Date().toISOString().split("T")[0]);
    }
  }, [attendanceDate]);

  useEffect(() => {
    if (attendanceDate && classroomId && attendance) {
      const saved = attendance.filter((a) => a.date === attendanceDate && a.classroomId === classroomId);
      const initial: { [studentId: string]: "present" | "absent" | "late" } = {};
      
      classroomStudents.forEach((st) => {
        const record = saved.find((s) => s.studentId === st.id);
        initial[st.id] = record ? record.status : "present";
      });
      setAttendanceRecords(initial);
    }
  }, [attendanceDate, classroomId, attendance, students]);

  const handleAttendanceChange = (studentId: string, status: "present" | "absent" | "late") => {
    setAttendanceRecords((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleSave = () => {
    const records = Object.entries(attendanceRecords).map(([studentId, status]) => ({
      studentId,
      status,
    }));
    saveAttendance(attendanceDate, classroomId, records);
    alert(t("attendanceSavedAlert"));
  };

  if (!isLoaded) return null;

  return (
    <Card className="bg-white border shadow-sm">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 border-b">
        <div>
          <CardTitle className="text-lg font-bold text-foreground">{t("dailyAttendance")}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">{t("attendanceDesc")}</CardDescription>
        </div>
        <div className="flex items-center gap-3">
          <Input
            type="date"
            className="w-40"
            value={attendanceDate}
            onChange={(e) => setAttendanceDate(e.target.value)}
          />
          <Button onClick={handleSave} className="flex items-center gap-1.5 text-sm h-8 cursor-pointer">
            <Save className="h-4 w-4" />
            {t("saveAttendance")}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {classroomStudents.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Users className="h-10 w-10 mx-auto mb-2 text-muted/60" />
            <p className="text-sm font-semibold">{t("noStudentsAttendance")}</p>
            <p className="text-xs">{t("pleaseRegisterStudents")}</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20 px-6">{t("rollNumberCol")}</TableHead>
                <TableHead className="px-6">{t("studentNameCol")}</TableHead>
                <TableHead className="text-center w-80 px-6">{t("attendanceStatusCol")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classroomStudents.map((student) => {
                const currentStatus = attendanceRecords[student.id] || "present";
                return (
                  <TableRow key={student.id}>
                    <TableCell className="font-bold text-foreground text-sm px-6">{student.rollNumber}</TableCell>
                    <TableCell className="font-bold text-foreground text-sm px-6">{student.name}</TableCell>
                    <TableCell className="px-6">
                      <div className="flex justify-center gap-1">
                        <button
                          onClick={() => handleAttendanceChange(student.id, "present")}
                          className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                            currentStatus === "present"
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-background border text-muted-foreground hover:bg-muted/30"
                          }`}
                        >
                          <CheckCircle className="h-3.5 w-3.5" />
                          {t("presentBtn")}
                        </button>
                        <button
                          onClick={() => handleAttendanceChange(student.id, "late")}
                          className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                            currentStatus === "late"
                              ? "bg-amber-500 text-white border-amber-500"
                              : "bg-background border text-muted-foreground hover:bg-muted/30"
                          }`}
                        >
                          <Clock className="h-3.5 w-3.5" />
                          {t("lateBtn")}
                        </button>
                        <button
                          onClick={() => handleAttendanceChange(student.id, "absent")}
                          className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                            currentStatus === "absent"
                              ? "bg-destructive text-destructive-foreground border-destructive"
                              : "bg-background border text-muted-foreground hover:bg-muted/30"
                          }`}
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          {t("absentBtn")}
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
