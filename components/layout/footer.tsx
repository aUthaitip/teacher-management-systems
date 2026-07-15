import React from "react";

export function Footer() {
  return (
    <footer className="border-t border-black/20 py-6 text-center text-xs text-black/80 bg-primary relative z-10">
      <div className="mx-auto max-w-7xl px-6 text-black">
        &copy; {new Date().getFullYear()} Classroom Management System. All rights reserved.
      </div>
    </footer>
  );
}
