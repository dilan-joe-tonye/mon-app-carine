import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { verifierSession } from "../session";

const CHEMIN = path.join(process.cwd(), "data", "consultations.json");

type Consultation = { id: number; [key: string]: any };

async function lireConsultations(): Promise<Consultation[]> {
  try {
    return JSON.parse(await fs.readFile(CHEMIN, "utf-8"));
  } catch {
    return [];
  }
}

export async function GET(requete: Request) {
  const session = await verifierSession(requete);
  if (!session)
    return NextResponse.json({ erreur: "Non autorisé" }, { status: 401 });
  return NextResponse.json(await lireConsultations());
}

export async function POST(requete: Request) {
  const session = await verifierSession(requete);
  if (!session)
    return NextResponse.json({ erreur: "Non autorisé" }, { status: 401 });
  const body = await requete.json();
  const consultations = await lireConsultations();
  const nouveau: Consultation = { id: Date.now(), ...body };
  consultations.push(nouveau);
  await fs.writeFile(CHEMIN, JSON.stringify(consultations, null, 2));
  return NextResponse.json(nouveau);
}

export async function DELETE(requete: Request) {
  const session = await verifierSession(requete);
  if (!session)
    return NextResponse.json({ erreur: "Non autorisé" }, { status: 401 });
  const { searchParams } = new URL(requete.url);
  const id = Number(searchParams.get("id"));
  const consultations = await lireConsultations();
  await fs.writeFile(
    CHEMIN,
    JSON.stringify(consultations.filter((c: Consultation) => c.id !== id), null, 2)
  );
  return NextResponse.json({ ok: true });
}
