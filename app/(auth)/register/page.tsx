"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/AppContext";
import { useLanguage } from "@/lib/LanguageContext";
import Link from "next/link";
import { GraduationCap, UserPlus, Mail, Lock, User, School, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";

export default function RegisterPage() {
  const router = useRouter();
  const { registerTeacher } = useApp();
  const { language, t } = useLanguage();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [school, setSchool] = useState("");
  const [password, setPassword] = useState("");
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Zod schemas with bilingual error messages
  const registerSchema = z.object({
    name: z.string().min(2, { 
      message: language === "th" ? "ชื่อ-นามสกุลต้องมีอย่างน้อย 2 ตัวอักษร" : "Name must be at least 2 characters" 
    }),
    school: z.string().min(2, { 
      message: language === "th" ? "ชื่อโรงเรียนต้องมีอย่างน้อย 2 ตัวอักษร" : "School name must be at least 2 characters" 
    }),
    email: z.string().email({ 
      message: language === "th" ? "รูปแบบอีเมลไม่ถูกต้อง" : "Invalid email address format" 
    }),
    password: z.string().min(6, { 
      message: language === "th" ? "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร" : "Password must be at least 6 characters" 
    }),
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Zod Validation
    const validationResult = registerSchema.safeParse({ name, email, school, password });
    
    if (!validationResult.success) {
      // Get the first error message
      const firstErrorMessage = validationResult.error.issues[0]?.message || "Validation Error";
      setError(firstErrorMessage);
      return;
    }

    setLoading(true);
    
    // Simulate API delay for a polished UX
    setTimeout(() => {
      const isRegistered = registerTeacher(name, email, school, password);
      setLoading(false);

      if (isRegistered) {
        setSuccess(language === "th" 
          ? "ลงทะเบียนสมาชิกสำเร็จ! กำลังพาท่านไปหน้าเข้าสู่ระบบ..." 
          : "Registration successful! Redirecting you to login page...");
        
        // Clear inputs
        setName("");
        setEmail("");
        setSchool("");
        setPassword("");

        // Redirect to Login Page after 2 seconds
        setTimeout(() => {
          router.push("/login");
        }, 2200);
      } else {
        setError(language === "th" ? "อีเมลนี้มีผู้สมัครใช้งานแล้ว" : "Email already registered in this system.");
      }
    }, 800);
  };

  return (
    <div className="bg-white p-8 md:p-10 rounded-2xl shadow-2xl w-full max-w-md border border-zinc-100 relative text-zinc-900">
      <div className="flex flex-col items-center mb-6">
        <div className="bg-black p-3 rounded-2xl text-white shadow-lg mb-4">
          <GraduationCap className="h-8 w-8" />
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight">
          {t("registerTitle")}
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          {t("registerSubtitle")}
        </p>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-100 text-rose-600 p-3 rounded-lg text-sm flex items-start gap-2 mb-6">
          <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 p-3 rounded-lg text-sm flex items-start gap-2 mb-6 animate-pulse">
          <CheckCircle2 className="h-4.5 w-4.5 shrink-0 mt-0.5" />
          <span className="font-bold">{success}</span>
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            {t("fullNameLabel")}
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-3.5 h-4 w-4 text-zinc-400 z-10" />
            <Input
              type="text"
              disabled={loading || !!success}
              className="pl-9 h-11 text-zinc-900 bg-zinc-50/50"
              placeholder={language === "th" ? "เช่น ครูวิทยากร ใจดี" : "e.g. John Doe"}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            {t("schoolLabel")}
          </Label>
          <div className="relative">
            <School className="absolute left-3 top-3.5 h-4 w-4 text-zinc-400 z-10" />
            <Input
              type="text"
              disabled={loading || !!success}
              className="pl-9 h-11 text-zinc-900 bg-zinc-50/50"
              placeholder={language === "th" ? "เช่น โรงเรียนมัธยมวิทยา" : "e.g. High School"}
              value={school}
              onChange={(e) => setSchool(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            {t("emailLabel")}
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 h-4 w-4 text-zinc-400 z-10" />
            <Input
              type="email"
              disabled={loading || !!success}
              className="pl-9 h-11 text-zinc-900 bg-zinc-50/50"
              placeholder="teacher@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            {t("passwordLabel")}
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 h-4 w-4 text-zinc-400 z-10" />
            <Input
              type="password"
              disabled={loading || !!success}
              className="pl-9 h-11 text-zinc-900 bg-zinc-50/50"
              placeholder={language === "th" ? "อย่างน้อย 6 ตัวอักษร" : "At least 6 characters"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading || !!success}
          className="w-full bg-black hover:bg-zinc-800 text-white font-bold py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 mt-2 h-11 cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <span className="animate-pulse">{language === "th" ? "กำลังประมวลผล..." : "Processing..."}</span>
          ) : (
            <>
              <UserPlus className="h-5 w-5" />
              {t("register")}
            </>
          )}
        </Button>
      </form>

      <div className="mt-8 text-center text-sm text-zinc-500">
        {t("alreadyHaveAccount")}{" "}
        <Link href="/login" className="text-black hover:underline font-bold">
          {t("signInHere")}
        </Link>
      </div>
    </div>
  );
}