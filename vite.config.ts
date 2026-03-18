import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  
  // Map Supabase variables correctly. 
  // If SUPABASE_URL is a postgres string, we try to extract the API URL.
  let supabaseUrl = env.VITE_SUPABASE_URL || env.SUPABASE_URL;
  if (supabaseUrl?.startsWith('postgresql')) {
    // Attempt to derive from APP_URL or fallback to a known pattern if possible
    // In this specific project, the user provided a Supabase URL in APP_URL placeholder
    supabaseUrl = env.APP_URL; 
  }

  return {
    plugins: [react()],
    base: '/', // Ensure absolute paths for assets
    build: {
      outDir: 'dist/client',
      emptyOutDir: true,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            leaflet: ['leaflet', 'react-leaflet'],
            supabase: ['@supabase/supabase-js'],
          },
        },
      },
    },
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(supabaseUrl),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.SUPABASE_ANON_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
