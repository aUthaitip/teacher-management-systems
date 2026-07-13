"use client";

import { useState, useEffect } from "react";
import Sidebar from "../../components/layout/sidebar";
import { Menu, X, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/AppContext";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { currentTeacher, isLoaded } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !currentTeacher) {
      router.push("/login");
    }
  }, [isLoaded, currentTeacher, router]);

  if (!isLoaded || !currentTeacher) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 text-slate-900">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 relative">
      {/* Desktop Sidebar (visible on lg screens, hidden on mobile/tablet) */}
      <div className="hidden lg:block lg:w-64 lg:shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar sliding panel */}
      <div className={`fixed inset-y-0 left-0 w-64 bg-white z-50 transform lg:hidden transition-transform duration-300 ease-in-out ${
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="relative h-full flex flex-col">
          {/* Close Button inside mobile drawer */}
          <div className="absolute top-4 right-4 z-50">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileOpen(false)}
              className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <Sidebar />
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Top Navbar (hidden on lg screens) */}
        <header className="lg:hidden bg-white border-b h-13 flex items-center justify-between px-4 shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-1 rounded-md text-primary-foreground">
              <GraduationCap className="h-4.5 w-4.5" />
            </div>
            <span className="font-bold text-xs tracking-tight text-foreground">Classroom</span>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsMobileOpen(true)}
            className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <Menu className="h-4.5 w-4.5" />
          </Button>
        </header>

        {/* Page Content area */}
        <main className="flex-1 p-4 md:p-8 bg-slate-50/50 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}