import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load every var from .env (empty prefix = don't restrict to VITE_*),
  // so the existing process.env.BACKEND_URL / process.env.BASENAME
  // references throughout src/front keep working unchanged.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    publicDir: 'src/front/public',
    define: {
      'process.env.BACKEND_URL': JSON.stringify(env.BACKEND_URL || ''),
      'process.env.BASENAME': JSON.stringify(env.BASENAME || ''),
    },
    server: {
      port: 3000,
      host: true,
    },
    build: {
      outDir: 'public',
      emptyOutDir: true,
    },
  };
});
