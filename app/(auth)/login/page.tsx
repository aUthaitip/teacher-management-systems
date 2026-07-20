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
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError(t("loginErrorEmpty"));
      return;
    }

    setLoading(true);
    try {
      const success = await loginTeacher(email, password);
      if (success) {
        window.location.href = "/dashboard";
      } else {
        setError(t("loginErrorInvalid"));
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setError("Error connecting to database");
      setLoading(false);
    }
  };

  return (
    <div className="bg-card p-8 md:p-10 rounded-2xl shadow-2xl w-full max-w-md border border-border relative text-foreground">
      <div className="flex flex-col items-center mb-8">
        <div className="bg-primary p-3 rounded-2xl text-primary-foreground shadow-lg mb-4">
          <GraduationCap className="h-8 w-8" />
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
          {t("loginTitle")}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {t("loginSubtitle")}
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
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t("emailLabel")}
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground z-10" />
            <Input
              type="email"
              className="pl-9 h-11 text-foreground bg-background/50"
              placeholder="teacher@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t("passwordLabel")}
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground z-10" />
            <Input
              type="password"
              className="pl-9 h-11 text-foreground bg-background/50"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {t("defaultPasswordNote")} <code className="bg-muted px-1 rounded text-zinc-600">password123</code>
          </p>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 mt-2 h-11 cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <span className="animate-pulse">{language === "th" ? "กำลังประมวลผล..." : "Processing..."}</span>
          ) : (
            <>
              <LogIn className="h-5 w-5" />
              {t("login")}
            </>
          )}
        </Button>
      </form>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        {t("noAccount")}{" "}
        <Link href="/register" className="text-black hover:underline font-bold">
          {t("signUpHere")}
        </Link>
      </div>
    </div>
  );
}