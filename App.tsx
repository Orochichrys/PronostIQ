import React, { useState, useEffect, useMemo } from 'react';
import { fetchLiveMatches, analyzeMatch } from './services/gemini';
import { Match, AnalysisState, HistoryItem } from './types';
import { MatchCard } from './components/MatchCard';
import { HistoryCard } from './components/HistoryCard';
import { PredictionModal } from './components/PredictionModal';
import { AdBanner } from './components/AdBanner';
import { AdCard } from './components/AdCard';
import { RefreshCw, Search, Zap, History, LayoutGrid, Trash2 } from 'lucide-react';

const App: React.FC = () => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'matches' | 'history'>('matches');
  const [searchQuery, setSearchQuery] = useState('');

  // Data State
  const [matches, setMatches] = useState<Match[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  
  // Loading & Selection State
  const [loadingMatches, setLoadingMatches] = useState<boolean>(true);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [analysisState, setAnalysisState] = useState<AnalysisState>({
    isLoading: false,
    data: null,
    error: null,
  });

  // Load matches and history on mount
  useEffect(() => {
    loadMatches();
    loadHistory();
  }, []);

  const loadMatches = async () => {
    setLoadingMatches(true);
    const data = await fetchLiveMatches();
    setMatches(data);
    setLoadingMatches(false);
  };

  const loadHistory = () => {
    try {
      const saved = localStorage.getItem('pronostiq_history');
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Erreur chargement historique", e);
    }
  };

  const saveToHistory = (match: Match, prediction: any) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      match,
      prediction,
      timestamp: Date.now()
    };
    
    const updatedHistory = [newItem, ...history];
    setHistory(updatedHistory);
    localStorage.setItem('pronostiq_history', JSON.stringify(updatedHistory));
  };

  const deleteHistoryItem = (id: string) => {
    const updated = history.filter(h => h.id !== id);
    setHistory(updated);
    localStorage.setItem('pronostiq_history', JSON.stringify(updated));
  };

  const clearHistory = () => {
    if (window.confirm("Voulez-vous vraiment effacer tout l'historique ?")) {
      setHistory([]);
      localStorage.removeItem('pronostiq_history');
    }
  };

  const handleAnalyze = async (match: Match) => {
    setSelectedMatch(match);
    setAnalysisState({ isLoading: true, data: null, error: null });
    
    try {
      const result = await analyzeMatch(match);
      setAnalysisState({ isLoading: false, data: result, error: null });
      // Save successful prediction to history automatically
      saveToHistory(match, result);
    } catch (err) {
      setAnalysisState({ 
        isLoading: false, 
        data: null, 
        error: "Impossible de récupérer les données d'analyse. Veuillez réessayer." 
      });
    }
  };

  const handleViewHistory = (item: HistoryItem) => {
    setSelectedMatch(item.match);
    setAnalysisState({
      isLoading: false,
      data: item.prediction,
      error: null
    });
  };

  const closeModal = () => {
    setSelectedMatch(null);
    setAnalysisState({ isLoading: false, data: null, error: null });
  };

  // Filtering Logic
  const filteredMatches = useMemo(() => {
    return matches.filter(m => 
      m.homeTeam.toLowerCase().includes(searchQuery.toLowerCase()) || 
      m.awayTeam.toLowerCase().includes(searchQuery.toLowerCase()) || 
      m.league.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [matches, searchQuery]);

  const filteredHistory = useMemo(() => {
    return history.filter(h => 
      h.match.homeTeam.toLowerCase().includes(searchQuery.toLowerCase()) || 
      h.match.awayTeam.toLowerCase().includes(searchQuery.toLowerCase()) || 
      h.match.league.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [history, searchQuery]);

  return (
    <div className="min-h-screen pb-10">
      
      {/* Navbar */}
      <nav className="bg-brand-card border-b border-slate-700 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('matches')}>
              <div className="bg-brand-accent p-1.5 rounded-lg shadow-lg shadow-brand-accent/20">
                <Zap className="text-white" size={24} fill="currentColor" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight hidden sm:block">
                Pronost<span className="text-brand-accent">IQ</span>
              </span>
            </div>
            
            {/* Search Bar Desktop */}
            <div className="flex-1 max-w-md mx-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-slate-600 rounded-full leading-5 bg-slate-800/50 text-slate-300 placeholder-slate-400 focus:outline-none focus:bg-slate-800 focus:ring-1 focus:ring-brand-accent focus:border-brand-accent sm:text-sm transition-all"
                  placeholder="Rechercher une équipe ou une ligue..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="hidden md:block">
              <span className="text-slate-400 text-sm font-medium bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700">
                v1.1 • IA Live
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Top Ad Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <AdBanner />
      </div>

      {/* Hero Section (Only show on Matches tab) */}
      {activeTab === 'matches' && (
        <div className="relative bg-brand-dark border-b border-slate-800 mt-6">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-accent/5 to-transparent pointer-events-none"></div>
          <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2">
              L'Intelligence Artificielle au service de vos paris
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Analyses en temps réel, statistiques avancées et pronostics basés sur les données réelles du web.
            </p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* Navigation Tabs & Actions */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 border-b border-slate-800 pb-4">
          
          <div className="flex space-x-1 bg-slate-800/50 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('matches')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'matches' 
                  ? 'bg-brand-accent text-white shadow-lg' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              <LayoutGrid size={18} />
              Matchs du Jour
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'history' 
                  ? 'bg-brand-accent text-white shadow-lg' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              <History size={18} />
              Historique
              {history.length > 0 && (
                <span className="ml-1 bg-white/20 px-1.5 py-0.5 rounded text-xs">
                  {history.length}
                </span>
              )}
            </button>
          </div>
          
          {activeTab === 'matches' ? (
            <button 
              onClick={loadMatches} 
              disabled={loadingMatches}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors border border-slate-600 disabled:opacity-50 text-sm font-medium"
            >
              <RefreshCw size={16} className={loadingMatches ? 'animate-spin' : ''} />
              {loadingMatches ? 'Scan en cours...' : 'Actualiser les matchs'}
            </button>
          ) : (
             history.length > 0 && (
              <button 
                onClick={clearHistory}
                className="flex items-center gap-2 px-4 py-2 bg-red-900/20 hover:bg-red-900/40 text-red-400 rounded-lg transition-colors border border-red-900/30 text-sm font-medium"
              >
                <Trash2 size={16} />
                Tout effacer
              </button>
             )
          )}
        </div>

        {/* Content View */}
        {activeTab === 'matches' ? (
          <>
            {loadingMatches ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-brand-card h-48 rounded-xl animate-pulse border border-slate-700/50"></div>
                ))}
              </div>
            ) : filteredMatches.length === 0 ? (
              <div className="text-center py-20 bg-brand-card rounded-xl border border-slate-700 dashed border-2">
                <Search className="mx-auto text-slate-500 mb-4" size={48} />
                <h3 className="text-xl font-bold text-white mb-2">Aucun match trouvé</h3>
                <p className="text-slate-400 max-w-md mx-auto">
                  {searchQuery 
                    ? `Aucun résultat pour "${searchQuery}". Essayez une autre recherche.` 
                    : "Impossible de trouver des matchs majeurs pour aujourd'hui."}
                </p>
                {!searchQuery && (
                  <button onClick={loadMatches} className="mt-4 text-brand-accent hover:underline">Réessayer</button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMatches.map((match, idx) => (
                  <React.Fragment key={match.id || idx}>
                    <MatchCard 
                      match={match} 
                      onAnalyze={handleAnalyze} 
                    />
                    {/* Insert AdCard after the 3rd match */}
                    {idx === 2 && (
                      <div className="md:col-span-1">
                        <AdCard />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}
          </>
        ) : (
          /* History View */
          <>
            {filteredHistory.length === 0 ? (
              <div className="text-center py-20 bg-brand-card rounded-xl border border-slate-700 dashed border-2">
                <History className="mx-auto text-slate-500 mb-4" size={48} />
                <h3 className="text-xl font-bold text-white mb-2">Historique vide</h3>
                <p className="text-slate-400 max-w-md mx-auto">
                  {searchQuery 
                    ? `Aucun pronostic trouvé pour "${searchQuery}".` 
                    : "Vos pronostics générés apparaîtront ici automatiquement."}
                </p>
                {!searchQuery && (
                  <button onClick={() => setActiveTab('matches')} className="mt-4 text-brand-accent hover:underline">
                    Générer mon premier pronostic
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredHistory.map((item) => (
                  <HistoryCard 
                    key={item.id} 
                    item={item} 
                    onView={handleViewHistory}
                    onDelete={deleteHistoryItem}
                  />
                ))}
              </div>
            )}
          </>
        )}

      </main>

      {/* Modal */}
      {selectedMatch && (
        <PredictionModal 
          match={selectedMatch} 
          analysis={analysisState} 
          onClose={closeModal} 
        />
      )}

    </div>
  );
};

export default App;