import React from 'react';
import { HistoryItem } from '../types';
import { Calendar, Eye } from 'lucide-react';

interface HistoryCardProps {
  item: HistoryItem;
  onView: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
}

export const HistoryCard: React.FC<HistoryCardProps> = ({ item, onView, onDelete }) => {
  const { match, prediction, timestamp } = item;
  const date = new Date(timestamp).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });

  const getLogoUrl = (name: string) => 
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=64&bold=true`;

  return (
    <div className="bg-brand-card rounded-xl p-4 border border-slate-700 shadow-lg relative overflow-hidden group hover:border-brand-accent/50 transition-all duration-300">
      
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-3 text-xs text-slate-400">
        <div className="flex items-center gap-1">
          <Calendar size={12} />
          <span>Analysé le {date}</span>
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
          className="text-slate-600 hover:text-red-400 transition-colors px-2"
        >
          Supprimer
        </button>
      </div>

      {/* Teams */}
      <div className="flex items-center justify-between mb-4 bg-slate-800/30 p-2 rounded-lg">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <img 
            src={getLogoUrl(match.homeTeam)} 
            alt={match.homeTeam} 
            className="w-6 h-6 rounded-full flex-shrink-0 bg-slate-700"
          />
          <div className="font-bold text-white text-sm truncate">{match.homeTeam}</div>
        </div>
        <div className="text-xs text-slate-500 font-mono px-2">VS</div>
        <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
          <div className="font-bold text-white text-sm truncate text-right">{match.awayTeam}</div>
          <img 
            src={getLogoUrl(match.awayTeam)} 
            alt={match.awayTeam} 
            className="w-6 h-6 rounded-full flex-shrink-0 bg-slate-700"
          />
        </div>
      </div>

      {/* Prediction Summary */}
      <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50 mb-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-brand-accent uppercase font-bold tracking-wider">Pronostic IA</span>
          <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${
            prediction.confidence > 75 ? 'bg-green-500/20 text-green-400' : 
            prediction.confidence > 50 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'
          }`}>
            {prediction.confidence}%
          </span>
        </div>
        <p className="text-sm text-white font-medium line-clamp-2">{prediction.prediction}</p>
      </div>

      <button 
        onClick={() => onView(item)}
        className="w-full mt-1 bg-slate-700 group-hover:bg-brand-accent text-white py-2 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
      >
        <Eye size={16} />
        Voir les détails
      </button>
    </div>
  );
};