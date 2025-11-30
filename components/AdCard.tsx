import React, { useEffect } from 'react';

export const AdCard: React.FC = () => {
  useEffect(() => {
    try {
      if (window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      console.error("AdSense error:", e);
    }
  }, []);

  return (
    <div className="bg-brand-card border border-slate-700/50 rounded-xl p-4 shadow-xl flex flex-col items-center justify-center text-center overflow-hidden h-full min-h-[250px]">
      <span className="text-[10px] text-slate-600 uppercase mb-2 tracking-widest">Publicité</span>
      
      <div className="w-full h-full flex items-center justify-center bg-slate-800/20 rounded-lg">
        {/* REMPLACEZ data-ad-client ET data-ad-slot PAR VOS INFOS ADSENSE */}
        {/* Ceci est une unité d'annonce Carrée ou Rectangle */}
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%' }}
          data-ad-client="ca-pub-VOTRE_ID_ICI"
          data-ad-slot="0987654321"
          data-ad-format="rectangle"
          data-full-width-responsive="true"
        ></ins>
      </div>
    </div>
  );
};