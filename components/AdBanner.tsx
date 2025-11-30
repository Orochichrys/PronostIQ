import React, { useEffect, useRef } from 'react';

interface AdBannerProps {
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({ className = '' }) => {
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    try {
      // Pousse la publicité une fois le composant monté
      if (window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      console.error("AdSense error:", e);
    }
  }, []);

  return (
    <div className={`w-full bg-brand-card/30 border border-slate-700/30 rounded-xl overflow-hidden min-h-[90px] flex justify-center items-center ${className}`}>
      <div className="text-center w-full">
        {/* REMPLACEZ data-ad-client ET data-ad-slot PAR VOS INFOS ADSENSE */}
        {/* Ceci est une unité d'annonce Display Horizontale */}
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-VOTRE_ID_ICI" 
          data-ad-slot="1234567890" 
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
        
        {/* Placeholder visuel si pas d'ID configuré (à retirer en prod) */}
        <div className="text-xs text-slate-600 py-2 hidden">
          Espace Publicitaire Google
        </div>
      </div>
    </div>
  );
};