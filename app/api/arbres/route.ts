import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const FICHIER = path.join(process.cwd(), "data", "arbres.json");

// Lire les arbres
function lire() {
  if (!fs.existsSync(FICHIER)) return [];
  return JSON.parse(fs.readFileSync(FICHIER, "utf-8"));
}

// GET : renvoyer la liste
export async function GET() {
  return NextResponse.json(lire());
}

// POST : ajouter un arbre
export async function POST(request: Request) {
  const corps = await request.json();
  const arbres = lire();
  const nouveau = { id: Date.now(), ...corps };
  arbres.push(nouveau);
  fs.mkdirSync(path.dirname(FICHIER), { recursive: true });
  fs.writeFileSync(FICHIER, JSON.stringify(arbres, null, 2));
  return NextResponse.json(nouveau);
}

// DELETE : supprimer un arbre
export async function DELETE(request: Request) {
  const { id } = await request.json();
  const arbres = lire().filter((a: any) => a.id !== id);
  fs.writeFileSync(FICHIER, JSON.stringify(arbres, null, 2));
  return NextResponse.json({ ok: true });
}
