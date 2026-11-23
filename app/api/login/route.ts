import { promises as fs } from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { creerSession } from "../session";

export async function POST(requete: Request) {
  const { nom, motDePasse } = await requete.json();

  const chemin = path.join(process.cwd(), "data", "utilisateurs.json");
  let utilisateurs: { nom: string; motDePasse: string; role: string }[] = [];
  try {
    utilisateurs = JSON.parse(await fs.readFile(chemin, "utf-8"));
  } catch {}

  const u = utilisateurs.find((x) => x.nom === nom);
  if (!u || !(await bcrypt.compare(motDePasse, u.motDePasse))) {
    return NextResponse.json(
      { erreur: "Nom ou mot de passe incorrect" },
      { status: 401 }
    );
  }

  const token = await creerSession(u.nom, u.role);
  return NextResponse.json({ token, utilisateur: { nom: u.nom, role: u.role } });
}
