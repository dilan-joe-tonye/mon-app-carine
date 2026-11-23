"use client";

import { useEffect, useState } from "react";
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

  const charger = async () => {
    if (!token) return;
    const reponse = await fetch("/api/ventes", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (reponse.ok) setVentes(await reponse.json());
  };

  useEffect(() => {
    if (token) charger();
  }, [token]);

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

  const totalJour = ventes.reduce((somme, v) => somme + v.total, 0);

  if (!utilisateur) return null;

  return (
    <div className="min-h-screen bg-green-50">
      <header className="bg-green-700 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">💰 Gestion des Ventes</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded"
          >
            ← Tableau de bord
          </button>
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

      <main className="p-8 max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-bold mb-4">➕ Enregistrer une vente</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <input
              value={article}
              onChange={(e) => setArticle(e.target.value)}
              placeholder="Article vendu"
              className="border rounded px-3 py-2"
            />
            <input
              value={quantite}
              onChange={(e) => setQuantite(e.target.value)}
              placeholder="Quantité"
              type="number"
              className="border rounded px-3 py-2"
            />
            <input
              value={prixUnitaire}
              onChange={(e) => setPrixUnitaire(e.target.value)}
              placeholder="Prix unitaire (FC)"
              type="number"
              className="border rounded px-3 py-2"
            />
            <button
              onClick={ajouterVente}
              className="bg-green-700 hover:bg-green-600 text-white rounded px-4 py-2 font-bold"
            >
              Enregistrer
            </button>
          </div>
        </div>

        <div className="bg-green-700 text-white p-6 rounded-lg shadow mb-6 text-center">
          <p className="text-lg">💵 Total des ventes</p>
          <p className="text-4xl font-bold">{totalJour} FC</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-bold mb-4">
            📋 Ventes enregistrées ({ventes.length})
          </h2>
          {ventes.length === 0 ? (
            <p className="text-gray-500">Aucune vente pour le moment.</p>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="py-2">Article</th>
                  <th className="py-2">Quantité</th>
                  <th className="py-2">Prix unitaire</th>
                  <th className="py-2">Total</th>
                  <th className="py-2"></th>
                </tr>
              </thead>
              <tbody>
                {ventes.map((vente) => (
                  <tr key={vente.id} className="border-b">
                    <td className="py-2">{vente.article}</td>
                    <td className="py-2">{vente.quantite}</td>
                    <td className="py-2">{vente.prixUnitaire} FC</td>
                    <td className="py-2 font-bold">{vente.total} FC</td>
                    <td className="py-2 text-right">
                      <button
                        onClick={() => supprimerVente(vente.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        ❌ Supprimer
                      </button>
                    </td>
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
