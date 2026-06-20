// Vite wird hier NUR als lokaler Dev-Server verwendet (devbar + sweetlink).
// Das Deployment (GitHub Pages) nutzt weiterhin die vorgebauten, eingecheckten
// Dateien + Tailwind-CLI – es gibt KEINEN `vite build`-Schritt.
// Dadurch landen devbar/sweetlink niemals in Produktion.
import { defineConfig } from 'vite';
import { sweetlink } from '@ytspar/sweetlink/vite';

export default defineConfig({
  // Mehrseitige statische Site: einfach die HTML-Dateien aus dem Projektordner servieren.
  appType: 'mpa',
  // host:true bindet IPv4 (127.0.0.1) UND IPv6 (::1) – sonst findet sweetlink/Chromium
  // den Server nicht (Vite band sonst nur ::1).
  // hmr.port: eigener WebSocket-Port für Live-Reload, damit er nicht mit der
  // sweetlink-WS-Bridge auf dem App-Port kollidiert ("Invalid frame header").
  server: { host: true, port: 5180, open: false, hmr: { port: 24739 } },
  plugins: [
    // Agent-Bridge: verbindet den lokalen Browser mit CLI/WebSocket
    // (Screenshots, DOM-Referenzen, Logs, Browser-Interaktionen).
    sweetlink(),

    // devbar-Toolbar nur im Dev-Server injizieren (apply: 'serve' => nie bei build).
    // Als echtes Modul-File (src), damit Vite den Bare-Import auflöst.
    {
      name: 'devbar-inject',
      apply: 'serve',
      transformIndexHtml() {
        return [
          {
            tag: 'script',
            attrs: { type: 'module', src: '/dev/devbar-init.js' },
            injectTo: 'body',
          },
        ];
      },
    },
  ],
});
