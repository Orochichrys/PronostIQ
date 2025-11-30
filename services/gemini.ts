import { GoogleGenAI } from "@google/genai";
import { Match, PredictionDetail } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to clean JSON from markdown code blocks
const cleanJson = (text: string): string => {
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json/, '').replace(/```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```/, '').replace(/```$/, '');
  }
  return cleaned.trim();
};

/**
 * Fetches real live or upcoming matches using Google Search Grounding.
 * We cannot use responseMimeType: "application/json" with googleSearch tool,
 * so we must prompt carefully and parse manually.
 */
export const fetchLiveMatches = async (): Promise<Match[]> => {
  try {
    const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    
    const prompt = `
      Trouve les 8 matchs de football les plus importants qui se jouent aujourd'hui (${today}).
      Cherche les scores en direct si le match a commencé.
      
      Renvoie UNIQUEMENT un tableau JSON brut (sans markdown).
      Structure attendue pour chaque objet du tableau :
      {
        "id": "chaine unique",
        "homeTeam": "Nom équipe domicile",
        "awayTeam": "Nom équipe extérieur",
        "league": "Nom de la ligue",
        "time": "Heure du match (HH:MM) ou 'LIVE' ou 'FINI'",
        "status": "UPCOMING" ou "LIVE" ou "FINISHED",
        "score": "X-Y" (ou null si pas commencé)
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "Tu es une API de données sportives. Tu renvoies uniquement du JSON valide basé sur des recherches web réelles. Pas de texte avant ou après."
      }
    });

    const textResponse = response.text || "[]";
    const cleanedText = cleanJson(textResponse);
    
    // Find the array part if there is extra text
    const arrayStart = cleanedText.indexOf('[');
    const arrayEnd = cleanedText.lastIndexOf(']');
    
    if (arrayStart === -1 || arrayEnd === -1) {
      console.error("Format JSON invalide reçu:", textResponse);
      return [];
    }

    const jsonPart = cleanedText.substring(arrayStart, arrayEnd + 1);
    const matches: Match[] = JSON.parse(jsonPart);
    return matches;

  } catch (error) {
    console.error("Erreur lors de la récupération des matchs:", error);
    return [];
  }
};

/**
 * Analyzes a specific match to provide a prediction.
 */
export const analyzeMatch = async (match: Match): Promise<PredictionDetail> => {
  try {
    const prompt = `
      Analyse le match de football entre ${match.homeTeam} et ${match.awayTeam} (${match.league}).
      
      Utilise Google Search pour trouver :
      1. La forme récente des deux équipes (5 derniers matchs).
      2. Les blessés majeurs ou suspensions pour ce match précis.
      3. L'historique des confrontations directes (H2H).
      4. Le classement actuel.

      Basé sur ces FAITS RÉELS, fournis un pronostic.
      
      Renvoie UNIQUEMENT un objet JSON brut (sans markdown) avec cette structure :
      {
        "prediction": "Ton pronostic principal (ex: Victoire Arsenal)",
        "confidence": 75, (nombre entre 0 et 100)
        "riskLevel": "Faible" | "Moyen" | "Élevé",
        "reasoning": ["Raison 1 basée sur la forme", "Raison 2 basée sur les blessures", ...],
        "keyStats": ["Statistique clé 1", "Statistique clé 2"]
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", 
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "Tu es un expert en pronostics sportifs professionnel. Sois précis, objectif et base-toi sur les dernières actualités trouvées sur le web."
      }
    });

    const textResponse = response.text || "{}";
    const cleanedText = cleanJson(textResponse);
    
    // Attempt to extract JSON object
    const objStart = cleanedText.indexOf('{');
    const objEnd = cleanedText.lastIndexOf('}');
    
    if (objStart === -1 || objEnd === -1) {
       throw new Error("Réponse IA illisible");
    }

    const jsonPart = cleanedText.substring(objStart, objEnd + 1);
    const prediction: PredictionDetail = JSON.parse(jsonPart);
    return prediction;

  } catch (error) {
    console.error("Erreur lors de l'analyse:", error);
    throw new Error("Impossible d'analyser le match pour le moment.");
  }
};