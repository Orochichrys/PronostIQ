import React from 'react';
import { Match, AnalysisState } from '../types';
import { X, TrendingUp, AlertTriangle, CheckCircle, BrainCircuit } from 'lucide-react';

interface PredictionModalProps {
  match: Match;
  analysis: AnalysisState;
  onClose: () => void;
}

export const PredictionModal: React.FC<PredictionModalProps> = ({ match, analysis, onClose }) => {
  if (!match) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-brand-card w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-600 shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="sticky top-0 bg-brand-card z-10 p-6 border-b border-slate-700 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <BrainCircuit className="text-brand-accent" />
              Analyse IA : Pronostic
            </h2>
            <p className="text-slate-400 text-sm mt-1">{match.homeTeam} vs {match.awayTeam}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {analysis.isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="w-16 h-16 border-4 border-brand-accent border-t-transparent rounded-full animate-spin"></div>
              <p className="text-brand-accent font-medium animate-pulse">
                L'IA analyse les données en temps réel...
              </p>
              <p className="text-slate-500 text-sm">Recherche des blessures, forme récente et stats H2H</p>
            </div>
          ) : analysis.error ? (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-200 flex items-center gap-3">
              <AlertTriangle />
              <p>{analysis.error}</p>
            </div>
          ) : analysis.data ? (
            <div className="space-y-6">
              
              {/* Main Prediction */}
              <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <TrophyIcon size={100} />
                </div>
                <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">Pronostic Principal</h3>
                <div className="text-3xl font-black text-white mb-2">{analysis.data.prediction}</div>
                
                <div className="flex justify-center items-center gap-6 mt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-brand-accent">{analysis.data.confidence}%</div>
                    <div className="text-xs text-slate-500">Confiance</div>
                  </div>
                  <div className="w-px h-8 bg-slate-700"></div>
                  <div className="text-center">
                    <div className={`text-xl font-bold ${
                      analysis.data.riskLevel === 'Faible' ? 'text-green-400' :
                      analysis.data.riskLevel === 'Moyen' ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {analysis.data.riskLevel}
                    </div>
                    <div className="text-xs text-slate-500">Risque</div>
                  </div>
                </div>
              </div>

              {/* Stats & Reasoning Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="text-white font-semibold flex items-center gap-2">
                    <TrendingUp size={18} className="text-blue-400" />
                    Facteurs Clés
                  </h4>
                  <ul className="space-y-2">
                    {analysis.data.reasoning.map((reason, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-slate-300 bg-slate-800/50 p-2 rounded">
                        <span className="mt-1 min-w-[6px] h-[6px] rounded-full bg-blue-400"></span>
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="text-white font-semibold flex items-center gap-2">
                    <CheckCircle size={18} className="text-brand-accent" />
                    Statistiques Importantes
                  </h4>
                  <ul className="space-y-2">
                    {analysis.data.keyStats.map((stat, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-slate-300 bg-slate-800/50 p-2 rounded">
                        <span className="mt-1 min-w-[6px] h-[6px] rounded-full bg-brand-accent"></span>
                        {stat}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-blue-900/20 border border-blue-500/20 rounded-lg p-4 text-xs text-blue-200">
                <p><strong>Note :</strong> Ces pronostics sont générés par une IA basée sur des statistiques réelles. Les paris sportifs comportent des risques. Jouez de manière responsable.</p>
              </div>

            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

// Helper icon
const TrophyIcon = ({ size }: { size: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className="text-yellow-500"
  >
    <path d="M5 2C3.34315 2 2 3.34315 2 5V6C2 8.76142 4.23858 11 7 11H7.5C8.54462 11 9.51654 10.6865 10.3341 10.1472C11.1394 11.2335 12.4826 12 14 12C16.7614 12 19 9.76142 19 7V5C19 3.34315 17.6569 2 16 2H5ZM7 9C5.34315 9 4 7.65685 4 6V5C4 4.44772 4.44772 4 5 4H7V9ZM14 10V4H16C16.5523 4 17 4.44772 17 5V7C17 8.65685 15.6569 10 14 10Z" />
    <path d="M9 13.9999C8.36923 14.156 7.70586 14.2483 7.02525 14.2982C7.30907 14.9925 7.84472 15.5686 8.52562 15.9089C9.20652 16.2493 9.99122 16.3332 10.7493 16.1466C11.5074 15.96 12.1932 15.5143 12.6924 14.8841L13.4355 13.9455C12.9818 14.1042 12.4975 14.1873 12 14.1873C10.9667 14.1873 9.98583 13.9213 9.13524 13.4477L9 13.9999Z" />
    <path d="M12 14.1873C12.4975 14.1873 12.9818 14.1042 13.4355 13.9455L14.1786 13.0069C13.6794 13.6371 12.9936 14.0828 12.2355 14.2694C11.4775 14.456 10.6928 14.3721 10.0119 14.0317C9.33096 13.6914 8.79531 13.1152 8.51149 12.421C8.24354 12.4013 7.97893 12.3734 7.71804 12.3375C7.94208 13.4312 8.54462 14.4093 9.40822 15.0935C10.2718 15.7777 11.3431 16.1259 12.4373 16.0772L12 22H15V16H12V14.1873Z" />
  </svg>
);