"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/AppContext";
import { useLanguage } from "@/lib/LanguageContext";
import Link from "next/link";
import { GraduationCap, LogIn, Mail, Lock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const { loginTeacher } = useApp();
  const { language, t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError(language === "th" ? "กรุณากรอกอีเมลและรหัสผ่านให้ครบถ้วน" : "Please fill in email and password");
      return;
    }

    const success = loginTeacher(email, password);
    if (success) {
      router.push("/dashboard");
    } else {
      setError(language === "th" 
        ? "อีเมลหรือรหัสผ่านไม่ถูกต้อง (สำหรับผู้ใช้เริ่มต้นใช้รหัสผ่าน: password123)" 
        : "Invalid email or password (default password: password123)");
    }
  };

  return (
    <div className="bg-white p-8 md:p-10 rounded-2xl shadow-2xl w-full max-w-md border border-zinc-100 relative text-zinc-900">
      <div className="flex flex-col items-center mb-8">
        <div className="bg-black p-3 rounded-2xl text-white shadow-lg mb-4">
          <GraduationCap className="h-8 w-8" />
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight">
          {t("loginTitle")}
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          {language === "th" ? "ระบบจัดการห้องเรียนและคะแนนนักเรียน" : "Classroom & student grade manager"}
        </p>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-100 text-rose-600 p-3 rounded-lg text-sm flex items-start gap-2 mb-6">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            {t("emailLabel")}
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 h-4 w-4 text-zinc-400 z-10" />
            <Input
              type="email"
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
              className="pl-9 h-11 text-zinc-900 bg-zinc-50/50"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            {t("defaultPasswordNote")} <code className="bg-zinc-100 px-1 rounded text-zinc-600">password123</code>
          </p>
        </div>

        <Button
          type="submit"
          className="w-full bg-black hover:bg-zinc-800 text-white font-bold py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 mt-2 h-11 cursor-pointer"
        >
          <LogIn className="h-5 w-5" />
          {t("login")}
        </Button>
      </form>

      <div className="mt-8 text-center text-sm text-zinc-500">
        {t("noAccount")}{" "}
        <Link href="/register" className="text-black hover:underline font-bold">
          {t("signUpHere")}
        </Link>
      </div>
    </div>
  );
}