import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

const CHEMIN = path.join(process.cwd(), "data", "utilisateurs.json");

function lireUtilisateurs() {
  const contenu = fs.readFileSync(CHEMIN, "utf-8");
  return JSON.parse(contenu);
}

function ecrireUtilisateurs(liste: unknown[]) {
  fs.writeFileSync(CHEMIN, JSON.stringify(liste, null, 2), "utf-8");
}

// GET : liste des utilisateurs (sans les mots de passe !)
export async function GET() {
  const utilisateurs = lireUtilisateurs();
  const sansMotsDePasse = utilisateurs.map((u: { motDePasse: string; nom: string; role: string }) => ({
    nom: u.nom,
    role: u.role,
  }));
  return NextResponse.json(sansMotsDePasse);
}

// POST : créer un nouvel employé
export async function POST(requete: Request) {
  const body = await requete.json();
  const { nom, motDePasse, role } = body;

  if (!nom || !motDePasse) {
    return NextResponse.json({ erreur: "Nom et mot de passe requis" }, { status: 400 });
  }

  const utilisateurs = lireUtilisateurs();

  if (utilisateurs.some((u: { nom: string }) => u.nom === nom)) {
    return NextResponse.json({ erreur: "Ce nom est déjà utilisé" }, { status: 400 });
  }

  // 🔐 CHIFFRAGE du mot de passe avec bcrypt
  const motDePasseChiffre = await bcrypt.hash(motDePasse, 10);

  utilisateurs.push({ nom, motDePasse: motDePasseChiffre, role: role || "employe" });
  ecrireUtilisateurs(utilisateurs);

  return NextResponse.json({ message: `Compte "${nom}" créé !` }, { status: 201 });
}

// DELETE : supprimer un employé
export async function DELETE(requete: Request) {
  const { searchParams } = new URL(requete.url);
  const nom = searchParams.get("nom");

  if (!nom || nom === "carine") {
    return NextResponse.json({ erreur: "Suppression interdite" }, { status: 400 });
  }

  const utilisateurs = lireUtilisateurs();
  const nouvelleListe = utilisateurs.filter((u: { nom: string }) => u.nom !== nom);
  ecrireUtilisateurs(nouvelleListe);

  return NextResponse.json({ message: "Utilisateur supprimé" });
}
