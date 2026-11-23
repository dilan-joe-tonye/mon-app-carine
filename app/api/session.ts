import { promises as fs } from "fs";
import path from "path";

export type Session = { token: string; nom: string; role: string };

const CHEMIN = path.join(process.cwd(), "data", "sessions.json");

export async function creerSession(nom: string, role: string): Promise<string> {
  const token = crypto.randomUUID();
  let sessions: Session[] = [];
  try {
    sessions = JSON.parse(await fs.readFile(CHEMIN, "utf-8"));
  } catch {}
  sessions.push({ token, nom, role });
  await fs.writeFile(CHEMIN, JSON.stringify(sessions, null, 2));
  return token;
}

export async function verifierSession(requete: Request): Promise<Session | null> {
  const auth = requete.headers.get("Authorization");
  if (!auth || !auth.startsWith("Bearer ")) return null;
  const token = auth.slice(7);
  try {
    const sessions: Session[] = JSON.parse(await fs.readFile(CHEMIN, "utf-8"));
    return sessions.find((s) => s.token === token) ?? null;
  } catch {
    return null;
  }
}
