"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

type Arbre = {
  id: number;
  nom: string;
  quantite: number;
  prix: number;
};

export default function PageArbres() {
  const { utilisateur, deconnexion } = useAuth();
  const router = useRouter();

  const [arbres, setArbres] = useState<Arbre[]>([]);
  const [nom, setNom] = useState("");
  const [quantite, setQuantite] = useState("");
  const [prix, setPrix] = useState("");

  useEffect(() => {
    if (!utilisateur) router.push("/login");
  }, [utilisateur, router]);

  // Charger les arbres depuis la base de données partagée
  useEffect(() => {
    fetch("/api/arbres")
      .then((reponse) => reponse.json())
      .then((data) => setArbres(data));
  }, []);

  const ajouterArbre = async () => {
    if (!nom.trim() || !quantite || !prix) {
      alert("Veuillez remplir tous les champs !");
      return;
    }
    const reponse = await fetch("/api/arbres", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nom: nom.trim(),
        quantite: Number(quantite),
        prix: Number(prix),
      }),
    });
    const nouvelArbre = await reponse.json();
    setArbres([...arbres, nouvelArbre]);
    setNom("");
    setQuantite("");
    setPrix("");
  };

  const supprimerArbre = async (id: number) => {
    if (confirm("Supprimer cet arbre ?")) {
      await fetch("/api/arbres", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setArbres(arbres.filter((a) => a.id !== id));
    }
  };

  if (!utilisateur) return null;

  return (
    <div className="min-h-screen bg-green-50">
      <header className="bg-green-700 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">🌳 Gestion des Arbres</h1>
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
        {/* Formulaire d'ajout */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-bold mb-4">➕ Ajouter un arbre</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <input
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="Nom de l'arbre"
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
              value={prix}
              onChange={(e) => setPrix(e.target.value)}
              placeholder="Prix (FC)"
              type="number"
              className="border rounded px-3 py-2"
            />
            <button
              onClick={ajouterArbre}
              className="bg-green-700 hover:bg-green-600 text-white rounded px-4 py-2 font-bold"
            >
              Ajouter
            </button>
          </div>
        </div>

        {/* Liste des arbres */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-bold mb-4">
            📋 Liste des arbres ({arbres.length})
          </h2>
          {arbres.length === 0 ? (
            <p className="text-gray-500">Aucun arbre pour le moment.</p>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="py-2">Nom</th>
                  <th className="py-2">Quantité</th>
                  <th className="py-2">Prix</th>
                  <th className="py-2"></th>
                </tr>
              </thead>
              <tbody>
                {arbres.map((arbre) => (
                  <tr key={arbre.id} className="border-b">
                    <td className="py-2">{arbre.nom}</td>
                    <td className="py-2">{arbre.quantite}</td>
                    <td className="py-2">{arbre.prix} FC</td>
                    <td className="py-2 text-right">
                      {utilisateur.role === "administrateur" && (
                        <button
                          onClick={() => supprimerArbre(arbre.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          ❌ Supprimer
                        </button>
                      )}
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
