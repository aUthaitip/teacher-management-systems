"use client";

import React, { useState, useEffect } from "react";
import { Hash, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddSubjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingId: string | null;
  initialCode: string;
  initialName: string;
  initialGradeLevel: string;
  onSubmit: (code: string, name: string, gradeLevel: string) => void;
  triggerEl: React.ReactElement;
}

export function AddSubjectDialog({
  open,
  onOpenChange,
  editingId,
  initialCode,
  initialName,
  initialGradeLevel,
  onSubmit,
  triggerEl
}: AddSubjectDialogProps) {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [gradeLevel, setGradeLevel] = useState("ม.1");

  useEffect(() => {
    setCode(initialCode);
    setName(initialName);
    setGradeLevel(initialGradeLevel || "ม.1");
  }, [initialCode, initialName, initialGradeLevel, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !name || !gradeLevel) return;
    onSubmit(code, name, gradeLevel);
    setCode("");
    setName("");
  };

  const gradeOptions = ["ป.1","ป.2","ป.3","ป.4","ป.5","ป.6","ม.1", "ม.2", "ม.3", "ม.4", "ม.5", "ม.6"];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger className="cursor-pointer" render={triggerEl} />
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            {editingId ? "แก้ไขข้อมูลรายวิชา" : "เพิ่มรายวิชาใหม่"}
          </DialogTitle>
          <DialogDescription>
            กรอกรหัส ชื่อวิชา และเลือกระดับชั้นของนักเรียน
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase">รหัสวิชา</label>
            <div className="relative">
              <Hash className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground z-10" />
              <Input
                placeholder="เช่น ค31201"
                className="pl-9"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase">ชื่อวิชา</label>
            <div className="relative">
              <BookOpen className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground z-10" />
              <Input
                placeholder="เช่น คณิตศาสตร์เพิ่มเติม 1"
                className="pl-9"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase">ระดับชั้นเรียน</label>
            <Select value={gradeLevel} onValueChange={(val) => setGradeLevel(val || "ม.1")}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="เลือกระดับชั้น" />
              </SelectTrigger>
              <SelectContent>
                {gradeOptions.map((g) => (
                  <SelectItem key={g} value={g}>
                    ชั้นเรียนระดับ {g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="pt-4 gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => { onOpenChange(false); setCode(""); setName(""); setGradeLevel("ม.1"); }}
            >
              ยกเลิก
            </Button>
            <Button type="submit">
              บันทึกข้อมูล
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
