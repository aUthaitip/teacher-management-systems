"use client";

import { useState, useEffect, useRef } from "react";
import { useApp } from "@/lib/AppContext";
import { User, Mail, School, Save, Check, Upload, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProfilePage() {
  const { currentTeacher, updateProfile, isLoaded } = useApp();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [school, setSchool] = useState("");
  const [avatar, setAvatar] = useState("");
  const [saved, setSaved] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentTeacher) {
      setName(currentTeacher.name);
      setEmail(currentTeacher.email);
      setSchool(currentTeacher.school);
      setAvatar(currentTeacher.avatar || "");
    }
  }, [currentTeacher]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Limit file size to 1MB to prevent localStorage limit issues
      if (file.size > 1024 * 1024) {
        alert("รูปภาพต้องมีขนาดไม่เกิน 1MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = () => {
    setAvatar("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !school) return;

    updateProfile(name, email, school, avatar || undefined);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-foreground">
          แก้ไขโปรไฟล์ผู้สอน
        </h1>
        <p className="text-muted-foreground mt-1">
          ปรับปรุงข้อมูลส่วนตัวของคุณครู รูปภาพประจำตัว และข้อมูลสังกัดโรงเรียน
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="bg-white border shadow-sm">
          <CardHeader className="p-6 border-b flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar Preview */}
            <div className="relative group shrink-0">
              <div className="h-20 w-20 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-foreground font-black text-2xl overflow-hidden shadow-inner">
                {avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatar} alt="avatar" className="h-full w-full object-cover" />
                ) : (
                  name.charAt(0) || "T"
                )}
              </div>
            </div>

            {/* Upload Action buttons */}
            <div className="flex-1 flex flex-col items-center sm:items-start gap-2">
              <CardTitle className="text-lg font-bold text-foreground">รูปถ่ายประจำตัวครู</CardTitle>
              <CardDescription className="text-xs text-muted-foreground text-center sm:text-left">
                รองรับไฟล์ภาพ JPEG, PNG ขนาดไม่เกิน 1MB
              </CardDescription>
              
              <div className="flex gap-2 mt-1">
                {/* Hidden File Input */}
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={triggerFileInput}
                  className="h-8 text-xs font-bold flex items-center gap-1 cursor-pointer border-zinc-200"
                >
                  <Upload className="h-3.5 w-3.5" />
                  อัปโหลดรูปภาพ
                </Button>
                {avatar && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={handleDeleteImage}
                    className="h-8 text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-100 flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    ลบรูปภาพ
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-muted-foreground uppercase">
                  ชื่อ-นามสกุลครูผู้สอน
                </Label>
                <div className="relative">
                  <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground z-10" />
                  <Input
                    type="text"
                    className="pl-9"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-muted-foreground uppercase">
                  อีเมล (Email Address)
                </Label>
                <div className="relative">
                  <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground z-10" />
                  <Input
                    type="email"
                    className="pl-9"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-muted-foreground uppercase">
                  ชื่อโรงเรียน/สังกัด
                </Label>
                <div className="relative">
                  <School className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground z-10" />
                  <Input
                    type="text"
                    className="pl-9"
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between gap-4">
                <div>
                  {saved && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 animate-fadeIn">
                      <Check className="h-3.5 w-3.5" />
                      บันทึกข้อมูลสำเร็จ!
                    </span>
                  )}
                </div>
                <Button
                  type="submit"
                  className="flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="h-4.5 w-4.5" />
                  บันทึกข้อมูลโปรไฟล์
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
