export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  time: string; // HH:MM or 'LIVE'
  status: 'UPCOMING' | 'LIVE' | 'FINISHED';
  score?: string; // e.g., "1-0"
}

export interface PredictionDetail {
  prediction: string; // e.g., "Victoire Real Madrid" or "Plus de 2.5 buts"
  confidence: number; // 0-100
  reasoning: string[];
  keyStats: string[];
  riskLevel: 'Faible' | 'Moyen' | 'Élevé';
}

export interface AnalysisState {
  isLoading: boolean;
  data: PredictionDetail | null;
  error: string | null;
}

export interface HistoryItem {
  id: string;
  match: Match;
  prediction: PredictionDetail;
  timestamp: number;
}

// Extension globale pour Google Adsense
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}