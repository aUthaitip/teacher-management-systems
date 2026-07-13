"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AttendanceRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/subjects");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );
}
