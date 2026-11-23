import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sql, initDB } from "@/lib/db";

const SECRET = process.env.JWT_SECRET || "change-moi-en-production";

export async function POST(requete: Request) {
  await initDB();
  const { email, motDePasse } = await requete.json();

  const utilisateurs = await sql`
    SELECT * FROM utilisateurs WHERE email = ${email}
  `;
  const utilisateur = utilisateurs[0];

  if (!utilisateur || !(await bcrypt.compare(motDePasse, utilisateur.mot_de_passe))) {
    return NextResponse.json({ erreur: "Identifiants invalides" }, { status: 401 });
  }

  const token = jwt.sign(
    { id: utilisateur.id, nom: utilisateur.nom, email: utilisateur.email },
    SECRET,
    { expiresIn: "7d" }
  );

  return NextResponse.json({
    token,
    utilisateur: { id: utilisateur.id, nom: utilisateur.nom, email: utilisateur.email },
  });
}
