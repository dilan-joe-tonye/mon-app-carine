"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Utilisateur = { id?: number; nom: string; role: string };

type ContexteType = {
  utilisateur: Utilisateur | null;
  token: string | null;
  utilisateurs: Utilisateur[];
  connexion: (nom: string, motDePasse: string) => Promise<boolean>;
  deconnexion: () => void;
  chargerUtilisateurs: () => Promise<void>;
  ajouterUtilisateur: (nom: string, motDePasse: string, role: string) => Promise<boolean>;
  supprimerUtilisateur: (nom: string) => Promise<void>;
};

const AuthContext = createContext<ContexteType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [utilisateur, setUtilisateur] = useState<Utilisateur | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([]);

  // Restaurer la session au chargement
  useEffect(() => {
    const t = localStorage.getItem("token");
    const u = localStorage.getItem("utilisateur");
    if (t && u) {
      setToken(t);
      setUtilisateur(JSON.parse(u));
    }
  }, []);

  const connexion = async (nom: string, motDePasse: string) => {
    const reponse = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nom, motDePasse }),
    });
    if (!reponse.ok) return false;
    const data = await reponse.json();
    setToken(data.token);
    setUtilisateur(data.utilisateur);
    localStorage.setItem("token", data.token);
    localStorage.setItem("utilisateur", JSON.stringify(data.utilisateur));
    return true;
  };

  const deconnexion = () => {
    setToken(null);
    setUtilisateur(null);
    localStorage.removeItem("token");
    localStorage.removeItem("utilisateur");
  };

  const chargerUtilisateurs = async () => {
    const reponse = await fetch("/api/utilisateurs");
    if (reponse.ok) {
      const data = await reponse.json();
      setUtilisateurs(Array.isArray(data) ? data : []);
    }
  };

  const ajouterUtilisateur = async (nom: string, motDePasse: string, role: string) => {
    const reponse = await fetch("/api/utilisateurs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nom, motDePasse, role }),
    });
    if (reponse.ok) {
      await chargerUtilisateurs();
      return true;
    }
    return false;
  };

  const supprimerUtilisateur = async (nom: string) => {
    await fetch(`/api/utilisateurs?nom=${encodeURIComponent(nom)}`, { method: "DELETE" });
    await chargerUtilisateurs();
  };

  return (
    <AuthContext.Provider
      value={{ utilisateur, token, utilisateurs, connexion, deconnexion, chargerUtilisateurs, ajouterUtilisateur, supprimerUtilisateur }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const contexte = useContext(AuthContext);
  if (!contexte) throw new Error("useAuth doit être utilisé dans AuthProvider");
  return contexte;
}
