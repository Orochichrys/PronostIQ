import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Charge les variables d'environnement (comme API_KEY) pour le build
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    // Permet d'utiliser process.env.API_KEY dans le code client compilé
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  };
});