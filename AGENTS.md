# AGENTS.md – Arbeitsanweisungen für die Florale-Schmiede-Website

Diese Datei richtet sich an KI-Agenten und Entwickler:innen, die an dieser Website
arbeiten. Bitte vor Änderungen lesen und einhalten.

## Was das hier ist
Statische Info-Website der **Gärtnerei Zimmermann FLORALE SCHMIEDE e.K.**
(Inh. Sven Kornherr, Kirchstraße 32, 72135 Dettenhausen).
Lokales Geschäft – Floristik, Gärtnerei, Hochzeits-/Trauerfloristik, Dauergrabpflege,
Kräuter, und ein Veranstaltungsort (Location). Ziel: lokale Sichtbarkeit (Raum
Dettenhausen/Tübingen) + seriöser, persönlicher Auftritt.

## Tech-Stack & Build
- **Reines HTML + Tailwind CSS v3** (kompiliert), minimal Vanilla-JS (Mobile-Nav, Jahr).
- **Keine externen Requests** zur Laufzeit (keine Google Fonts, kein Analytics, keine
  Map-Embeds, keine CDNs) → DSGVO-konform, deshalb auch **kein Cookie-Banner nötig**.
  Diesen Zustand bitte unbedingt beibehalten.
- Unterseiten werden **generiert** aus `build_pages.mjs` – Inhalte dort ändern, nicht
  direkt in den generierten `*.html` (außer `index.html`, `impressum.html`,
  `datenschutz.html`, die handgepflegt sind).

### Befehle
```
npm install            # einmalig (Tailwind + Dev-Tools)
npm run build          # Unterseiten generieren + CSS bauen (immer nach Änderungen)
npm run build:css      # nur Tailwind -> style.css (minified)
npm run build:pages    # nur Unterseiten aus build_pages.mjs
npm run dev            # Dev-Server: Vite (Port 5180, mit devbar) + Tailwind-Watch
npm run dev:css        # nur Tailwind im Watch-Modus (ohne Vite)
npm test               # Playwright E2E-/SEO-Checks (müssen grün sein)
```

### Frontend verifizieren mit devbar/sweetlink (empfohlen für Agenten)
Statt eigener Playwright-Skripte kann die **sweetlink**-Bridge genutzt werden, sobald
`npm run dev` läuft (Bridge: `ws://localhost:11403`, App: `http://localhost:5180`):
```
npx sweetlink screenshot --url http://localhost:5180/<seite> --output .tmp/screenshots/x.png
npx sweetlink inspect|schema|outline|a11y|vitals --url http://localhost:5180/<seite>
npx sweetlink --help
```
**Wichtig:** devbar/sweetlink + Vite sind **nur Dev** (`vite.config.mjs` → `apply:'serve'`).
Es gibt **keinen `vite build`** und keinen devbar-Code in den ausgelieferten Dateien.
Nicht in `index.html`/Unterseiten injizieren – die Injektion macht ausschließlich Vite im Dev.
**Regel:** Nach jeder Änderung an HTML/`build_pages.mjs`/`src/input.css` → `npm run build`
und `npm test`. Erst committen, wenn der Test **grün** ist.

## Styling-Regeln (Optik nicht verändern)
Die Optik ist bewusst ruhig, natürlich, gärtnerisch-warm. Beibehalten:
- **Farben** (in `tailwind.config.js` als Tokens):
  - `green-900 #1f3d2b`, `green-700 #2f5d3f`, `green-500 #4a7c59`, `green-50 #eef4ef`
  - `sand #f6f1e7`, `sand-dark #e7ddc9`
  - `accent #c2703d` (Terrakotta, für Buttons/Akzente), `accent-dark #a85a2c`, `accent-soft #f0c9ac`
  - `ink #232520`, `ink-soft #4c4f47`
- **Schrift:** Überschriften `font-serif` (System-Serife: Iowan Old Style/Palatino/Georgia),
  Fließtext `font-sans` (System-Sans). **Keine Web-Fonts laden** (DSGVO + Performance).
- **Komponenten** sind in `src/input.css` unter `@layer components` definiert (via `@apply`).
  Wiederkehrende Muster dort pflegen (`.btn`, `.card`, `.hero`, `.split`, `.page-hero`,
  `.gallery`, `.prose` …), Einzelfälle im Markup mit Tailwind-Utilities lösen.
- **Tailwind macht das Heavy-Lifting:** im Markup Utilities nutzen statt Inline-`style`.
  Keine neuen `style="…"`-Attribute einführen.
- Abstände/Rundungen/Schatten über die Theme-Tokens (`shadow-soft`, `shadow-lg`,
  `rounded-card`). Buttons immer `.btn` + Variante (`.btn--primary`/`.btn--ghost`/`.btn--lg`).

## Tonalität & Inhalt
- **Persönlich, warm, bodenständig** – Sven ist Einzelunternehmer („als Fachkraft alleine"),
  über 30 Jahre Gärtner + Florist. Seine Originalstimme (siehe `floraleschmiede.info/info`)
  prägt v. a. die „Über mich"-Sektion: „aus wenig viel erreichen", Bitte um etwas **Vorlauf**,
  Signatur **„Ihr Floraler Schmied – Sven Kornherr"**.
- „Sie"-Ansprache. Erste Person Singular in persönlichen Abschnitten ist erwünscht.
- **Lokale Keywords** natürlich einbauen: Dettenhausen, Tübingen, Walddorfhäslach,
  Waldenbuch, Nürtingen. Fleurop (deutschlandweiter Versand) erwähnen, wo passend.
- Bei Trauer-Themen **einfühlsam**, nicht werblich.

## SEO – nicht kaputt machen
Jede Seite braucht:
- genau **ein `<h1>`** (mit Keyword), saubere `<h2>`-Gliederung,
- eindeutigen **`<title>`** (30–70 Zeichen) **mit Ort**,
- **Meta-Description** (120–170 Zeichen),
- `canonical`, Open-Graph-Tags, `lang="de"`,
- **Alt-Texte** für alle Bilder + `width`/`height` (gegen Layout-Shift),
- gültiges **JSON-LD** (Startseite: `Florist`/LocalBusiness mit Öffnungszeiten + Geo;
  Unterseiten: `BreadcrumbList` + `Service` + ggf. `FAQPage`).
Die E2E-Tests (`npm test`) prüfen das – nicht umgehen, sondern erfüllen.

## Bilder
- Liegen in `img/`. Stammen aus dem Bestand der bisherigen Wix-Seite.
- Sektionsbilder ~1000×800 (4:3/5:4), Hero 1600–1920 breit, Galerie 800×800 (1:1),
  Porträt 800×1000 (4:5). Vor dem Einbinden sinnvoll komprimieren (q≈85).
- Immer mit beschreibendem, lokalem `alt` einbinden.

## Vor dem Go-Live noch offen (siehe README)
USt-ID & Registerdaten im Impressum, finale Öffnungszeiten, exakte Geo-Koordinaten,
Ziel-Domain (`floraleschmiede.de`). Inhalte sind eine solide Basis – Sven darf sie
gern persönlicher machen.

## Don'ts
- ❌ Externe Skripte/Fonts/Tracker/Map-Embeds einbauen (bricht DSGVO-Versprechen).
- ❌ Inline-`style` statt Utilities.
- ❌ Generierte Unterseiten direkt editieren (Änderungen in `build_pages.mjs`).
- ❌ Committen mit rotem Test.
