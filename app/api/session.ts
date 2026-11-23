import crypto from "crypto";

export type Session = { nom: string; role: string };

// 🔑 Secret de signature (mettez-le dans les variables d'environnement Vercel !)
const SECRET =
  process.env.SECRET_SESSIONS ||
  "secret-temporaire-a-changer-absolument-123456789";

// ⏳ Durée de vie d'une session : 7 jours (en millisecondes)
const DUREE_SESSION = 7 * 24 * 60 * 60 * 1000;

function signer(donnees: string): string {
  return crypto.createHmac("sha256", SECRET).update(donnees).digest("hex");
}

export async function creerSession(nom: string, role: string): Promise<string> {
  const expiration = Date.now() + DUREE_SESSION;

  // 📦 Charge utile du token
  const charge = Buffer.from(
    JSON.stringify({ nom, role, expiration })
  ).toString("base64url");

  // ✍️ Signature pour prouver que le token n'a pas été falsifié
  const signature = signer(charge);

  return `charge.{charge}.charge.{signature}`;
}

export async function verifierSession(requete: Request): Promise<Session | null> {
  const auth = requete.headers.get("Authorization");
  if (!auth || !auth.startsWith("Bearer ")) return null;
  const token = auth.slice(7);

  const [charge, signature] = token.split(".");
  if (!charge || !signature) return null;

  // 🔒 On vérifie la signature : le token a-t-il bien été créé par nous ?
  const signatureAttendue = signer(charge);
  const valide = crypto.timingSafeEqual(
    Buffer.from(signature, "hex"),
    Buffer.from(signatureAttendue, "hex")
  );
  if (!valide) return null;

  try {
    const donnees = JSON.parse(Buffer.from(charge, "base64url").toString());

    // ⏰ Session expirée ?
    if (Date.now() > donnees.expiration) return null;

    return { nom: donnees.nom, role: donnees.role };
  } catch {
    return null;
  }
}
