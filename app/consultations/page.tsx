"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

type Client = {
  id: number;
  nom: string;
  telephone: string;
  signe: string;
  motif: string;
  soin: string;
  montant: number;
  date: string;
};

const SIGNES = ["Bélier", "Taureau", "Gémeaux", "Cancer", "Lion", "Vierge", "Balance", "Scorpion", "Sagittaire", "Capricorne", "Verseau", "Poissons"];

export default function PageConsultations() {
  const { utilisateur, token, deconnexion } = useAuth();
  const router = useRouter();

  const [clients, setClients] = useState<Client[]>([]);
  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [signe, setSigne] = useState("");
  const [motif, setMotif] = useState("");
  const [soin, setSoin] = useState("");
  const [montant, setMontant] = useState("");

  useEffect(() => {
    if (!utilisateur) router.push("/login");
  }, [utilisateur, router]);

  const charger = async () => {
    if (!token) return;
    const reponse = await fetch("/api/consultations", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (reponse.ok) setClients(await reponse.json());
  };

  useEffect(() => {
    if (token) charger();
  }, [token]);

  const ajouter = async () => {
    if (!nom || !motif) {
      alert("Veuillez remplir au moins le nom et le motif !");
      return;
    }
    const maintenant = new Date();
    const reponse = await fetch("/api/consultations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        nom,
        telephone,
        signe,
        motif,
        soin,
        montant: Number(montant) || 0,
        date:
          maintenant.toLocaleDateString("fr-FR") +
          " " +
          maintenant.toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
      }),
    });
    if (reponse.ok) {
      setNom(""); setTelephone(""); setSigne(""); setMotif(""); setSoin(""); setMontant("");
      charger();
    } else {
      alert("Erreur : " + (await reponse.json()).erreur);
    }
  };

  const supprimer = async (id: number) => {
    if (!confirm("Supprimer cette consultation ?")) return;
    await fetch(`/api/consultations?id=${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    charger();
  };

  const totalRecettes = clients.reduce((s, c) => s + c.montant, 0);

  if (!utilisateur) return null;

  return (
    <div className="min-h-screen bg-green-50">
      <header className="bg-green-700 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">🧑‍🤝‍🧑 Clients & Consultations</h1>
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

      <main className="p-8 max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-bold mb-4">➕ Nouvelle consultation</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
            <input value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Nom du client *" className="border rounded px-3 py-2" />
            <input value={telephone} onChange={(e) => setTelephone(e.target.value)} placeholder="Téléphone" className="border rounded px-3 py-2" />
            <select value={signe} onChange={(e) => setSigne(e.target.value)} className="border rounded px-3 py-2">
              <option value="">-- Signe astrologique --</option>
              {SIGNES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <input value={motif} onChange={(e) => setMotif(e.target.value)} placeholder="Motif (maladie, chance, protection...)" className="border rounded px-3 py-2 sm:col-span-2" />
            <input value={soin} onChange={(e) => setSoin(e.target.value)} placeholder="Soin / remède donné" className="border rounded px-3 py-2" />
            <input value={montant} onChange={(e) => setMontant(e.target.value)} placeholder="Montant payé (FC)" type="number" className="border rounded px-3 py-2" />
          </div>
          <button onClick={ajouter} className="mt-3 bg-green-700 hover:bg-green-600 text-white rounded px-6 py-2 font-bold">
            Enregistrer la consultation
          </button>
        </div>

        <div className="bg-green-700 text-white p-6 rounded-lg shadow mb-6 text-center">
          <p className="text-lg">💰 Total des consultations</p>
          <p className="text-3xl font-bold">{totalRecettes} FC</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-bold mb-4">📋 Clients ({clients.length})</h2>
          {clients.length === 0 ? (
            <p className="text-gray-500">Aucun client pour le moment.</p>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="py-2">Date</th><th className="py-2">Nom</th><th className="py-2">Signe</th>
                  <th className="py-2">Motif</th><th className="py-2">Soin</th><th className="py-2">Montant</th><th></th>
                </tr>
              </thead>
              <tbody>
                {clients.map((c) => (
                  <tr key={c.id} className="border-b">
                    <td className="py-2 text-sm text-gray-600">{c.date}</td>
                    <td className="py-2 font-bold">{c.nom}</td>
                    <td className="py-2">{c.signe}</td>
                    <td className="py-2">{c.motif}</td>
                    <td className="py-2">{c.soin}</td>
                    <td className="py-2 font-bold">{c.montant} FC</td>
                    <td><button onClick={() => supprimer(c.id)} className="text-red-600">❌</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
