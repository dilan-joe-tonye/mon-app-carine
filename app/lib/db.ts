import { neon } from "@neondatabase/serverless";

export const sql = neon(process.env.DATABASE_URL!);

// Création des tables au premier appel
export async function initDB() {
  await sql`
    CREATE TABLE IF NOT EXISTS utilisateurs (
      id SERIAL PRIMARY KEY,
      nom TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      mot_de_passe TEXT NOT NULL
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS consultations (
      id SERIAL PRIMARY KEY,
      utilisateur_id INTEGER NOT NULL REFERENCES utilisateurs(id),
      nom TEXT NOT NULL,
      telephone TEXT NOT NULL,
      signe TEXT NOT NULL,
      motif TEXT NOT NULL,
      soin TEXT DEFAULT '',
      montant NUMERIC(10,2) NOT NULL,
      date TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `;
}
export async function initDB() {
  await sql`
    CREATE TABLE IF NOT EXISTS utilisateurs (
      id SERIAL PRIMARY KEY,
      nom TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      mot_de_passe TEXT NOT NULL
    )
  `;
  // ✅ Ajoute la colonne role si elle n'existe pas (pour les anciennes tables)
  await sql`ALTER TABLE utilisateurs ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'employe'`;

  await sql`
    CREATE TABLE IF NOT EXISTS consultations (
      id SERIAL PRIMARY KEY,
      utilisateur_id INTEGER NOT NULL REFERENCES utilisateurs(id),
      nom TEXT NOT NULL,
      telephone TEXT NOT NULL,
      signe TEXT NOT NULL,
      motif TEXT NOT NULL,
      soin TEXT DEFAULT '',
      montant NUMERIC(10,2) NOT NULL,
      date TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `;

  // ✅ La table ventes (pour la page Rapport)
  await sql`
    CREATE TABLE IF NOT EXISTS ventes (
      id SERIAL PRIMARY KEY,
      utilisateur_id INTEGER REFERENCES utilisateurs(id),
      article TEXT NOT NULL,
      quantite INTEGER NOT NULL,
      total NUMERIC(10,2) NOT NULL,
      date TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `;
}
