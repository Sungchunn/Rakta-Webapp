"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootPage() {
  const router = useRouter();

  // Redirect root to dashboard since it's now a protected SaaS app
  useEffect(() => {
    router.push("/dashboard");
  }, [router]);

  return <div className="h-screen w-screen flex items-center justify-center text-muted-foreground animate-pulse">Initializing Command Center...</div>;
}
