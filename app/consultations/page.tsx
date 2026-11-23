"use client";

import { useCallback, useEffect, useState } from "react";
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

  const charger = useCallback(async () => {
    if (!token) return;
    const reponse = await fetch("/api/consultations", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (reponse.ok) {
      const donnees = await reponse.json();
      setClients(donnees);
    } else if (reponse.status === 401) {
      deconnexion();
      router.push("/login");
    }
  }, [token, deconnexion, router]);

  useEffect(() => {
    charger();
  }, [charger]);

  const ajouter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

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
        montant: Number(montant),
      }),
    });

    if (reponse.ok) {
      setNom("");
      setTelephone("");
      setSigne("");
      setMotif("");
      setSoin("");
      setMontant("");
      charger();
    }
  };

  const supprimer = async (id: number) => {
    if (!token) return;
    const reponse = await fetch(`/api/consultations/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (reponse.ok) charger();
  };

  const total = clients.reduce((somme, c) => somme + c.montant, 0);

  if (!utilisateur) return null;

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-amber-400">
            ✨ Consultations — {utilisateur.nom}
          </h1>
          <button
            onClick={() => {
              deconnexion();
              router.push("/login");
            }}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 transition"
          >
            Déconnexion
          </button>
        </header>

        <form
          onSubmit={ajouter}
          className="bg-gray-900 p-6 rounded-xl border border-gray-800 space-y-4 mb-10"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="Nom du client"
              required
              className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-amber-400 outline-none"
            />
            <input
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              placeholder="Téléphone"
              required
              className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-amber-400 outline-none"
            />
            <select
              value={signe}
              onChange={(e) => setSigne(e.target.value)}
              required
              className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-amber-400 outline-none"
            >
              <option value="">— Signe astrologique —</option>
              {SIGNES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <input
              value={motif}
              onChange={(e) => setMotif(e.target.value)}
              placeholder="Motif de la consultation"
              required
              className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-amber-400 outline-none"
            />
            <input
              value={soin}
              onChange={(e) => setSoin(e.target.value)}
              placeholder="Soin recommandé"
              className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-amber-400 outline-none"
            />
            <input
              value={montant}
              onChange={(e) => setMontant(e.target.value)}
              placeholder="Montant (€)"
              type="number"
              min="0"
              step="0.01"
              required
              className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-amber-400 outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-amber-500 text-gray-950 font-semibold hover:bg-amber-400 transition"
          >
            Ajouter la consultation
          </button>
        </form>

        <section className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-800 text-amber-400">
              <tr>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Nom</th>
                <th className="px-4 py-3 text-left">Téléphone</th>
                <th className="px-4 py-3 text-left">Signe</th>
                <th className="px-4 py-3 text-left">Motif</th>
                <th className="px-4 py-3 text-left">Soin</th>
                <th className="px-4 py-3 text-right">Montant</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {clients.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-6 text-center text-gray-500">
                    Aucune consultation enregistrée.
                  </td>
                </tr>
              ) : (
                clients.map((c) => (
                  <tr key={c.id} className="border-t border-gray-800 hover:bg-gray-800/50">
                    <td className="px-4 py-3">
                      {new Date(c.date).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-4 py-3 font-medium">{c.nom}</td>
                    <td className="px-4 py-3">{c.telephone}</td>
                    <td className="px-4 py-3">{c.signe}</td>
                    <td className="px-4 py-3">{c.motif}</td>
                    <td className="px-4 py-3">{c.soin}</td>
                    <td className="px-4 py-3 text-right text-emerald-400">
                      {c.montant.toFixed(2)} €
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => supprimer(c.id)}
                        className="text-red-400 hover:text-red-300"
                        aria-label={`Supprimer ${c.nom}`}
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot className="bg-gray-800 font-semibold">
              <tr>
                <td colSpan={6} className="px-4 py-3 text-right">
                  Total
                </td>
                <td className="px-4 py-3 text-right text-amber-400">
                  {total.toFixed(2)} €
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </section>
      </div>
    </main>
  );
}
