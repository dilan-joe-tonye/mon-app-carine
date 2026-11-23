"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

type Vente = { id: number; article: string; quantite: number; total: number; date: string };
type Consultation = { id: number; nom: string; motif: string; soin: string; montant: number; date: string };

export default function PageRapport() {
  const { utilisateur } = useAuth();
  const router = useRouter();
  const [ventes, setVentes] = useState<Vente[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [aujourdhui, setAujourdhui] = useState("");

  useEffect(() => {
    // ✅ La date est calculée dans le useEffect, jamais au prerender
    setAujourdhui(new Date().toLocaleDateString("fr-FR"));

    // 📥 On charge depuis la base de données (plus le localStorage !)
    fetch("/api/ventes")
      .then((r) => r.json())
      .then((data) => setVentes(data));
    fetch("/api/consultations")
      .then((r) => r.json())
      .then((data) => setConsultations(data));
  }, []);

  const ventesJour = ventes.filter((v) => v.date.startsWith(aujourdhui));
  const consJour = consultations.filter((c) => c.date.startsWith(aujourdhui));

  const totalVentes = ventesJour.reduce((s, v) => s + v.total, 0);
  const totalCons = consJour.reduce((s, c) => s + c.montant, 0);
  const total = totalVentes + totalCons;

  if (!utilisateur) return null;

  if (utilisateur.role !== "administrateur") {
    return (
      <div className="min-h-screen bg-green-50 p-8 text-center">
        <p className="text-red-600 font-bold text-xl">
          ❌ Accès réservé à l'administratrice
        </p>
        <button
          onClick={() => router.push("/dashboard")}
          className="mt-4 bg-green-700 text-white px-4 py-2 rounded"
        >
          Retour au tableau de bord
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-8 max-w-3xl mx-auto text-black">
      {/* En-tête du rapport */}
      <div className="text-center border-b-2 border-green-700 pb-4 mb-6">
        <img src="/logo.png.jpeg" alt="Logo" className="w-24 h-24 mx-auto object-contain" />
        <h1 className="text-2xl font-bold text-green-800">Clinique Traditionnelle des Arbres 🌿</h1>
        <p className="text-lg">Rapport du {aujourdhui}</p>
      </div>

      {/* Ventes */}
      <h2 className="text-xl font-bold mb-2">💰 Ventes du jour ({ventesJour.length})</h2>
      {ventesJour.length === 0 ? (
        <p className="mb-4 text-gray-500">Aucune vente aujourd'hui.</p>
      ) : (
        <table className="w-full border mb-6">
          <thead>
            <tr className="bg-green-100">
              <th className="border p-2 text-left">Heure</th>
              <th className="border p-2 text-left">Article</th>
              <th className="border p-2 text-left">Qté</th>
              <th className="border p-2 text-left">Total</th>
            </tr>
          </thead>
          <tbody>
            {ventesJour.map((v) => (
              <tr key={v.id}>
                <td className="border p-2">{v.date.split(" ")[1]}</td>
                <td className="border p-2">{v.article}</td>
                <td className="border p-2">{v.quantite}</td>
                <td className="border p-2 font-bold">{v.total} FC</td>
              </tr>
            ))}
            <tr className="bg-green-50">
              <td colSpan={3} className="border p-2 font-bold text-right">Total ventes :</td>
              <td className="border p-2 font-bold">{totalVentes} FC</td>
            </tr>
          </tbody>
        </table>
      )}

      {/* Consultations */}
      <h2 className="text-xl font-bold mb-2">🧑‍🤝‍🧑 Consultations du jour ({consJour.length})</h2>
      {consJour.length === 0 ? (
        <p className="mb-4 text-gray-500">Aucune consultation aujourd'hui.</p>
      ) : (
        <table className="w-full border mb-6">
          <thead>
            <tr className="bg-green-100">
              <th className="border p-2 text-left">Heure</th>
              <th className="border p-2 text-left">Client</th>
              <th className="border p-2 text-left">Motif</th>
              <th className="border p-2 text-left">Montant</th>
            </tr>
          </thead>
          <tbody>
            {consJour.map((c) => (
              <tr key={c.id}>
                <td className="border p-2">{c.date.split(" ")[1]}</td>
                <td className="border p-2">{c.nom}</td>
                <td className="border p-2">{c.motif}</td>
                <td className="border p-2 font-bold">{c.montant} FC</td>
              </tr>
            ))}
            <tr className="bg-green-50">
              <td colSpan={3} className="border p-2 font-bold text-right">Total consultations :</td>
              <td className="border p-2 font-bold">{totalCons} FC</td>
            </tr>
          </tbody>
        </table>
      )}

      {/* Total général */}
      <div className="border-2 border-green-700 p-4 text-center my-6">
        <p className="text-xl">💵 RECETTE TOTALE DU JOUR</p>
        <p className="text-4xl font-bold text-green-800">{total} FC</p>
      </div>

      <p className="text-center text-sm text-gray-500">Signature : ______________________</p>

      {/* Boutons (invisible à l'impression grâce à print:hidden) */}
      <div className="flex gap-3 justify-center mt-8 print:hidden">
        <button
          onClick={() => window.print()}
          className="bg-green-700 hover:bg-green-600 text-white px-6 py-3 rounded font-bold"
        >
          🖨️ Imprimer le rapport
        </button>
        <button
          onClick={() => router.push("/dashboard")}
          className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-3 rounded font-bold"
        >
          ← Retour
        </button>
      </div>
    </div>
  );
}
