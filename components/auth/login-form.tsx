"use client";

import Link from "next/link";
import { AuthCard } from "./auth-card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  return (
    <AuthCard
      title="Welcome"
      description="Sign in to continue to Teacher Management System"
    >
      <form className="space-y-5">
        <div className="space-y-2">
          <Label>Email</Label>

          <Input
            type="email"
            placeholder="teacher@email.com"
          />
        </div>

        <div className="space-y-2">
          <Label>Password</Label>

          <Input
            type="password"
            placeholder="********"
          />
        </div>

        <Button className="w-full">
          Sign In
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-primary hover:underline"
          >
            Register
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}