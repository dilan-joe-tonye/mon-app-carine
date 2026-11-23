"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { utilisateur } = useAuth();
  const router = useRouter();

  useEffect(() => {
    router.push(utilisateur ? "/dashboard" : "/login");
  }, [utilisateur, router]);

  return (
    <div className="min-h-screen flex items-center justify-center text-2xl">
      🌳 Chargement...
    </div>
  );
}
