"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

type Vente = {
  id: number;
  article: string;
  quantite: number;
  prixUnitaire: number;
  total: number;
};

export default function PageVentes() {
  const { utilisateur, token, deconnexion } = useAuth();
  const router = useRouter();

  const [ventes, setVentes] = useState<Vente[]>([]);
  const [article, setArticle] = useState("");
  const [quantite, setQuantite] = useState("");
  const [prixUnitaire, setPrixUnitaire] = useState("");

  useEffect(() => {
    if (!utilisateur) router.push("/login");
  }, [utilisateur, router]);

  // ✅ useCallback + dépendance correcte (l'ancien useEffect omettait charger → warning ESLint)
  const charger = useCallback(async () => {
    if (!token) return;
    const reponse = await fetch("/api/ventes", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (reponse.ok) setVentes(await reponse.json());
  }, [token]);

  useEffect(() => {
    charger();
  }, [charger]);

  const ajouterVente = async () => {
    if (!article.trim() || !quantite || !prixUnitaire) {
      alert("Veuillez remplir tous les champs !");
      return;
    }
    const reponse = await fetch("/api/ventes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        article: article.trim(),
        quantite: Number(quantite),
        prixUnitaire: Number(prixUnitaire),
        total: Number(quantite) * Number(prixUnitaire),
      }),
    });
    if (reponse.ok) {
      setArticle("");
      setQuantite("");
      setPrixUnitaire("");
      charger();
    } else {
      alert("Erreur : " + (await reponse.json()).erreur);
    }
  };

  const supprimerVente = async (id: number) => {
    if (!confirm("Supprimer cette vente ?")) return;
    await fetch(`/api/ventes?id=${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    charger();
  };

  const totalJour = ventes.reduce((somme, v) => somme + (v.total || 0), 0);

  if (!utilisateur) return null;

  return (
    <div className="min-h-screen bg-green-50">
      {/* ... JSX identique à votre version (rien à corriger ici) ... */}
      <header className="bg-green-700 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">💰 Gestion des Ventes</h1>
        <div className="flex items-center gap-4">
          <button onClick={() => router.push("/dashboard")} className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded">
            ← Tableau de bord
          </button>
          <button
            onClick={() => { deconnexion(); router.push("/login"); }}
            className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded"
          >
            Déconnexion
          </button>
        </div>
      </header>
      {/* ... reste du JSX inchangé ... */}
    </div>
  );
}
