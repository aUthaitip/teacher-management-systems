"use client";

import React, { useState } from "react";
import { FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface AddClassroomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (name: string, description: string) => void;
}

export function AddClassroomDialog({
  open,
  onOpenChange,
  onSubmit
}: AddClassroomDialogProps) {
  const [className, setClassName] = useState("");
  const [classDesc, setClassDesc] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!className) return;
    onSubmit(className, classDesc);
    setClassName("");
    setClassDesc("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            <FolderPlus className="h-5 w-5" />
            เปิดห้องเรียนย่อย
          </DialogTitle>
          <DialogDescription>
            สร้างห้องเรียนหรือชั้นเรียนสำหรับวิชานี้ เช่น ม.4/1, ม.4/2
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase">ชื่อห้องเรียน/ชั้นเรียน</label>
            <Input
              placeholder="เช่น ม.4/1, 10/A"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase">คำอธิบายย่อ (รายละเอียดห้อง)</label>
            <Input
              placeholder="เช่น แผนการเรียนวิทย์-คณิต"
              value={classDesc}
              onChange={(e) => setClassDesc(e.target.value)}
            />
          </div>
          <DialogFooter className="pt-4 gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => { onOpenChange(false); setClassName(""); setClassDesc(""); }}
            >
              ยกเลิก
            </Button>
            <Button type="submit">
              บันทึกห้องเรียน
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
