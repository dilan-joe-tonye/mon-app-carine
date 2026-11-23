"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [nom, setNom] = useState("");
  const [passe, setPasse] = useState("");
  const [erreur, setErreur] = useState(false);
  const { connexion } = useAuth();
  const router = useRouter();

    const soumettre = async (e: React.FormEvent) => {
    e.preventDefault();
    const succes = await connexion(nom, passe);
    if (succes) {
      router.push("/dashboard");
    } else {
      setErreur(true);
    }
  };


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-800 to-green-500 px-4">
      <div className="text-6xl mb-2">🌳</div>
      <h1 className="text-white text-xl font-bold text-center mb-8">
        Clinique Traditionnelle des Arbres
        <br />
        de Maman Carine
      </h1>

<div className="flex flex-col items-center mb-4">
  <img src="/logo.png.jpeg" alt="Logo" className="w-32 h-32 object-contain" />
  <h1 className="text-xl font-bold text-green-800 mt-2 text-center">
    Clinique Traditionnelle des Arbres 🌿
  </h1>
</div>


      <form onSubmit={soumettre} className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
        <label className="block text-sm font-semibold text-green-800 mb-1">
          👤 Nom d&apos;utilisateur
        </label>
        <input
          type="text"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          placeholder="Ex : carine"
          className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
        />

        <label className="block text-sm font-semibold text-green-800 mb-1 mt-4">
          🔒 Mot de passe
        </label>
        <input
          type="password"
          value={passe}
          onChange={(e) => setPasse(e.target.value)}
          placeholder="••••••"
          className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
        />

        {erreur && (
          <p className="text-red-600 text-sm text-center mt-3">
            ❌ Identifiants incorrects
          </p>
        )}

        <button
          type="submit"
          className="w-full mt-6 p-3 bg-green-800 text-white font-bold rounded-lg hover:bg-green-700 active:scale-95 transition"
        >
          Se connecter
        </button>
      </form>
    </div>
  );
}
