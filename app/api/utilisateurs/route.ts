import { NextResponse } from "next/server";
import { sql, initDB } from "@/lib/db";
import bcrypt from "bcryptjs";

let pret = false;

export async function GET() {
  try {
    if (!pret) { await initDB(); pret = true; }
    const resultat = await sql`SELECT id, nom, email, role FROM utilisateurs ORDER BY id`;
    return NextResponse.json(resultat.rows);
  } catch (erreur) {
    console.error(erreur);
    return NextResponse.json({ erreur: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(requete: Request) {
  try {
    if (!pret) { await initDB(); pret = true; }
    const { nom, email, motDePasse, role } = await requete.json();
    if (!nom || !email || !motDePasse) {
      return NextResponse.json({ erreur: "Champs manquants" }, { status: 400 });
    }
    const hash = await bcrypt.hash(motDePasse, 10);
    await sql`
      INSERT INTO utilisateurs (nom, email, mot_de_passe, role)
      VALUES (nom,{nom},nom,{email}, hash,{hash},hash,{role ?? "employe"})
    `;
    return NextResponse.json({ message: "Utilisateur créé" });
  } catch (erreur: any) {
    if (erreur?.code === "23505") {
      return NextResponse.json({ erreur: "Cet email est déjà utilisé" }, { status: 409 });
    }
    console.error(erreur);
    return NextResponse.json({ erreur: "Erreur serveur" }, { status: 500 });
  }
}
