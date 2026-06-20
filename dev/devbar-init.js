// Dev-only Bootstrap für devbar.
// Wird AUSSCHLIESSLICH vom Vite-Dev-Server eingebunden (siehe vite.config.mjs,
// transformIndexHtml mit apply:'serve'). In Produktion (GitHub Pages) wird diese
// Datei nie referenziert und damit nie geladen.
// Wichtig: Als echtes Modul-File schreibt Vite den Bare-Import korrekt um
// (anders als bei einem injizierten Inline-`import('@ytspar/devbar')`).
import { initGlobalDevBar } from '@ytspar/devbar';
initGlobalDevBar();
