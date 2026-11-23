"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

type Vente = { id: number; article: string; quantite: number; total: number; date: string };
type Consultation = { id: number; nom: string; motif: string; soin: string; montant: number; date: string };

export default function PageRapport() {
  const { utilisateur, token } = useAuth();   // ⬅️ on récupère aussi le token
  const router = useRouter();
  const [ventes, setVentes] = useState<Vente[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [aujourdhui, setAujourdhui] = useState("");

  useEffect(() => {
    setAujourdhui(new Date().toLocaleDateString("fr-CA"));
  }, []);

  // 📥 On charge les données SEULEMENT quand le token est disponible
  useEffect(() => {
    if (!token) return;

    const entetes = { Authorization: `Bearer ${token}` };

    fetch("/api/ventes", { headers: entetes })
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setVentes(Array.isArray(data) ? data : []))
      .catch(() => setVentes([]));

    fetch("/api/consultations", { headers: entetes })
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setConsultations(Array.isArray(data) ? data : []))
      .catch(() => setConsultations([]));
  }, [token]);   // ⬅️ se relance quand la session est prête

  // ... le reste de votre page reste IDENTIQUE
