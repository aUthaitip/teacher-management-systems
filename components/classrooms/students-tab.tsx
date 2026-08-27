"use client";

import React, { useState, useRef } from "react";
import { useApp, Student } from "@/lib/AppContext";
import { useLanguage } from "@/lib/LanguageContext";
import { Plus, Trash2, Edit, UserPlus, Users, Upload, Download, Send, RefreshCw, Link as LinkIcon, AlertTriangle } from "lucide-react";
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
import { getTelegramUpdates, TelegramUpdate } from "@/lib/telegram";

interface StudentsTabProps {
  classroomId: string;
}

export function StudentsTab({ classroomId }: StudentsTabProps) {
  const { students, addStudent, addStudentsBatch, updateStudent, deleteStudent, currentTeacher, isLoaded } = useApp();
  const { language, t } = useLanguage();
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [studentRoll, setStudentRoll] = useState("");
  const [parentTelegramChatId, setParentTelegramChatId] = useState("");
  const [parentTelegramName, setParentTelegramName] = useState("");
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  
  // Telegram integration states
  const [isTelegramModalOpen, setIsTelegramModalOpen] = useState(false);
  const [isFetchingTelegram, setIsFetchingTelegram] = useState(false);
  const [telegramUpdates, setTelegramUpdates] = useState<TelegramUpdate[]>([]);
  const [mappedMatches, setMappedMatches] = useState<Record<number, string>>({}); // update_id -> student_id

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
      updateStudent(editingStudentId, studentName, studentRoll, parentTelegramChatId, parentTelegramName);
      setEditingStudentId(null);
    } else {
      addStudent(studentName, studentRoll, classroomId, parentTelegramChatId, parentTelegramName);
    }

    setStudentName("");
    setStudentRoll("");
    setParentTelegramChatId("");
    setParentTelegramName("");
    setIsStudentModalOpen(false);
  };

  const openEditStudent = (student: Student) => {
    setEditingStudentId(student.id);
    setStudentName(student.name);
    setStudentRoll(student.rollNumber);
    setParentTelegramChatId(student.parentTelegramChatId || "");
    setParentTelegramName(student.parentTelegramName || "");
    setIsStudentModalOpen(true);
  };

  const fetchTelegramUpdates = async () => {
    if (!currentTeacher?.telegramBotToken) {
      return;
    }
    setIsFetchingTelegram(true);
    try {
      const cleanToken = currentTeacher.telegramBotToken.trim();
      const updates = await getTelegramUpdates(cleanToken);
      // Filter updates that have a private message with text
      const msgUpdates = updates.filter(u => u.message && u.message.chat.type === "private" && u.message.text);
      setTelegramUpdates(msgUpdates);
      
      // Auto-match updates to students
      const newMatches: Record<number, string> = {};
      msgUpdates.forEach(up => {
        if (up.message?.text) {
          const txt = up.message.text.trim();
          // Find matching student
          const matched = classroomStudents.find(s => 
            s.name.includes(txt) || 
            txt.includes(s.name) || 
            s.rollNumber === txt ||
            txt.includes(`เลขที่ ${s.rollNumber}`) ||
            txt.includes(`เลขที่${s.rollNumber}`)
          );
          if (matched) {
            newMatches[up.update_id] = matched.id;
          }
        }
      });
      setMappedMatches(newMatches);
    } catch (error) {
      console.error(error);
      alert("ไม่สามารถดึงข้อมูลจาก Telegram ได้: " + (error instanceof Error ? error.message : String(error)));
    } finally {
      setIsFetchingTelegram(false);
    }
  };

  const handleLinkTelegram = (update: TelegramUpdate, studentId: string) => {
    const student = classroomStudents.find(s => s.id === studentId);
    if (!student || !update.message) return;
    
    const parentName = update.message.from.first_name + (update.message.from.username ? ` (@${update.message.from.username})` : "");
    updateStudent(
      student.id,
      student.name,
      student.rollNumber,
      String(update.message.chat.id),
      parentName
    );
    
    // update local mappings if any
    setTelegramUpdates(prev => prev.filter(u => u.update_id !== update.update_id));
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

          <Dialog open={isTelegramModalOpen} onOpenChange={(open) => { setIsTelegramModalOpen(open); if(open) fetchTelegramUpdates(); }}>
            <DialogTrigger className="flex h-8 items-center justify-center rounded-md border border-sky-500 bg-sky-50 text-sky-700 hover:bg-sky-100 px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer shadow-sm">
              <Send className="h-3.5 w-3.5 mr-1 text-sky-600 fill-sky-100" />
              เชื่อมโยง Telegram
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold flex items-center gap-2 text-sky-700">
                  <Send className="h-5 w-5 fill-sky-500 text-sky-500" />
                  เชื่อมโยง Telegram ผู้ปกครอง (วิธีที่ 2)
                </DialogTitle>
                <DialogDescription className="text-xs">
                  ระบบจะค้นหาข้อความจาก Telegram Bot ของคุณครู เพื่อดึง Chat ID ของผู้ปกครองที่พิมพ์ชื่อนักเรียนเข้ามาผูกให้โดยอัตโนมัติ
                </DialogDescription>
              </DialogHeader>

              {!currentTeacher?.telegramBotToken ? (
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200 text-amber-800 flex gap-2 text-xs">
                  <AlertTriangle className="h-5 w-5 shrink-0" />
                  <div>
                    <strong>ไม่พบการตั้งค่าบอท:</strong> คุณครูยังไม่ได้ตั้งค่า Telegram Bot Token กรุณาไปตั้งค่าที่หน้า <strong>โปรไฟล์ของฉัน</strong> ก่อนใช้งานฟีเจอร์นี้
                  </div>
                </div>
              ) : (
                <div className="space-y-4 py-2">
                  <div className="bg-sky-50 p-3 rounded-lg border border-sky-100 text-[11px] text-sky-850 space-y-1">
                    <p className="font-bold text-sky-800">ขั้นตอนสำหรับผู้ปกครอง:</p>
                    <ol className="list-decimal pl-4 space-y-0.5 text-sky-700 font-semibold">
                      <li>ให้ผู้ปกครองกด Start หรือคุยกับบอทของคุณครู</li>
                      <li>ให้พิมพ์ <strong>ชื่อ หรือ เลขที่</strong> ของลูกส่งมาในแชทบอท</li>
                      <li>คุณครูกดปุ่ม <strong>"ดึงข้อมูลล่าสุด"</strong> ด้านล่างเพื่ออัปเดต</li>
                    </ol>
                  </div>

                  <div className="flex items-center justify-between border-b pb-2">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase">ข้อความล่าสุดที่ตรวจพบ</h4>
                    <Button 
                      onClick={fetchTelegramUpdates} 
                      disabled={isFetchingTelegram}
                      variant="outline"
                      size="sm"
                      className="h-7 text-[10px]"
                    >
                      <RefreshCw className={`h-3 w-3 mr-1 ${isFetchingTelegram ? "animate-spin" : ""}`} />
                      ดึงข้อมูลล่าสุด
                    </Button>
                  </div>

                  <div className="max-h-[220px] overflow-y-auto space-y-2 pr-1">
                    {telegramUpdates.length === 0 ? (
                      <p className="text-center py-6 text-xs text-muted-foreground italic">ไม่พบข้อความใหม่ หรือแชทล่าสุด กรุณาลองให้ผู้ปกครองส่งข้อความหาบอทแล้วกดดึงข้อมูลอีกครั้ง</p>
                    ) : (
                      telegramUpdates.map((up) => {
                        const matchedStudentId = mappedMatches[up.update_id] || "";
                        const senderName = up.message?.from.first_name || "Unknown Sender";
                        const msgText = up.message?.text || "";
                        
                        return (
                          <div key={up.update_id} className="p-2.5 border rounded-lg bg-card flex flex-col gap-2 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-foreground">จาก: {senderName}</span>
                              <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">ID: {up.message?.chat.id}</span>
                            </div>
                            <div className="p-1.5 bg-muted/40 rounded italic text-foreground/90">
                              ข้อความ: "{msgText}"
                            </div>
                            <div className="flex items-center gap-2 border-t pt-2 mt-1">
                              <label className="text-[10px] text-muted-foreground font-semibold shrink-0">ผูกกับนักเรียน:</label>
                              <select 
                                value={matchedStudentId}
                                onChange={(e) => setMappedMatches(prev => ({ ...prev, [up.update_id]: e.target.value }))}
                                className="flex-1 text-[11px] h-7 rounded border border-input bg-background px-2 py-0.5"
                              >
                                <option value="">-- กรุณาเลือกนักเรียน --</option>
                                {classroomStudents.map(s => (
                                  <option key={s.id} value={s.id}>เลขที่ {s.rollNumber} - {s.name}</option>
                                ))}
                              </select>
                              <Button 
                                disabled={!matchedStudentId}
                                onClick={() => handleLinkTelegram(up, matchedStudentId)}
                                size="sm" 
                                className="h-7 text-[10px] font-bold bg-sky-600 hover:bg-sky-700 text-white"
                              >
                                <LinkIcon className="h-3 w-3 mr-1" />
                                ผูกบัญชี
                              </Button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
              
              <DialogFooter className="border-t pt-3">
                <Button variant="outline" size="sm" onClick={() => setIsTelegramModalOpen(false)}>ปิดหน้าต่าง</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

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
              <div className="space-y-1 border-t pt-2 mt-2">
                <label className="text-xs font-bold text-primary flex items-center gap-1">
                  <Send className="h-3.5 w-3.5" />
                  Telegram Chat ID (ผู้ปกครอง)
                </label>
                <Input
                  placeholder="เช่น 987654321 (เว้นว่างไว้หากยังไม่เชื่อมต่อ)"
                  value={parentTelegramChatId}
                  onChange={(e) => setParentTelegramChatId(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase">ชื่อผู้ปกครองใน Telegram</label>
                <Input
                  placeholder="เช่น Somchai (@somchai_p)"
                  value={parentTelegramName}
                  onChange={(e) => setParentTelegramName(e.target.value)}
                />
              </div>
              <DialogFooter className="pt-4 gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => { 
                    setIsStudentModalOpen(false); 
                    setEditingStudentId(null); 
                    setStudentName(""); 
                    setStudentRoll(""); 
                    setParentTelegramChatId("");
                    setParentTelegramName("");
                  }}
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
                <TableHead className="px-6">Telegram ผู้ปกครอง</TableHead>
                <TableHead className="text-right w-36 px-6">{t("manageCol")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classroomStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-bold text-foreground text-sm px-6">{student.rollNumber}</TableCell>
                  <TableCell className="font-bold text-foreground text-sm px-6">{student.name}</TableCell>
                  <TableCell className="text-sm px-6">
                    {student.parentTelegramChatId ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 shadow-sm">
                        <Send className="h-3 w-3 text-emerald-500 fill-emerald-500" />
                        {student.parentTelegramName || student.parentTelegramChatId}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground italic">ยังไม่ได้เชื่อมต่อ</span>
                    )}
                  </TableCell>
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
