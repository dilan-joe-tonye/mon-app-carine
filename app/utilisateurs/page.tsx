"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

type Utilisateur = { nom: string; role: string };

export default function Utilisateurs() {
  const { utilisateur, utilisateurs, ajouterUtilisateur, supprimerUtilisateur, chargerUtilisateurs } = useAuth();
  const router = useRouter();

  const [nom, setNom] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [role, setRole] = useState<"administrateur" | "employe">("employe");
  const [message, setMessage] = useState("");

  // ✅ Tous les hooks sont AVANT toute sortie anticipée
  useEffect(() => {
    if (utilisateur?.role === "administrateur") {
      chargerUtilisateurs();
    }
  }, [utilisateur]);

  if (!utilisateur) return null;

  // Seul l'administrateur accède à cette page
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

  const handleAjouter = async () => {
    if (!nom || !motDePasse) {
      setMessage("⚠️ Remplissez tous les champs");
      return;
    }
    const succes = await ajouterUtilisateur(nom, motDePasse, role);
    if (succes) {
      setMessage(`✅ Compte "${nom}" créé !`);
      setNom("");
      setMotDePasse("");
    } else {
      setMessage("⚠️ Ce nom est déjà utilisé");
    }
  };

  // 🛡️ Filet de sécurité : si la liste n'est pas encore un tableau, on affiche []
  const liste = Array.isArray(utilisateurs) ? utilisateurs : [];

  return (
    <div className="min-h-screen bg-green-50 p-8">
      <button
        onClick={() => router.push("/dashboard")}
        className="mb-6 text-green-700 hover:underline"
      >
        ← Retour au tableau de bord
      </button>

      <h1 className="text-2xl font-bold mb-6">👥 Gestion des employés</h1>

      {/* Formulaire de création */}
      <div className="bg-white p-6 rounded-lg shadow mb-8 max-w-md">
        <h2 className="font-bold mb-4">➕ Créer un compte</h2>
        <input
          type="text"
          placeholder="Nom de l'employé"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          className="border p-2 rounded w-full mb-3"
        />
        <input
          type="text"
          placeholder="Mot de passe"
          value={motDePasse}
          onChange={(e) => setMotDePasse(e.target.value)}
          className="border p-2 rounded w-full mb-3"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as "administrateur" | "employe")}
          className="border p-2 rounded w-full mb-3"
        >
          <option value="employe">Employé</option>
          <option value="administrateur">Administrateur</option>
        </select>
        <button
          onClick={handleAjouter}
          className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded w-full"
        >
          Créer le compte
        </button>
        {message && <p className="mt-3 text-sm">{message}</p>}
      </div>

      {/* Liste des comptes */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="font-bold mb-4">📋 Comptes existants</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-2">Nom</th>
              <th className="p-2">Rôle</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {liste.map((u) => (
              <tr key={u.nom} className="border-b">
                <td className="p-2">{u.nom}</td>
                <td className="p-2">{u.role}</td>
                <td className="p-2">
                  {u.nom !== "carine" && (
                    <button
                      onClick={() => supprimerUtilisateur(u.nom)}
                      className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Supprimer
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
