"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Utilisateur = { nom: string; motDePasse?: string; role: string };

type AuthContextType = {
  utilisateur: Utilisateur | null;
  token: string | null;
  utilisateurs: Utilisateur[];
  connexion: (nom: string, motDePasse: string) => Promise<boolean>;
  deconnexion: () => void;
  chargerUtilisateurs: () => Promise<void>;
  ajouterUtilisateur: (nom: string, motDePasse: string, role: string) => Promise<boolean>;
  supprimerUtilisateur: (nom: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  utilisateur: null,
  token: null,
  utilisateurs: [],
  connexion: async () => false,
  deconnexion: () => {},
  chargerUtilisateurs: async () => {},
  ajouterUtilisateur: async () => false,
  supprimerUtilisateur: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [utilisateur, setUtilisateur] = useState<Utilisateur | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([]);

  // 🔄 On restaure la session au chargement de la page
  useEffect(() => {
    const u = localStorage.getItem("utilisateur");
    const t = localStorage.getItem("token");
    if (u && t) {
      setUtilisateur(JSON.parse(u));
      setToken(t);
    }
  }, []);

  const connexion = async (nom: string, motDePasse: string) => {
    const reponse = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nom, motDePasse }),
    });
    if (!reponse.ok) return false;
    const data = await reponse.json();
    setUtilisateur(data.utilisateur);
    setToken(data.token);
    localStorage.setItem("utilisateur", JSON.stringify(data.utilisateur));
    localStorage.setItem("token", data.token);
    return true;
  };

  const deconnexion = () => {
    setUtilisateur(null);
    setToken(null);
    setUtilisateurs([]);
    localStorage.removeItem("utilisateur");
    localStorage.removeItem("token");
  };

  // 📥 Charger la liste des comptes depuis l'API
  const chargerUtilisateurs = async () => {
    if (!token) return;
    const r = await fetch("/api/utilisateurs", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!r.ok) return;
    const data = await r.json();
    if (Array.isArray(data)) setUtilisateurs(data);
  };

  // ➕ Créer un compte
  const ajouterUtilisateur = async (nom: string, motDePasse: string, role: string) => {
    if (!token) return false;
    const r = await fetch("/api/utilisateurs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ nom, motDePasse, role }),
    });
    if (!r.ok) return false;
    await chargerUtilisateurs(); // 🔄 rafraîchit la liste
    return true;
  };

  // 🗑️ Supprimer un compte
  const supprimerUtilisateur = async (nom: string) => {
    if (!token) return;
    await fetch(`/api/utilisateurs?nom=${encodeURIComponent(nom)}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    await chargerUtilisateurs(); // 🔄 rafraîchit la liste
  };

  return (
    <AuthContext.Provider
      value={{
        utilisateur,
        token,
        utilisateurs,
        connexion,
        deconnexion,
        chargerUtilisateurs,
        ajouterUtilisateur,
        supprimerUtilisateur,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
