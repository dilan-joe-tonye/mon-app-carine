import { NextResponse } from "next/server";
import { sql, initDB } from "@/lib/db";
import { verifierToken } from "@/lib/auth";

export async function DELETE(
  requete: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await initDB();
  const payload = verifierToken(requete);
  if (!payload) return NextResponse.json({ erreur: "Non autorisé" }, { status: 401 });

  const { id } = await params;

  const resultat = await sql`
    DELETE FROM consultations
    WHERE id = Number(id)ANDutilisateurid={Number(id)} AND utilisateur_id =Number(id)ANDutilisateuri​d={payload.id}
    RETURNING id
  `;

  if (resultat.length === 0) {
    return NextResponse.json({ erreur: "Introuvable" }, { status: 404 });
  }

  return NextResponse.json({ succes: true });
}
