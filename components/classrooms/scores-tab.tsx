"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/lib/AppContext";
import { useLanguage } from "@/lib/LanguageContext";
import { Plus, Trash2, Award, Save, Check, XCircle, Send, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sendTelegramMessage } from "@/lib/telegram";

interface ScoresTabProps {
  classroomId: string;
}

export function ScoresTab({ classroomId }: ScoresTabProps) {
  const { 
    students, 
    scores, 
    addScoreChapter, 
    updateStudentScores, 
    updateScoreChapter,
    deleteScoreChapter,
    currentTeacher,
    isLoaded 
  } = useApp();
  
  const { t } = useLanguage();

  const [selectedChapterId, setSelectedChapterId] = useState<string>("");
  const [isSendingTelegram, setIsSendingTelegram] = useState(false);
  const [isChapterModalOpen, setIsChapterModalOpen] = useState(false);
  const [newChapterName, setNewChapterName] = useState("");
  const [newTotalScore, setNewTotalScore] = useState<number>(100);
  const [newPassingScore, setNewPassingScore] = useState<number>(60);

  // Edit chapter states
  const [isEditChapterModalOpen, setIsEditChapterModalOpen] = useState(false);
  const [editChapterName, setEditChapterName] = useState("");
  const [editTotalScore, setEditTotalScore] = useState<number>(100);
  const [editPassingScore, setEditPassingScore] = useState<number>(60);

  const [currentChapterScores, setCurrentChapterScores] = useState<{ [studentId: string]: number }>({});
  const [scoreErrors, setScoreErrors] = useState<{ [studentId: string]: string }>({});

  const classroomStudents = students
    .filter((s) => s.classroomId === classroomId)
    .sort((a, b) => Number(a.rollNumber) - Number(b.rollNumber));

  const classroomChapters = scores.filter((s) => s.classroomId === classroomId);
  const currentChapter = scores.find((s) => s.id === selectedChapterId);

  useEffect(() => {
    if (classroomChapters.length > 0 && !selectedChapterId) {
      setSelectedChapterId(classroomChapters[0].id);
    }
  }, [scores, classroomId, selectedChapterId, classroomChapters]);

  useEffect(() => {
    if (currentChapter) {
      const initialScores: { [studentId: string]: number } = {};
      classroomStudents.forEach((st) => {
        initialScores[st.id] = currentChapter.studentScores[st.id] !== undefined ? currentChapter.studentScores[st.id] : 0;
      });
      setCurrentChapterScores(initialScores);
      setScoreErrors({});
    }
  }, [selectedChapterId, scores, students]);

  const handleAddChapter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChapterName || newTotalScore <= 0 || newPassingScore <= 0) return;

    addScoreChapter(newChapterName, newTotalScore, newPassingScore, classroomId);
    setNewChapterName("");
    setNewTotalScore(100);
    setNewPassingScore(60);
    setIsChapterModalOpen(false);
  };

  const handleOpenEditModal = () => {
    if (!currentChapter) return;
    setEditChapterName(currentChapter.chapterName);
    setEditTotalScore(currentChapter.totalScore);
    setEditPassingScore(currentChapter.passingScore);
    setIsEditChapterModalOpen(true);
  };

  const handleEditChapter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentChapter || !editChapterName || editTotalScore <= 0 || editPassingScore <= 0) return;

    updateScoreChapter(currentChapter.id, editChapterName, editTotalScore, editPassingScore);
    setIsEditChapterModalOpen(false);
  };

  const handleScoreChange = (studentId: string, val: string, maxScore: number) => {
    const num = Number(val);
    if (isNaN(num)) return;
    
    if (num > maxScore) {
      setScoreErrors(prev => ({ ...prev, [studentId]: `${t("scoreLimitAlert")} ${maxScore}` }));
    } else {
      setScoreErrors(prev => {
        const next = { ...prev };
        delete next[studentId];
        return next;
      });
    }

    setCurrentChapterScores((prev) => ({ ...prev, [studentId]: num }));
  };

  const handleSaveScores = () => {
    if (Object.keys(scoreErrors).length > 0) {
      alert("กรุณาแก้ไขข้อผิดพลาดก่อนบันทึก");
      return;
    }
    updateStudentScores(selectedChapterId, currentChapterScores);
    alert(t("scoresSavedAlert"));
  };

  const handleSendTelegramNotifications = async () => {
    if (!currentChapter) return;
    if (!currentTeacher?.telegramBotToken) {
      alert("กรุณาตั้งค่า Telegram Bot Token ในหน้าโปรไฟล์ของคุณก่อน");
      return;
    }

    const connectedStudents = classroomStudents.filter(s => s.parentTelegramChatId);
    if (connectedStudents.length === 0) {
      alert("ไม่มีนักเรียนที่เชื่อมต่อ Telegram ของผู้ปกครองในห้องเรียนนี้");
      return;
    }

    if (!confirm(`คุณต้องการส่งแจ้งเตือนคะแนนวิชาเรียนบทนี้ ไปยังผู้ปกครองที่เชื่อมต่อแล้วจำนวน ${connectedStudents.length} คน ใช่หรือไม่?`)) {
      return;
    }

    setIsSendingTelegram(true);
    let successCount = 0;
    let failCount = 0;

    for (const student of connectedStudents) {
      const score = currentChapterScores[student.id] !== undefined ? currentChapterScores[student.id] : 0;
      const isPassed = score >= currentChapter.passingScore;
      const message = `🔔 *แจ้งเตือนคะแนนสอบห้องเรียน*\n\n` +
        `👤 *นักเรียน:* ${student.name} (เลขที่ ${student.rollNumber})\n` +
        `📚 *บทเรียน/การประเมิน:* ${currentChapter.chapterName}\n` +
        `📝 *คะแนนที่ได้:* *${score}* / ${currentChapter.totalScore} คะแนน\n` +
        `📊 *ผลการประเมิน:* ${isPassed ? "🟢 *ผ่านเกณฑ์*" : "🔴 *ไม่ผ่านเกณฑ์*"}\n\n` +
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <label className="text-sm font-bold text-muted-foreground shrink-0">{t("chapterLabel")}</label>
          {classroomChapters.length > 0 ? (
            <Select value={selectedChapterId} onValueChange={(val) => setSelectedChapterId(val || "")}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="เลือกบทเรียน" />
              </SelectTrigger>
              <SelectContent>
                {classroomChapters.map((ch) => (
                  <SelectItem key={ch.id} value={ch.id}>
                    {ch.chapterName} ({ch.passingScore}/{ch.totalScore} {t("passingScoreMin")})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <span className="text-sm text-muted-foreground italic">{t("noChaptersYet")}</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {currentChapter && (
            <>
              <Dialog open={isEditChapterModalOpen} onOpenChange={setIsEditChapterModalOpen}>
                <DialogTrigger 
                  onClick={handleOpenEditModal}
                  className="flex h-8 items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary/10 transition-colors cursor-pointer shadow-sm"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  แก้ไขบทเรียน
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle className="text-lg font-bold flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      แก้ไขบทเรียน/การประเมิน
                    </DialogTitle>
                    <DialogDescription>
                      ปรับเปลี่ยนข้อมูลชื่อบทเรียน คะแนนเต็ม หรือเกณฑ์ผ่านสำหรับการประเมินนี้
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleEditChapter} className="space-y-4 py-2">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-muted-foreground uppercase">{t("chapterName") || "ชื่อการประเมิน"}</label>
                      <Input
                        placeholder={t("chapterNamePl")}
                        value={editChapterName}
                        onChange={(e) => setEditChapterName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-muted-foreground uppercase">{t("totalScoreLabel")}</label>
                        <Input
                          type="number"
                          min="1"
                          value={editTotalScore}
                          onChange={(e) => {
                            setEditTotalScore(Number(e.target.value));
                            setEditPassingScore(Math.ceil(Number(e.target.value) * 0.6));
                          }}
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-muted-foreground uppercase">{t("passingScoreLabel")}</label>
                        <Input
                          type="number"
                          min="1"
                          value={editPassingScore}
                          onChange={(e) => setEditPassingScore(Number(e.target.value))}
                          required
                        />
                      </div>
                    </div>
                    <DialogFooter className="pt-4 gap-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsEditChapterModalOpen(false)}
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

              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  if(confirm("คุณต้องการลบแบบทดสอบนี้ใช่หรือไม่? คะแนนทั้งหมดจะหายไป")) {
                    deleteScoreChapter(currentChapter.id);
                    setSelectedChapterId("");
                  }
                }}
                className="text-destructive hover:bg-destructive/10 hover:text-destructive font-bold text-xs"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                {t("deleteChapterBtn")}
              </Button>
            </>
          )}

          <Dialog open={isChapterModalOpen} onOpenChange={setIsChapterModalOpen}>
            <DialogTrigger className="flex h-8 items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer shadow">
              <Plus className="h-4 w-4 mr-1" />
              {t("addChapterBtn")}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  {t("addChapterTitle")}
                </DialogTitle>
                <DialogDescription>
                  {t("addChapterDesc")}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddChapter} className="space-y-4 py-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">{t("chapterName") || "ชื่อการประเมิน"}</label>
                  <Input
                    placeholder={t("chapterNamePl")}
                    value={newChapterName}
                    onChange={(e) => setNewChapterName(e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground uppercase">{t("totalScoreLabel")}</label>
                    <Input
                      type="number"
                      min="1"
                      value={newTotalScore}
                      onChange={(e) => {
                        setNewTotalScore(Number(e.target.value));
                        setNewPassingScore(Math.ceil(Number(e.target.value) * 0.6));
                      }}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground uppercase">{t("passingScoreLabel")}</label>
                    <Input
                      type="number"
                      min="1"
                      value={newPassingScore}
                      onChange={(e) => setNewPassingScore(Number(e.target.value))}
                      required
                    />
                  </div>
                </div>
                <DialogFooter className="pt-4 gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => { setIsChapterModalOpen(false); setNewChapterName(""); }}
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
      </div>

      {currentChapter ? (
        <Card className="bg-card border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between p-6 border-b">
            <div>
              <CardTitle className="text-lg font-bold">{currentChapter.chapterName}</CardTitle>
              <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                <span>{t("totalScoreLabel")}: <strong className="text-foreground">{currentChapter.totalScore}</strong> {t("passingScoreMin")}</span>
                <span>{t("passingMinLabel")} <strong className="text-primary font-bold">&ge; {currentChapter.passingScore}</strong> {t("passingScoreMin")}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleSendTelegramNotifications} 
                disabled={isSendingTelegram}
                className="flex items-center gap-1 text-sm h-8 bg-sky-600 hover:bg-sky-700 text-white font-bold"
              >
                <Send className="h-4 w-4" />
                {isSendingTelegram ? "กำลังส่ง..." : "ส่งคะแนนเข้า Telegram"}
              </Button>
              <Button onClick={handleSaveScores} className="flex items-center gap-1 text-sm h-8">
                <Save className="h-4 w-4" />
                {t("saveScoresBtn")}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {classroomStudents.length === 0 ? (
              <p className="text-center py-10 text-muted-foreground">{t("noStudentsScores")}</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20 px-6">{t("rollNumberCol")}</TableHead>
                    <TableHead className="px-6">{t("studentNameCol")}</TableHead>
                    <TableHead className="text-center w-60 px-6">{t("scoreCol")}</TableHead>
                    <TableHead className="text-center w-40 px-6">{t("evaluationCol")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classroomStudents.map((student) => {
                    const score = currentChapterScores[student.id] !== undefined ? currentChapterScores[student.id] : 0;
                    const isPassed = score >= currentChapter.passingScore;
                    const error = scoreErrors[student.id];

                    return (
                      <TableRow key={student.id}>
                        <TableCell className="font-bold text-foreground text-sm px-6">{student.rollNumber}</TableCell>
                        <TableCell className="font-bold text-foreground text-sm px-6">{student.name}</TableCell>
                        <TableCell className="text-center px-6">
                          <div className="inline-flex flex-col items-center">
                            <div className="inline-flex items-center gap-2">
                              <Input
                                type="number"
                                min="0"
                                max={currentChapter.totalScore}
                                value={score}
                                onChange={(e) => handleScoreChange(student.id, e.target.value, currentChapter.totalScore)}
                                className={`w-24 text-center font-bold h-8 ${
                                  error ? "border-destructive focus-visible:ring-destructive text-destructive" : ""
                                }`}
                              />
                              <span className="text-xs text-muted-foreground">/ {currentChapter.totalScore}</span>
                            </div>
                            {error && <span className="text-[10px] text-destructive font-semibold mt-1">{error}</span>}
                          </div>
                        </TableCell>
                        <TableCell className="text-center px-6">
                          {isPassed ? (
                            <Badge variant="default" className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded-full">
                              <Check className="h-3 w-3 shrink-0 mr-1" />
                              {t("passedBadge")}
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="rounded-full">
                              <XCircle className="h-3 w-3 shrink-0 mr-1" />
                              {t("failedBadge")}
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="bg-card rounded-xl border p-12 text-center max-w-xl mx-auto shadow-sm">
          <Award className="h-12 w-12 mx-auto text-muted/60 mb-3" />
          <h3 className="text-lg font-bold text-foreground">{t("noChaptersYet")}</h3>
          <p className="text-sm text-muted-foreground mt-1">{t("addChapterDesc")}</p>
        </div>
      )}
    </div>
  );
}
