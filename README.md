# FLORALE SCHMIEDE – Website

Statische, SEO-optimierte Info-Website der **Gärtnerei Zimmermann FLORALE SCHMIEDE e.K.**
(Sven Kornherr, Dettenhausen). Gebaut mit **HTML + Tailwind CSS**, ein wenig Vanilla-JS,
**ohne externe Requests** (DSGVO-konform, daher kein Cookie-Banner nötig).

> Für Mitwirkende: bitte zuerst **[AGENTS.md](AGENTS.md)** lesen (Stil, Tonalität, Regeln).
> Die ausführliche SEO-/Technik-Analyse, aus der dieses Projekt entstanden ist, steht in
> **[report.md](report.md)**.

## Struktur
```
.
├── index.html              # Startseite (Hero, Leistungen, Segmente, Über mich, Kontakt)
├── floristik.html          # ┐
├── hochzeit.html           # │
├── trauer.html             # │ generierte Leistungsseiten
├── gaertnerei.html         # │ (Quelle: build_pages.mjs)
├── dauergrabpflege.html    # │
├── kraeuter.html           # │
├── location.html           # ┘ Veranstaltungsort / Location
├── impressum.html          # handgepflegt (Pflichtangaben tlw. ergänzen)
├── datenschutz.html        # handgepflegt (Vorlage, prüfen lassen)
├── src/input.css           # Tailwind-Quelle (Theme-Komponenten via @apply)
├── tailwind.config.js      # Marken-Tokens (Farben, Schriften, Schatten)
├── style.css               # ⚙️ generiert (Tailwind, minified) – nicht von Hand editieren
├── build_pages.mjs         # Generator der Leistungsseiten
├── package.json            # Build-/Test-Skripte
├── img/                    # Bilder (aus dem Bestand der Wix-Seite)
└── tests/                  # Playwright E2E-/SEO-Tests + Referenz-Screenshots
```

## Entwickeln & Bauen
```bash
npm install         # Tailwind installieren
npm run build       # Leistungsseiten generieren + style.css bauen
npm run dev         # Tailwind im Watch-Modus (während des Bearbeitens)
npm test            # Playwright E2E-/SEO-Checks (sollten 79/79 grün sein)
```
Inhalte der Leistungsseiten in `build_pages.mjs` ändern, dann `npm run build`.
Startseite/Impressum/Datenschutz direkt im jeweiligen HTML.

## Umgesetzte Verbesserungen (aus dem Audit)
- Eindeutige **Titles mit Ort + Keyword**, individuelle **Meta-Descriptions**
- **Genau ein H1** pro Seite, saubere **H2-Gliederung**
- **Canonical**, **Open Graph**, `lang="de"`, **Alt-Texte** + `width/height` (CLS)
- **LocalBusiness/Florist-JSON-LD** mit Öffnungszeiten, Geo, sameAs, Mitgliedschaften;
  Unterseiten mit **Breadcrumb-, Service- & FAQ-JSON-LD**
- Eigene **Leistungsseiten** pro Thema (besseres lokales Ranking) inkl. FAQ-Akkordeon
- Lokale Keywords (Dettenhausen, Tübingen …), Fleurop-Versand, Location-Segment
- Mobil-optimiert, **keine** Google-Fonts/Analytics/Maps → kein Cookie-Banner nötig

## ⚠️ Vor dem Livegang von Sven zu prüfen
1. **Impressum**: USt-ID, Registergericht & -nummer ergänzen (`impressum.html`).
2. **Öffnungszeiten** in `index.html` + JSON-LD gegen die echten Zeiten abgleichen.
3. **Geo-Koordinaten** (lat/lng im JSON-LD der Startseite) feinjustieren.
4. **Domain**: idealerweise auf `floraleschmiede.de` ausspielen (so in den Meta-URLs hinterlegt).
5. Texte sind eine solide Basis – gern persönlicher machen.

## Hosting
Reine statische Dateien – läuft auf jedem Webspace/CDN. Aktuell als Demo via **GitHub Pages**.
`style.css` ist eincheckt (vorgebaut), es ist also keine Build-Pipeline beim Hoster nötig.
