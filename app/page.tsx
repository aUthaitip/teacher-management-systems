import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-6 text-center">
        <span className="rounded-full border bg-white px-4 py-1 text-sm font-medium text-slate-600 shadow-sm">
          Teacher Management System
        </span>

        <h1 className="mt-6 max-w-4xl text-5xl font-bold tracking-tight text-slate-900 md:text-6xl">
          Manage Your Classroom Smarter
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-slate-600">
          Organize subjects, classrooms, attendance, and student scores in one
          modern platform built for teachers.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link href="/register">
            <Button size="lg">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>

          <Link href="/login">
            <Button variant="outline" size="lg">
              Sign In
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}