"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

type Vente = { id: number; article: string; quantite: number; total: number };
type Consultation = { id: number; nom: string; motif: string; montant: number; date: string };

export default function PageStatistiques() {
  const { utilisateur, token, deconnexion } = useAuth();
  const router = useRouter();

  const [ventes, setVentes] = useState<Vente[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);

  useEffect(() => {
    if (!utilisateur) router.push("/login");
  }, [utilisateur, router]);

  useEffect(() => {
    const charger = async () => {
      if (!token) return;
      const [rVentes, rConsult] = await Promise.all([
        fetch("/api/ventes", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/consultations", { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      if (rVentes.ok) setVentes(await rVentes.json());
      if (rConsult.ok) setConsultations(await rConsult.json());
    };
    charger();
  }, [token]);

  const totalVentes = ventes.reduce((s, v) => s + v.total, 0);
  const totalConsultations = consultations.reduce((s, c) => s + c.montant, 0);
  const totalGlobal = totalVentes + totalConsultations;

  const [aujourdhui, setAujourdhui] = useState("");
  useEffect(() => {
    setAujourdhui(new Date().toLocaleDateString("fr-FR"));
  }, []);


  if (!utilisateur) return null;

  return (
    <div className="min-h-screen bg-green-50">
      <header className="bg-green-700 text-white p-4 flex justify-between items-center print:hidden">
        <h1 className="text-xl font-bold">📊 Statistiques du jour</h1>
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

      <main className="p-8 max-w-4xl mx-auto print:p-0">
      <p className="text-center text-gray-600 mb-6">
      📅 {aujourdhui} — Tenu par : <strong>{utilisateur?.nom}</strong>
      </p>


        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow text-center border-t-4 border-green-700">
            <p className="text-gray-500">💰 Ventes</p>
            <p className="text-3xl font-bold">{totalVentes} FC</p>
            <p className="text-sm text-gray-400">{ventes.length} vente(s)</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center border-t-4 border-green-700">
            <p className="text-gray-500">🔮 Consultations</p>
            <p className="text-3xl font-bold">{totalConsultations} FC</p>
            <p className="text-sm text-gray-400">{consultations.length} client(s)</p>
          </div>
          <div className="bg-green-700 text-white p-6 rounded-lg shadow text-center">
            <p>🏆 RECETTE TOTALE</p>
            <p className="text-3xl font-bold">{totalGlobal} FC</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-bold mb-4">🛒 Détail des ventes</h2>
          {ventes.length === 0 ? (
            <p className="text-gray-500">Aucune vente.</p>
          ) : (
            <ul className="divide-y">
              {ventes.map((v) => (
                <li key={v.id} className="py-2 flex justify-between">
                  <span>{v.article} (×{v.quantite})</span>
                  <span className="font-bold">{v.total} FC</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-bold mb-4">🔮 Détail des consultations</h2>
          {consultations.length === 0 ? (
            <p className="text-gray-500">Aucune consultation.</p>
          ) : (
            <ul className="divide-y">
              {consultations.map((c) => (
                <li key={c.id} className="py-2 flex justify-between">
                  <span>{c.nom} — {c.motif}</span>
                  <span className="font-bold">{c.montant} FC</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          onClick={() => window.print()}
          className="bg-green-700 hover:bg-green-600 text-white px-6 py-3 rounded font-bold print:hidden"
        >
          🖨️ Imprimer le journal du jour
        </button>
      </main>
    </div>
  );
}
