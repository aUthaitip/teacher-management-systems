"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/lib/AppContext";
import { useLanguage } from "@/lib/LanguageContext";
import { Save, CalendarDays, CheckCircle, XCircle, Clock, Users, Send } from "lucide-react";
import { sendTelegramMessage } from "@/lib/telegram";
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
  const { students, attendance, saveAttendance, isLoaded, currentTeacher, classrooms, subjects } = useApp();
  const { t } = useLanguage();
  const [attendanceDate, setAttendanceDate] = useState<string>("");
  const [attendanceRecords, setAttendanceRecords] = useState<{ [studentId: string]: { status: "present" | "absent" | "late", reason?: "leave_personal" | "leave_sick" | "no_show" } }>({});
  const [isSendingTelegram, setIsSendingTelegram] = useState(false);

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
      const initial: { [studentId: string]: { status: "present" | "absent" | "late", reason?: "leave_personal" | "leave_sick" | "no_show" } } = {};
      
      classroomStudents.forEach((st) => {
        const record = saved.find((s) => s.studentId === st.id);
        initial[st.id] = { status: record ? record.status : "present", reason: record?.reason };
      });
      setAttendanceRecords(initial);
    }
  }, [attendanceDate, classroomId, attendance, students]);

  const handleAttendanceChange = (studentId: string, status: "present" | "absent" | "late", reason?: "leave_personal" | "leave_sick" | "no_show") => {
    setAttendanceRecords((prev) => {
      const current = prev[studentId];
      if (status === "absent" && !reason) {
        // Default reason when absent is clicked without specific reason
        return { ...prev, [studentId]: { status, reason: current?.reason || "no_show" } };
      }
      return { ...prev, [studentId]: { status, reason: status === "absent" ? reason : undefined } };
    });
  };

  const handleSave = () => {
    const records = Object.entries(attendanceRecords).map(([studentId, data]) => ({
      studentId,
      status: data.status,
      reason: data.reason,
    }));
    saveAttendance(attendanceDate, classroomId, records);
    alert(t("attendanceSavedAlert"));
  };

  const handleSendTelegramNotifications = async () => {
    if (!currentTeacher?.telegramBotToken) {
      alert("กรุณาตั้งค่า Telegram Bot Token ในหน้าโปรไฟล์ของคุณก่อน");
      return;
    }

    const connectedStudents = classroomStudents.filter(s => s.parentTelegramChatId);
    if (connectedStudents.length === 0) {
      alert("ไม่มีนักเรียนที่เชื่อมต่อ Telegram ของผู้ปกครองในห้องเรียนนี้");
      return;
    }

    if (!confirm(`คุณต้องการส่งแจ้งเตือนการเข้าเรียน ไปยังผู้ปกครองที่เชื่อมต่อแล้วจำนวน ${connectedStudents.length} คน ใช่หรือไม่?`)) {
      return;
    }

    setIsSendingTelegram(true);
    let successCount = 0;
    let failCount = 0;

    const classroom = classrooms.find(c => c.id === classroomId);
    const subject = subjects.find(s => s.id === classroom?.subjectId);

    for (const student of connectedStudents) {
      const record = attendanceRecords[student.id];
      const status = record?.status || "present";
      
      
      const statusText = status === 'present' ? '✅ มาเรียน' : status === 'late' ? '⚠️ มาสาย' : '❌ ขาดเรียน';
      let reasonText = '';
      if (status === 'absent' && record?.reason) {
         reasonText = record.reason === 'leave_personal' ? '(ลากิจ)' : record.reason === 'leave_sick' ? '(ลาป่วย)' : '(ไม่ทราบสาเหตุ)';
      }
      
      const message = `🔔 *แจ้งเตือนการเข้าเรียน*\n\n` +
                      `👤 *นักเรียน:* ${student.name} (เลขที่ ${student.rollNumber})\n` +
                      `📅 *วันที่:* ${attendanceDate}\n` +
                      `📝 *วิชา:* ${subject?.name || 'ไม่ระบุ'} (${classroom?.name || 'ไม่ระบุ'})\n` +
                      `📊 *สถานะ:* ${statusText} ${reasonText}\n\n` +
                      `_ส่งโดยระบบจัดการชั้นเรียนของคุณครู ${currentTeacher.name}_`;

      const success = await sendTelegramMessage(currentTeacher.telegramBotToken, student.parentTelegramChatId!, message);
      if (success) {
        successCount++;
      } else {
        failCount++;
      }
    }

    setIsSendingTelegram(false);
    alert(`ส่งข้อความสำเร็จ: ${successCount} รายการ${failCount > 0 ? `, ล้มเหลว: ${failCount} รายการ` : ""}`);
  };

  if (!isLoaded) return null;

  return (
    <Card className="bg-card border shadow-sm">
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
          <Button 
            onClick={handleSendTelegramNotifications} 
            disabled={isSendingTelegram}
            className="h-8 text-xs font-bold shadow-sm bg-sky-600 hover:bg-sky-700 text-white"
          >
            {isSendingTelegram ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                กำลังส่ง...
              </span>
            ) : (
              <>
                <Send className="h-4 w-4" />
                แจ้งผู้ปกครอง
              </>
            )}
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
                const currentStatus = attendanceRecords[student.id]?.status || "present";
                const currentReason = attendanceRecords[student.id]?.reason;
                
                return (
                  <TableRow key={student.id}>
                    <TableCell className="font-bold text-foreground text-sm px-6">{student.rollNumber}</TableCell>
                    <TableCell className="font-bold text-foreground text-sm px-6">{student.name}</TableCell>
                    <TableCell className="px-6">
                      <div className="flex flex-col gap-2">
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
                                ? "bg-amber-500 text-primary-foreground border-amber-500"
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
                        {currentStatus === "absent" && (
                          <div className="flex justify-end gap-1 animate-fadeIn">
                            <button
                              onClick={() => handleAttendanceChange(student.id, "absent", "leave_personal")}
                              className={`px-2 py-1 rounded text-[10px] font-bold border transition-colors cursor-pointer ${currentReason === "leave_personal" ? "bg-zinc-800 text-white border-zinc-800" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"}`}
                            >
                              ลากิจ
                            </button>
                            <button
                              onClick={() => handleAttendanceChange(student.id, "absent", "leave_sick")}
                              className={`px-2 py-1 rounded text-[10px] font-bold border transition-colors cursor-pointer ${currentReason === "leave_sick" ? "bg-zinc-800 text-white border-zinc-800" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"}`}
                            >
                              ป่วย
                            </button>
                            <button
                              onClick={() => handleAttendanceChange(student.id, "absent", "no_show")}
                              className={`px-2 py-1 rounded text-[10px] font-bold border transition-colors cursor-pointer ${currentReason === "no_show" ? "bg-zinc-800 text-white border-zinc-800" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"}`}
                            >
                              ไม่มา
                            </button>
                          </div>
                        )}
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
