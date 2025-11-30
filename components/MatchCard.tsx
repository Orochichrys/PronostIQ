import React from 'react';
import { Match } from '../types';
import { Trophy, Clock, Activity } from 'lucide-react';

interface MatchCardProps {
  match: Match;
  onAnalyze: (match: Match) => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, onAnalyze }) => {
  const isLive = match.status === 'LIVE';

  // Helper for generating consistent team avatars
  const getLogoUrl = (name: string) => 
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=128&bold=true`;

  return (
    <div className="bg-brand-card rounded-xl p-4 border border-slate-700 shadow-lg hover:border-brand-accent transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-2 text-xs text-slate-400 uppercase font-semibold tracking-wider">
          <Trophy size={14} className="text-brand-accent" />
          <span>{match.league}</span>
        </div>
        <div className={`flex items-center px-2 py-1 rounded-full text-xs font-bold ${isLive ? 'bg-red-500/20 text-red-500 animate-pulse' : 'bg-slate-700 text-slate-300'}`}>
          {isLive ? (
            <>
              <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
              EN DIRECT
            </>
          ) : (
            <>
              <Clock size={12} className="mr-1" />
              {match.time}
            </>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex-1 flex flex-col items-center gap-2">
          <div className="relative">
            <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-slate-700 shadow-lg bg-slate-800">
              <img 
                src={getLogoUrl(match.homeTeam)} 
                alt={match.homeTeam}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
          <h3 className="text-lg font-bold text-white leading-tight text-center line-clamp-2">{match.homeTeam}</h3>
        </div>
        
        <div className="mx-2 flex flex-col items-center justify-center min-w-[60px]">
          {isLive || match.score ? (
            <span className="text-2xl font-black text-brand-accent tracking-widest">{match.score}</span>
          ) : (
            <span className="text-xl font-bold text-slate-500 font-mono">VS</span>
          )}
        </div>

        <div className="flex-1 flex flex-col items-center gap-2">
          <div className="relative">
             <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-slate-700 shadow-lg bg-slate-800">
              <img 
                src={getLogoUrl(match.awayTeam)} 
                alt={match.awayTeam}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
          <h3 className="text-lg font-bold text-white leading-tight text-center line-clamp-2">{match.awayTeam}</h3>
        </div>
      </div>

      <button 
        onClick={() => onAnalyze(match)}
        className="w-full bg-slate-700 hover:bg-brand-accent text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 group"
      >
        <Activity size={18} className="group-hover:scale-110 transition-transform" />
        Analyser ce match
      </button>
    </div>
  );
};