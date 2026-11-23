import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sql, initDB } from "@/lib/db";

// GET : liste des utilisateurs (sans les mots de passe !)
export async function GET() {
  await initDB();
  const utilisateurs = await sql`
    SELECT nom, role FROM utilisateurs ORDER BY nom
  `;
  return NextResponse.json(utilisateurs);
}

// POST : créer un nouvel employé
export async function POST(requete: Request) {
  await initDB();
  const { nom, motDePasse, role } = await requete.json();

  if (!nom || !motDePasse) {
    return NextResponse.json({ erreur: "Nom et mot de passe requis" }, { status: 400 });
  }

  const existants = await sql`
    SELECT id FROM utilisateurs WHERE nom = ${nom}
  `;
  if (existants.length > 0) {
    return NextResponse.json({ erreur: "Ce nom est déjà utilisé" }, { status: 400 });
  }

  // 🔐 CHIFFRAGE du mot de passe avec bcrypt
  const motDePasseChiffre = await bcrypt.hash(motDePasse, 10);

  const nouveau = await sql`
    INSERT INTO utilisateurs (nom, mot_de_passe, role)
    VALUES (nom,{nom},nom,{motDePasseChiffre}, ${role || "employe"})
    RETURNING nom, role
  `;

  return NextResponse.json({ message: `Compte "${nom}" créé !` }, { status: 201 });
}

// DELETE : supprimer un employé
export async function DELETE(requete: Request) {
  await initDB();
  const { searchParams } = new URL(requete.url);
  const nom = searchParams.get("nom");

  if (!nom || nom === "carine") {
    return NextResponse.json({ erreur: "Suppression interdite" }, { status: 400 });
  }

  await sql`
    DELETE FROM utilisateurs WHERE nom = ${nom}
  `;

  return NextResponse.json({ message: "Utilisateur supprimé" });
}
