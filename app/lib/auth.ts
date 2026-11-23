import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "change-moi-en-production";

export function verifierToken(requete: Request) {
  const entete = requete.headers.get("authorization");
  if (!entete?.startsWith("Bearer ")) return null;
  try {
    return jwt.verify(entete.slice(7), SECRET) as { id: number };
  } catch {
    return null;
  }
}
