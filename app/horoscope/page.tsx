"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const SIGNES = ["Bélier", "Taureau", "Gémeaux", "Cancer", "Lion", "Vierge", "Balance", "Scorpion", "Sagittaire", "Capricorne", "Verseau", "Poissons"];

const HOROSCOPES: Record<string, string> = {
  "Bélier": "Votre énergie attire les bonnes nouvelles. Un remède à base de racines renforcera votre chance.",
  "Taureau": "Patience et persévérance vous porteront chance. Évitez les disputes inutiles aujourd'hui.",
  "Gémeaux": "Une rencontre importante est proche. Portez une pierre protectrice.",
  "Cancer": "Vos ancêtres veillent sur vous. Faites une offrande de gratitude.",
  "Lion": "Jour favorable pour les affaires et l'argent. Agissez avec confiance.",
  "Vierge": "Prenez soin de votre santé. Un bain de plantes purificatrices est conseillé.",
  "Balance": "L'harmonie revient dans votre foyer. Pardonnez pour avancer.",
  "Scorpion": "Attention aux fausses amitiés. Un talisman vous protégera.",
  "Sagittaire": "Voyage ou nouvelle opportunité en vue. Restez ouvert.",
  "Capricorne": "Vos efforts seront bientôt récompensés. Ne baissez pas les bras.",
  "Verseau": "Laissez le passé derrière vous. Un nouveau chapitre commence.",
  "Poissons": "Faites confiance à votre intuition, elle ne vous trompera pas aujourd'hui.",
};

export default function PageHoroscope() {
  const router = useRouter();
  const [signeChoisi, setSigneChoisi] = useState("");

  return (
    <div className="min-h-screen bg-green-50">
      <header className="bg-green-900 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">🔮 Horoscope du Jour</h1>
        <button onClick={() => router.push("/dashboard")} className="bg-green-700 hover:bg-green-600 px-4 py-2 rounded">
          ← Tableau de bord
        </button>
      </header>

      <main className="p-8 max-w-2xl mx-auto text-center">
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-bold mb-4">Choisissez votre signe</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {SIGNES.map((s) => (
              <button
                key={s}
                onClick={() => setSigneChoisi(s)}
                className={"border rounded px-3 py-2 hover:bg-green-100 " + (signeChoisi === s ? "bg-green-700 text-white" : "bg-white")}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {signeChoisi && (
          <div className="bg-green-700 text-white p-8 rounded-lg shadow-lg">
            <p className="text-4xl mb-2">✨</p>
            <h3 className="text-2xl font-bold mb-4">{signeChoisi}</h3>
            <p className="text-lg">{HOROSCOPES[signeChoisi]}</p>
          </div>
        )}
      </main>
    </div>
  );
}

