import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { verifierSession } from "../session";

const CHEMIN = path.join(process.cwd(), "data", "ventes.json");

type Vente = { id: number; [key: string]: any };

async function lireVentes(): Promise<Vente[]> {
  try {
    return JSON.parse(await fs.readFile(CHEMIN, "utf-8"));
  } catch {
    return [];
  }
}

// 📦 Déduire automatiquement du stock après une vente
async function deduireStock(article: any, quantite: any) {
  try {
    const fichierStocks = path.join(process.cwd(), "data", "stocks.json");
    let stocks: any[] = [];
    try {
      stocks = JSON.parse(await fs.readFile(fichierStocks, "utf-8"));
    } catch {}

    // On cherche un article du stock dont le nom correspond à l'article vendu
    const index = stocks.findIndex(
      (s: any) => s.nom.toLowerCase() === String(article).toLowerCase()
    );

    if (index !== -1) {
      stocks[index].quantite = Math.max(0, stocks[index].quantite - Number(quantite));
      await fs.writeFile(fichierStocks, JSON.stringify(stocks, null, 2));
    }
  } catch (e) {
    console.log("Pas de déduction de stock :", e);
  }
}

export async function GET(requete: Request) {
  const session = await verifierSession(requete);
  if (!session)
    return NextResponse.json({ erreur: "Non autorisé" }, { status: 401 });
  return NextResponse.json(await lireVentes());
}

export async function POST(requete: Request) {
  const session = await verifierSession(requete);
  if (!session)
    return NextResponse.json({ erreur: "Non autorisé" }, { status: 401 });
  const body = await requete.json();
  const ventes = await lireVentes();
  const nouvelle: Vente = { id: Date.now(), ...body };
  ventes.push(nouvelle);
  await fs.writeFile(CHEMIN, JSON.stringify(ventes, null, 2));

  // 📦 On déduit le stock après avoir enregistré la vente
  await deduireStock(body.article, body.quantite);

  return NextResponse.json(nouvelle);
}

export async function DELETE(requete: Request) {
  const session = await verifierSession(requete);
  if (!session)
    return NextResponse.json({ erreur: "Non autorisé" }, { status: 401 });
  const { searchParams } = new URL(requete.url);
  const id = Number(searchParams.get("id"));
  const ventes = await lireVentes();
  await fs.writeFile(
    CHEMIN,
    JSON.stringify(ventes.filter((v: Vente) => v.id !== id), null, 2)
  );
  return NextResponse.json({ ok: true });
}
