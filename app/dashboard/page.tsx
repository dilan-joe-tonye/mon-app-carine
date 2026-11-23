"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Dashboard() {
  const { utilisateur, deconnexion } = useAuth();
  const router = useRouter();

  const [nbArbres, setNbArbres] = useState(0);
  const [nbStocks, setNbStocks] = useState(0);
  const [nbVentes, setNbVentes] = useState(0);
  const [nbConsultations, setNbConsultations] = useState(0);
  const [stocks, setStocks] = useState<{ id: number; nom: string; quantite: number; unite: string }[]>([]);

  useEffect(() => {
    const a = localStorage.getItem("arbres");
    const s = localStorage.getItem("stocks");
    const v = localStorage.getItem("ventes");
    const c = localStorage.getItem("consultations");
    if (a) setNbArbres(JSON.parse(a).length);
    if (s) setNbStocks(JSON.parse(s).length);
    if (v) setNbVentes(JSON.parse(v).length);
    if (c) setNbConsultations(JSON.parse(c).length);
  }, []);

  if (!utilisateur) return null;

  return (
    <div className="min-h-screen bg-green-50">
      <header className="bg-green-700 text-white p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img
            src="/logo.png.jpeg"
            alt="Logo"
            className="w-12 h-12 rounded-full bg-white object-contain"
          />
          <h1 className="text-xl font-bold">Clinique Traditionnelle des Arbres 🌿</h1>
        </div>
        <div className="flex items-center gap-4">
          <span>
            Bonjour, <strong>{utilisateur.nom}</strong> ({utilisateur.role})
          </span>
          <button
            onClick={() => {
              deconnexion();
              router.push("/login");
            }}
            className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded"
          >
            Déconnexion
          </button>
        </div>
      </header>

      <main className="p-8">
        <h2 className="text-2xl font-bold mb-4">Tableau de bord</h2>

        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => router.push("/arbres")}
            className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            🌳 Gérer les arbres
          </button>
          <button
            onClick={() => router.push("/stocks")}
            className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            📦 Gérer les stocks
          </button>
          <button
            onClick={() => router.push("/ventes")}
            className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            💰 Gérer les ventes
          </button>
          <button
            onClick={() => router.push("/consultations")}
            className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            🧑‍🤝‍🧑 Consultations
          </button>
          <button
            onClick={() => router.push("/horoscope")}
            className="bg-green-900 hover:bg-green-800 text-white px-4 py-2 rounded"
          >
            🔮 Horoscope
          </button>

         {utilisateur.role === "administrateur" && (
  <button
    onClick={() => router.push("/rapport")}
    className="bg-yellow-600 hover:bg-yellow-500 text-white px-4 py-2 rounded"
  >
    🖨️ Rapport du jour
  </button>
)}

             <button
              onClick={() => router.push("/statistiques")}
              className="bg-white p-8 rounded-lg shadow hover:shadow-lg text-center transition"
            >
              <p className="text-4xl mb-2">📊</p>
              <p className="text-lg font-bold">Statistiques</p>
              <p className="text-gray-500">Journal & recettes du jour</p>
            </button>


{utilisateur.role === "administrateur" && (
  <button
    onClick={() => router.push("/utilisateurs")}
    className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded"
  >
    👥 Employés
  </button>
)}


        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-3xl font-bold text-green-700">{nbArbres}</p>
            <p className="text-gray-600">arbres</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-3xl font-bold text-green-700">{nbStocks}</p>
            <p className="text-gray-600">stocks</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-3xl font-bold text-green-700">{nbVentes}</p>
            <p className="text-gray-600">ventes</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-3xl font-bold text-green-700">{nbConsultations}</p>
            <p className="text-gray-600">consultations</p>
          </div>
        </div>
      </main>
    </div>
  );
}
