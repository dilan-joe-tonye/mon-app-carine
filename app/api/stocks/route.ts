import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const FICHIER = path.join(process.cwd(), "data", "stocks.json");

function lire() {
  if (!fs.existsSync(FICHIER)) return [];
  return JSON.parse(fs.readFileSync(FICHIER, "utf-8"));
}

export async function GET() {
  return NextResponse.json(lire());
}

export async function POST(request: Request) {
  const corps = await request.json();
  const stocks = lire();
  const nouveau = { id: Date.now(), ...corps };
  stocks.push(nouveau);
  fs.mkdirSync(path.dirname(FICHIER), { recursive: true });
  fs.writeFileSync(FICHIER, JSON.stringify(stocks, null, 2));
  return NextResponse.json(nouveau);
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  const stocks = lire().filter((s: any) => s.id !== id);
  fs.writeFileSync(FICHIER, JSON.stringify(stocks, null, 2));
  return NextResponse.json({ ok: true });
}
export async function PUT(request: Request) {
  const { id, quantite } = await request.json();
  const stocks = lire();
  const index = stocks.findIndex((s: any) => s.id === id);
  if (index === -1) {
    return NextResponse.json({ message: "Article introuvable" }, { status: 404 });
  }
  stocks[index].quantite = Number(quantite);
  fs.writeFileSync(FICHIER, JSON.stringify(stocks, null, 2));
  return NextResponse.json(stocks[index]);
}
