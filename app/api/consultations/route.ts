import { NextResponse } from "next/server";
import { sql, initDB } from "@/lib/db";
import { verifierToken } from "@/lib/auth";

export async function GET(requete: Request) {
  await initDB();
  const payload = verifierToken(requete);
  if (!payload) return NextResponse.json({ erreur: "Non autorisé" }, { status: 401 });

  const consultations = await sql`
    SELECT * FROM consultations
    WHERE utilisateur_id = ${payload.id}
    ORDER BY date DESC
  `;

  return NextResponse.json(consultations);
}

export async function POST(requete: Request) {
  await initDB();
  const payload = verifierToken(requete);
  if (!payload) return NextResponse.json({ erreur: "Non autorisé" }, { status: 401 });

  const { nom, telephone, signe, motif, soin, montant } = await requete.json();

  if (!nom || !telephone || !signe || !motif || montant == null) {
    return NextResponse.json({ erreur: "Champs manquants" }, { status: 400 });
  }

  const resultat = await sql`
    INSERT INTO consultations (utilisateur_id, nom, telephone, signe, motif, soin, montant)
    VALUES (payload.id,{payload.id},payload.id,{nom}, telephone,{telephone},telephone,{signe}, motif,{motif},motif,{soin ?? ""}, ${montant})
    RETURNING *
  `;

  return NextResponse.json(resultat[0], { status: 201 });
}
