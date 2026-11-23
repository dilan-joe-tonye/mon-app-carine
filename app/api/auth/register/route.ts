import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sql, initDB } from "@/lib/db";

export async function POST(requete: Request) {
  await initDB();
  const { nom, email, motDePasse } = await requete.json();

  if (!nom || !email || !motDePasse) {
    return NextResponse.json({ erreur: "Champs manquants" }, { status: 400 });
  }

  const existant = await sql`
    SELECT id FROM utilisateurs WHERE email = ${email}
  `;
  if (existant.length > 0) {
    return NextResponse.json({ erreur: "Email déjà utilisé" }, { status: 409 });
  }

  const hash = await bcrypt.hash(motDePasse, 10);

  const resultat = await sql`
    INSERT INTO utilisateurs (nom, email, mot_de_passe)
    VALUES (nom,{nom},nom,{email}, ${hash})
    RETURNING id
  `;

  return NextResponse.json({ id: resultat[0].id }, { status: 201 });
}
