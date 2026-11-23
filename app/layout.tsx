import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
export const metadata = {
  title: "Clinique Traditionnelle des Arbres 🌿",
  description: "Gestion de la clinique traditionnelle - arbres, stocks, ventes et consultations",
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
 <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
