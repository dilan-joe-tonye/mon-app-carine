"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

type Stock = {
  id: number;
  nom: string;
  quantite: number;
  unite: string;
};

export default function PageStocks() {
  const { utilisateur, deconnexion } = useAuth();
  const router = useRouter();

  const [stocks, setStocks] = useState<Stock[]>([]);
  const [nom, setNom] = useState("");
  const [quantite, setQuantite] = useState("");
  const [unite, setUnite] = useState("kachas");

  useEffect(() => {
    if (!utilisateur) router.push("/login");
  }, [utilisateur, router]);

  // Charger les stocks depuis la base de données partagée
  useEffect(() => {
    fetch("/api/stocks")
      .then((reponse) => reponse.json())
      .then((data) => setStocks(data));
  }, []);

  const ajouterStock = async () => {
    if (!nom.trim() || !quantite) {
      alert("Veuillez remplir tous les champs !");
      return;
    }
    const reponse = await fetch("/api/stocks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nom: nom.trim(),
        quantite: Number(quantite),
        unite,
      }),
    });
    const nouveau = await reponse.json();
    setStocks([...stocks, nouveau]);
    setNom("");
    setQuantite("");
  };

  const supprimerStock = async (id: number) => {
    if (confirm("Supprimer cet article du stock ?")) {
      await fetch("/api/stocks", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setStocks(stocks.filter((s) => s.id !== id));
    }
  };

   const changerQuantite = async (id: number, quantiteActuelle: number, delta: number) => {
    const nouvelleQuantite = quantiteActuelle + delta;
    if (nouvelleQuantite < 0) return;
    await fetch("/api/stocks", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, quantite: nouvelleQuantite }),
    });
    setStocks(
      stocks.map((s) => (s.id === id ? { ...s, quantite: nouvelleQuantite } : s))
    );
  };


  if (!utilisateur) return null;

  return (
    <div className="min-h-screen bg-green-50">
      <header className="bg-green-700 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">📦 Gestion des Stocks</h1>
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
          <h2 className="text-lg font-bold mb-4">➕ Ajouter au stock</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <input
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="Nom de l'article"
              className="border rounded px-3 py-2"
            />
            <input
              value={quantite}
              onChange={(e) => setQuantite(e.target.value)}
              placeholder="Quantité"
              type="number"
              className="border rounded px-3 py-2"
            />
            <select
              value={unite}
              onChange={(e) => setUnite(e.target.value)}
              className="border rounded px-3 py-2"
            >
              <option value="kachas">kachas</option>
              <option value="bouteilles">bouteilles</option>
              <option value="sacs">sacs</option>
              <option value="paquets">paquets</option>
            </select>
            <button
              onClick={ajouterStock}
              className="bg-green-700 hover:bg-green-600 text-white rounded px-4 py-2 font-bold"
            >
              Ajouter
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-bold mb-4">
            📋 Articles en stock ({stocks.length})
          </h2>
          {stocks.length === 0 ? (
            <p className="text-gray-500">Aucun article pour le moment.</p>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="py-2">Article</th>
                  <th className="py-2">Quantité</th>
                  <th className="py-2"></th>
                </tr>
              </thead>
              <tbody>
                {stocks.map((stock) => (
                  <tr key={stock.id} className="border-b">
                    <td className="py-2">{stock.nom}</td>
                    <td className="py-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => changerQuantite(stock.id, stock.quantite, -1)}
                          className="bg-orange-500 hover:bg-orange-600 text-white w-7 h-7 rounded font-bold"
                          title="Retirer 1"
                        >
                          −
                        </button>
                        <span className="w-24 text-center">
                          {stock.quantite} {stock.unite}
                          {stock.quantite <= 3 && (
                            <span className="text-red-600 font-bold block">⚠️ Stock faible !</span>
                          )}
                        </span>
                        <button
                          onClick={() => changerQuantite(stock.id, stock.quantite, 1)}
                          className="bg-blue-500 hover:bg-blue-600 text-white w-7 h-7 rounded font-bold"
                          title="Ajouter 1"
                        >
                          +
                        </button>
                      </div>
                    </td>

                    <td className="py-2 text-right">
                      {utilisateur.role === "administrateur" && (
                        <button
                          onClick={() => supprimerStock(stock.id)}
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
