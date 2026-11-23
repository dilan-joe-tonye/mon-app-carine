import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sql, initDB } from "@/lib/db";

// Lister tous les utilisateurs
export async function GET() {
  await initDB();
  const utilisateurs = await sql`
    SELECT id, nom, role FROM utilisateurs ORDER BY id
  `;
  return NextResponse.json(utilisateurs);
}

// Créer un compte
export async function POST(requete: Request) {
  await initDB();
  const { nom, motDePasse, role } = await requete.json();

  if (!nom || !motDePasse) {
    return NextResponse.json({ erreur: "Nom et mot de passe requis" }, { status: 400 });
  }

  // Vérifier si le nom existe déjà
  const existants = await sql`
    SELECT id FROM utilisateurs WHERE nom = ${nom}
  `;
  if (existants.length > 0) {
    return NextResponse.json({ erreur: "Ce nom est déjà utilisé" }, { status: 409 });
  }

  const hash = await bcrypt.hash(motDePasse, 10);
  const nouveau = await sql`
    INSERT INTO utilisateurs (nom, mot_de_passe, role)
    VALUES (nom,{nom},nom,{hash}, ${role || "Employé"})
    RETURNING id, nom, role
  `;

  return NextResponse.json(nouveau[0], { status: 201 });
}
