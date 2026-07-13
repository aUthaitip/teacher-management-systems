"use client";

import Link from "next/link";

import { AuthCard } from "./auth-card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function RegisterForm() {
  return (
    <AuthCard
      title="Create Account"
      description="Create your teacher account"
    >
      <form className="space-y-5">
        <div className="space-y-2">
          <Label>Full Name</Label>

          <Input placeholder="John Doe" />
        </div>

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
          Create Account
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-primary hover:underline"
          >
            Sign In
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}