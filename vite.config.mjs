// Vite wird hier NUR als lokaler Dev-Server verwendet (devbar + sweetlink).
// Das Deployment (GitHub Pages) nutzt weiterhin die vorgebauten, eingecheckten
// Dateien + Tailwind-CLI – es gibt KEINEN `vite build`-Schritt.
// Dadurch landen devbar/sweetlink niemals in Produktion.
import { defineConfig } from 'vite';
import { sweetlink } from '@ytspar/sweetlink/vite';

export default defineConfig({
  // Mehrseitige statische Site: einfach die HTML-Dateien aus dem Projektordner servieren.
  appType: 'mpa',
  server: { port: 5180, open: false },
  plugins: [
    // Agent-Bridge: verbindet den lokalen Browser mit CLI/WebSocket
    // (Screenshots, DOM-Referenzen, Logs, Browser-Interaktionen).
    sweetlink(),

    // devbar-Toolbar nur im Dev-Server injizieren (apply: 'serve' => nie bei build).
    {
      name: 'devbar-inject',
      apply: 'serve',
      transformIndexHtml() {
        return [
          {
            tag: 'script',
            attrs: { type: 'module' },
            children:
              "import('@ytspar/devbar').then(function(m){ m.initGlobalDevBar && m.initGlobalDevBar(); });",
            injectTo: 'body',
          },
        ];
      },
    },
  ],
});
