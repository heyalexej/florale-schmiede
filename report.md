# Website-Audit: Florale Schmiede

**Erstellt am:** 20.06.2026
**Untersucht mit:** Playwright (Chromium, headless), curl/DNS, WebSearch
**Geprüfte Seiten:**
- Shop: <https://www.floraleschmiede-shop.de/s/home/>
- Info-/Imageseite: <https://www.floraleschmiede.info/>

> Hinweis: Das Audit basiert auf einer **rein externen** Betrachtung (keine Zugangsdaten, kein Quellcode-Zugriff, kein Admin). Rechtliche Einschätzungen sind eine technische Ersteinordnung und **kein Rechtsrat** – bei den abmahnrelevanten Punkten (Impressum, Datenschutz, Widerruf) bitte einen Fachanwalt / die IHK gegenchecken.

---

## 1. Management Summary (Ampel)

| Thema | Shop (`-shop.de`) | Info-Seite (`.info`) |
|---|---|---|
| Tech-Stack / Hosting | 🟡 veraltete Frameworks | 🟢 Wix (gepflegt) |
| Cookie-Consent | 🟢 technisch unkritisch* | 🔴 Tracker laden vor Einwilligung + falsche Banner-Formulierung |
| Kontaktformular / Spam | 🔴 Hauptproblem – kein Captcha | 🟢 kein offenes Formular gefunden |
| Widerrufsbutton (§ 356a BGB) | 🟢 weitgehend erfüllt (Detailprüfung nötig) | ⚪️ nicht einschlägig (kein Verkauf) |
| Impressum | 🔴 Link öffnet nichts (vermutlich defekt) | 🟢 vorhanden |
| Datenschutzerklärung | 🟡 vorhanden, aber nur als Modal erreichbar | 🟡 vorhanden, aber „Kopie von Impressum" |
| SEO | 🔴 keine Meta-Description/Canonical, Titel per JS | 🟡 solide, aber kein H1, Tippfehler |
| Security-Header | 🔴 keine gesetzt | 🟢 HSTS + nosniff |

\* Der Shop lädt **keinerlei externe Dienste** (keine Google Fonts, kein Analytics, keine Maps) und setzt nur ein technisch notwendiges Session-Cookie → datenschutzrechtlich entspannt.

**Die drei dringendsten Punkte:**
1. **Spam im Kontaktformular** (20/Tag) → Captcha nachrüsten (nur über IWI GmbH möglich).
2. **Impressum-Link im Shop funktioniert nicht** → akut abmahngefährdet (Impressumspflicht).
3. **Wix-Seite lädt Analytics vor der Cookie-Einwilligung** + veraltete Banner-Formulierung → DSGVO/TTDSG-Risiko.

---

## 2. Tech-Stack & Hosting

### 2.1 Shop – `www.floraleschmiede-shop.de`
| Merkmal | Befund |
|---|---|
| **Hosting** | Eigener Server bei **Hetzner** (IPv4 `159.69.104.77`, IPv6 `2a01:4f8:c0c:b46::2`, Rechenzentrum Deutschland) |
| **Webserver** | Apache |
| **Shop-Software** | **Eigenentwicklung der IWI GmbH** (`iwi.de`, „Ihr Internet Partner") – Meta-Tag `author = IWI GmbH`, Pfade `/s/...`, `/api/v1/...`, CSS-Klassen `iwi-*` |
| **Frontend** | **AngularJS 1.x** (`ng-model`, `ng-pristine` im Formular) + **Alpine.js** + **Bootstrap** + **Font Awesome 4.1.0** |
| **E-Mail** | Selbst gehostet (`MX → mail.floraleschmiede-shop.de`) |
| **Rendering** | Reine Client-App – die Seite wird erst per JavaScript zusammengebaut |

⚠️ **AngularJS 1.x ist seit Januar 2022 End-of-Life** (keine Sicherheitsupdates mehr). Font Awesome 4.1.0 stammt von 2014. Das ist kein akutes Loch, aber technische Altlast. **Wichtig: Den Shop kann nur die IWI GmbH ändern** – ihr/dein Freund hat keinen Code-Zugriff. Alle Shop-Fixes müssen über IWI laufen.

### 2.2 Info-Seite – `www.floraleschmiede.info`
| Merkmal | Befund |
|---|---|
| **Hosting / CMS** | **Wix.com** (Website-Baukasten) – Server „Pepyaka", `parastorage.com`, `wixstatic.com`, Auslieferung über Fastly/Google-Cloud-CDN (Cache Frankfurt) |
| **DNS** | `www` → `cdn1.wixdns.net` |
| **Pflege** | Über das Wix-Dashboard (Login nötig) – kein Programmierer erforderlich |

> **Auffälligkeit:** Es sind **drei Domains** im Spiel – `floraleschmiede.de` (E-Mail `dialog@floraleschmiede.de`), `floraleschmiede-shop.de` (Shop) und `floraleschmiede.info` (Wix). Das ist für Kunden und SEO verwirrend. Empfehlung: langfristig auf **eine** Hauptdomain konsolidieren bzw. sauber verweisen.

---

## 3. Cookie-Consent & Datenschutz

### 3.1 Shop – 🟢 unkritisch
- Beim Laden wird **nur** das Cookie `sess` gesetzt (httpOnly, Session, 2 h) – technisch notwendig, **einwilligungsfrei zulässig**.
- **Keine** externen Requests, **kein** Tracking, **keine** Google Fonts/Maps. → Ein Cookie-Banner ist hier rechtlich nicht zwingend.
- 🟡 Kleinigkeit: Das `sess`-Cookie hat **kein `Secure`-Flag** (sollte gesetzt werden, da reine HTTPS-Seite).

### 3.2 Info-Seite (Wix) – 🔴 nachbessern
- Cookie-Banner **ist vorhanden** mit Buttons „Alle ablehnen" / „Zustimmen" / „Cookie-Einstellungen" – grundsätzlich gut.
- 🔴 **Problem 1 – veraltete Formulierung:** Der Bannertext lautet *„Durch die weitere Nutzung der Webseite stimmen Sie der Verwendung von Cookies zu."* Diese „Weiternutzung = Einwilligung"-Logik ist seit dem Planet49-Urteil (EuGH) und dem TTDSG **unzulässig**. Es braucht eine aktive Opt-in-Auswahl.
- 🔴 **Problem 2 – Tracker vor Einwilligung:** Bereits **vor** jeder Zustimmung wurden geladen:
  - `frog.wix.com` – 22 Requests (Wix-Telemetrie/Analytics)
  - `panorama.wixapps.net` – 17 Requests (Wix-Analytics)
  - `browser.sentry-cdn.com` – 2 Requests (Fehler-Tracking)
  
  Das widerspricht dem Opt-in-Prinzip. → In Wix unter **Einstellungen → Cookies & Datenschutz / Consent-Banner** den **Consent-Mode auf „Cookies erst nach Zustimmung laden"** umstellen und die Banner-Formulierung korrigieren.
- 🟡 **Datenschutzerklärung** liegt unter dem URL-Slug `/kopie-von-impressum` („Kopie von Impressum"). Inhaltlich ist es eine korrekte, generische Datenschutzerklärung – nur der Slug/Aufbau ist unsauber. Sollte ergänzt werden um die tatsächlich genutzten Wix-Dienste (Wix Analytics, ggf. Wix-Formulare).

---

## 4. Kontaktformular & Spam (Shop) – 🔴 Hauptproblem

**Formular:** `https://www.floraleschmiede-shop.de/s/contact/`
Felder: `email` (Pflicht), `text` (Pflicht). Dazu **bereits vorhandene** versteckte Schutzmechanismen:
- **Honeypot:** Ein per `display:none` ausgeblendetes Feld `name` (mit `tabindex="-1"`, `autocomplete="nope"`) – Bots, die es ausfüllen, sollen geblockt werden.
- **Zeit-/Signatur-Token:** Ein verschlüsseltes Feld `valid_from` (vermutlich Zeitstempel gegen zu schnelles Absenden).

**Warum trotzdem 20 Spam/Tag?**
- 🔴 **Es gibt kein Captcha** (`hasCaptcha = false`). Moderne Spam-Bots umgehen einfache Honeypots problemlos.
- Das Honeypot-Feld heißt ausgerechnet `name` – ein sehr gängiger Feldname, den manche Bots gezielt befüllen *und* manche zufällig korrekt leer lassen. Wirksamer wäre ein unverdächtiger, zufälliger Feldname.

**Empfohlene Maßnahmen (Umsetzung durch IWI GmbH):**
1. **Captcha einbauen** – DSGVO-freundlich und ohne Nutzerfrust: **Cloudflare Turnstile** oder **Friendly Captcha** (EU-Hosting, kein Klickbild-Genervt). Das ist erfahrungsgemäß die mit Abstand wirksamste Einzelmaßnahme.
2. **Serverseitige Zeitprüfung** des `valid_from`-Tokens erzwingen (Mindest-Verweildauer, Token-Einmalnutzung).
3. **Rate-Limiting** pro IP (z. B. max. 3 Nachrichten / Stunde) am Apache/Backend.
4. Honeypot-Feldname randomisieren.
5. Optional: Double-Opt-in / Bestätigungslink, bevor die Mail im Postfach landet.

> **Konkreter nächster Schritt:** IWI GmbH anschreiben mit der Bitte, **Cloudflare Turnstile (oder Friendly Captcha) + Rate-Limiting** für das Kontakt- und das Widerrufsformular zu aktivieren. Beide Formulare nutzen dieselbe Technik.

---

## 5. Widerrufsbutton (§ 356a BGB, Pflicht seit 19.06.2026) – 🟢 weitgehend erfüllt

**Rechtslage:** Seit **19.06.2026** (also seit dem Vortag dieses Audits!) verpflichtet der neue **§ 356a BGB** alle Unternehmen, die Verbrauchern online Fernabsatzverträge ermöglichen, zu einer ständig verfügbaren, gut lesbaren Schaltfläche **„Vertrag widerrufen"**, einer Bestätigungsseite und einer **Eingangsbestätigung mit Datum, Uhrzeit und Inhalt** auf dauerhaftem Datenträger (E-Mail). Der Widerrufsbutton muss **getrennt** vom Kündigungsbutton sein.

**Befund Shop – die gute Nachricht: der Button existiert schon.**
- Footer-Link **„Vertrag widerrufen"** → `/s/contract/cancellation/` ✔️ (ständig verfügbar, korrekt beschriftet)
- Bestätigungsseite mit Feldern **Name, E-Mail-Adresse, Vertragsidentifikation** (Bestellnummer/Artikel) + Button **„Widerruf bestätigen"** ✔️
- Hinweis *„An diese E-Mail-Adresse wird Ihnen die Eingangsbestätigung geschickt"* ✔️

**Noch zu verifizieren (nicht von außen prüfbar):**
1. Enthält die Eingangsbestätigungs-Mail tatsächlich **Datum, Uhrzeit und den Inhalt** des Widerrufs?
2. Vermeidet die Mail Formulierungen, die einen **wirksamen** Widerruf suggerieren (sie darf nur den **Eingang** bestätigen)?
3. Ist der Button **getrennt** von einem etwaigen Kündigungsbutton?

→ Diese Punkte bitte mit IWI klären; technisch/strukturell ist die Pflicht aber bereits erfüllt. **Auf der Wix-Info-Seite ist der Button nicht nötig**, da dort kein Vertragsschluss stattfindet (reine Infoseite).

---

## 6. Impressum & Rechtstexte (Shop) – 🔴 dringend prüfen

- Die Footer-Links **„Impressum"** und **„Datenschutzerklärung"** zeigen beide auf `/s/#` (ein leerer JS-Anker) und sollen per JavaScript ein Modal öffnen.
- 🔴 Im Test öffnete der **Impressum-Link kein sichtbares Fenster** (Modal nicht gefunden). Das deutet auf einen **defekten Impressum-Link** hin – ein fehlendes/unerreichbares Impressum ist **abmahnfähig** (Impressumspflicht § 5 DDG).
- 🟢 Der **Datenschutz-Link** öffnete dagegen ein Modal mit umfangreichem Text (~14.000 Zeichen) – funktioniert also.

> **Bitte zuerst im echten Browser gegenprüfen** (evtl. öffnet das Impressum auf einem anderen Weg). Falls es wirklich defekt ist: **sofort von IWI reparieren lassen** – das ist der akut riskanteste Einzelbefund. Wünschenswert wären zudem **echte, verlinkbare URLs** (z. B. `/s/impressum`, `/s/datenschutz`) statt JS-Modals, weil Modals nicht direkt teilbar und für Suchmaschinen/Behörden schlechter auffindbar sind.

---

## 7. SEO

### 7.1 Shop – 🔴 deutlicher Nachholbedarf
| Prüfpunkt | Befund |
|---|---|
| `<title>` | Generisch („floraleschmiede-shop", „floraleschmiede-shop - Kontakt") |
| **Quelltext-Titel** | 🔴 Im HTML steht wörtlich `<title>{{pageTitle}}</title>` – der Titel wird **erst per JavaScript** gesetzt. Crawler/Social-Previews ohne JS sehen `{{pageTitle}}`. |
| Meta-Description | 🔴 **Komplett fehlend** (auf allen geprüften Seiten) |
| Canonical-Tag | 🔴 Fehlt |
| Open Graph / Twitter Cards | 🔴 Fehlen → schlechte Vorschau beim Teilen in WhatsApp/Facebook |
| Strukturierte Daten (JSON-LD) | 🔴 Fehlen (kein `LocalBusiness`/`Product`) |
| H1 | 🟡 **2× H1** „FLORALE SCHMIEDE" auf einer Seite (sollte genau 1 sein) |
| Bild-`alt` | 🟢 Vorhanden |
| robots.txt / Sitemap | 🟢 Vorhanden (`/s/sitemap`) |

**Kernproblem:** Der Shop ist eine reine JavaScript-App ohne serverseitiges Rendering. Titel und Inhalte existieren im Roh-HTML nicht → schwächere Indexierung und kaputte Link-Vorschauen. **Mittelfristig mit IWI klären**, ob Server-Side-Rendering / Prerendering und gepflegte Meta-Tags pro Produkt/Kategorie möglich sind. Kurzfristig: pro Seite **echte `<title>` + Meta-Description + OG-Tags** im ausgelieferten HTML.

### 7.2 Info-Seite (Wix) – 🟡 solide Basis, Feinschliff
| Prüfpunkt | Befund |
|---|---|
| `<title>`, Meta-Description, Canonical | 🟢 Vorhanden und aussagekräftig |
| Open Graph inkl. Bild | 🟢 Vollständig |
| JSON-LD `LocalBusiness` + `WebSite` | 🟢 Vorhanden |
| **H1** | 🔴 **Kein einziges H1** auf der Startseite – wichtige SEO-Schwäche bei Wix-Seiten. Im Wix-Editor eine sichtbare Überschrift als „Überschrift 1 (H1)" auszeichnen. |
| Meta-Description | 🟡 Enthält **Tippfehler** „GÄRNTER" statt „GÄRTNER" – korrigieren. |
| robots.txt / Sitemap | 🟢 Vorhanden (`sitemap.xml`) |

---

## 7b. SEO-Tiefenanalyse Info-Seite (Wix) – Traffic-Plan

> Kontext: Es handelt sich um einen **lokalen** Floristen/Gärtner in Dettenhausen (Kreis Tübingen). „Richtig Traffic" entsteht hier zu ~80–90 % über **lokale Suche & Google Maps**, nicht über überregionale Keywords. Der Plan ist entsprechend auf **Local SEO** ausgerichtet.

### Befunde (Stichprobe von 10 Seiten, Playwright-Crawl)

| Seite | Title | Meta-Desc | H1 | Wörter |
|---|---|---|---|---|
| `/` (Start) | gut, aber mit Firmenname überladen | ✅ (209) | 🔴 **keins** | 216 |
| `/aktuell` | 🔴 **identisch mit Startseite** (Duplikat) | 🔴 Duplikat | keins | 216 |
| `/gaertnerei` | „Gärtnerei \| …" (kein Ort) | 🔴 **fehlt** | keins | 110 |
| `/floristik` | „Floristik \| …" | 🔴 fehlt | 🔴 Gedicht als H1 | 120 |
| `/hochzeit` | „HOCHZEIT \| …" | 🔴 fehlt | 🔴 ganzer Absatz als H1 | 143 |
| `/bestattung` | „Bestattung \| …" | 🔴 fehlt | keins | 114 |
| `/kraeuter-co` | „Kräuter & Co. \| …" | 🔴 fehlt | 🔴 Absatz als H1 | 119 |
| `/shop` | „Blumenladen online \| …" | 🔴 fehlt | keins | 131 |
| `/dauergrabpflege` | „DAUERgrabpflege \| …" | 🔴 fehlt | 🔴 **6 Absätze à 400 Wörter als H1** | 360 |

**Kernprobleme, die Traffic verhindern:**
1. **Meta-Descriptions fehlen fast überall** → schlechte Klickrate in Google, selbst wenn die Seite rankt.
2. **H1 ist semantisch zerstört** – mal keins, mal werden ganze Absätze/Gedichte als H1 ausgezeichnet. Google erkennt das Seitenthema nicht.
3. **Keine H2-Struktur** (fast überall `h2count = 0`) – keine Gliederung, keine Keyword-Signale.
4. **Sehr dünner Content** (~110–140 Wörter). Für Rankings braucht es 300–600 Wörter echten, lokal relevanten Text pro Leistungsseite.
5. **Keine lokalen Keywords in Titeln** – „Gärtnerei | FLORALE SCHMIEDE" rankt nicht für „Blumenladen Dettenhausen".
6. **Duplicate Content** (`/aktuell` = Startseite; dutzende `kopie-von-…`-Seiten).
7. **Content-Wildwuchs** – 80+ Seiten, darunter tote Saisonseiten (`advent-2016`…`christbaum2020`, `valentin-2019`, `ostern-2018`) und kryptische Auto-Slugs (`kirche-ctgcm`, `contact-4`, `blank-4`, `start-1`, `portfoliodd`). Das verwässert das Crawl-Budget und signalisiert eine „verlassene" Seite.
8. **LocalBusiness-JSON-LD unvollständig** – Name/Adresse/Telefon ja, aber **keine Öffnungszeiten, keine Geo-Koordinaten, kein `sameAs`** (Verknüpfung zu Google-Profil/Social), keine E-Mail.
9. **Schwache TLD `.info`** – für lokales Vertrauen/SEO ist `.de` deutlich stärker (die Domain `floraleschmiede.de` existiert bereits!).

### Maßnahmenplan – nach Wirkung sortiert

**Stufe 0 – der größte Hebel (außerhalb der Website):**
- **Google Unternehmensprofil (Google Business Profile) anlegen/optimieren.** Für einen lokalen Floristen kommt der meiste Traffic aus dem Google-Maps-„Local Pack" („Blumenladen in der Nähe"). Vollständig ausfüllen: Kategorien (Blumengeschäft, Gärtnerei, Floristik), **Öffnungszeiten**, Telefon, Fotos, Leistungen, regelmäßige Beiträge.
- **Bewertungen aktiv sammeln** (Kund:innen nach dem Kauf um eine Google-Rezension bitten). Anzahl + Aktualität der Reviews ist der stärkste lokale Rankingfaktor.
- **NAP-Konsistenz**: Name/Adresse/Telefon identisch auf Website, Shop, Google-Profil und in lokalen Verzeichnissen (Das Örtliche, Gelbe Seiten, Bing Places).

**Stufe 1 – schnelle On-Page-Wins in Wix (1–2 Tage, ohne Programmierung):**
- Für **jede wichtige Seite** im Wix-SEO-Panel setzen:
  - **Eindeutiger Title mit Ort & Keyword**, z. B.
    - Start: „Blumen, Floristik & Gärtnerei in Dettenhausen | FLORALE SCHMIEDE"
    - `/hochzeit`: „Hochzeitsfloristik Dettenhausen & Tübingen | Brautstrauß & Deko"
    - `/bestattung`: „Trauerfloristik & Grabgestecke | Florist Dettenhausen"
    - `/dauergrabpflege`: „Grabpflege & Dauergrabpflege Dettenhausen | FLORALE SCHMIEDE"
    - `/gaertnerei`: „Gärtnerei Dettenhausen – Pflanzen, Stauden, Kräuter"
  - **Individuelle Meta-Description** (140–160 Zeichen) mit Ort + Leistung + Call-to-Action.
- **Genau ein H1 pro Seite** vergeben (sichtbare Hauptüberschrift mit Keyword, z. B. „Hochzeitsfloristik aus Dettenhausen"). Die langen Absätze, die jetzt als H1 ausgezeichnet sind, auf **normalen Fließtext** umstellen, Zwischenüberschriften als **H2** setzen.
- **Tippfehler korrigieren**: „GÄRNTER" → „GÄRTNER" in der Meta-Description der Startseite.
- **`/aktuell` entdoppeln**: eigenen Titel/Description geben oder zusammenführen.
- Fehlende **Bild-`alt`-Texte** ergänzen (z. B. „Brautstrauß weiß-grün, FLORALE SCHMIEDE Dettenhausen") → Ranking in der Google-Bildersuche.

**Stufe 2 – Content & Struktur (laufend):**
- **Aufräumen:** alle `kopie-von-…`-Seiten und toten Saisonseiten (2016–2020) löschen oder per 301 auf die passende aktuelle Seite weiterleiten; kryptische Slugs (`kirche-ctgcm`, `contact-4`) sprechende URLs geben oder entfernen. Weniger, dafür starke Seiten ranken besser.
- **Leistungsseiten ausbauen** auf 300–600 Wörter mit echtem Mehrwert: Was, für wen, Ablauf, Preisrahmen, lokale Bezüge („Lieferung in Dettenhausen, Tübingen, Walddorfhäslach …"), FAQ.
- **Eine echte Kontakt-/Standortseite** mit eingebetteter Google-Karte, Adresse, Anfahrt, Telefon, E-Mail.
- **Saisonale, aktuelle Beiträge** statt alter Eventseiten (Wix-Blog: „Adventskränze 2026", „Muttertag", „Allerheiligen-Grabschmuck") – frischer Content + saisonale Suchanfragen.

**Stufe 3 – Strukturierte Daten & Technik:**
- **LocalBusiness-Schema vervollständigen**: `openingHours`, `geo` (lat/lng), `telephone`, `email`, `priceRange`, `sameAs` (Google-Profil, Instagram/Facebook). Wix-SEO-Apps oder ein Custom-Code-Embed ermöglichen das.
- **Cookie-/Consent-Thema** sauber lösen (siehe Kap. 3) – Google bewertet Datenschutz/Page-Experience mit.
- **Domain-Strategie prüfen:** Hauptauftritt mittelfristig auf **`floraleschmiede.de`** umziehen oder `.de` sauber auf die Hauptseite weiterleiten; die drei Domains konsolidieren.

**Realistische Erwartung:** Stufe 0 + 1 bringen für ein lokales Geschäft erfahrungsgemäß den mit Abstand größten und schnellsten Traffic-Schub (Google Maps + bessere Klickraten). Stufe 2/3 sichern und verstetigen die Rankings.

---

## 7c. Content-Strategie: Was auf welche Seite gehört

> **Kontext zu Sven Kornherr / FLORALE SCHMIEDE:**
> Inhaber: **Sven Kornherr**, Einzelunternehmen (e.K.), über **30 Jahre Erfahrung** als Gärtner und Florist.
> Alleinbetrieb – das ist ein USP, kein Makel (persönliche Handschrift, kein Fließband).
> Standort **Kirchstr. 32, Dettenhausen – direkt beim Friedhof** (starkes Alleinstellungsmerkmal für Trauerfloristik).
> **Fleurop-Partner** und Mitglied in Gartenverband BW-Hessen, Fachverband deutscher Floristen, Genossenschaft württembergischer Friedhofsgärtner.
> Konkurrenz im Raum Tübingen ist aktiv: il fiore, Blumen Stephan (24/7!), Florian Blumen, Reibold.
> **Svens Differenzierung:** Gärtner + Florist aus einer Hand, Spezialist direkt am Friedhof, regionale & handwerkliche Qualität, spontan und flexibel.

**Leitsatz für alle Content-Entscheidungen:**  
*Jede Seite beantwortet eine konkrete Suchfrage aus dem Raum Dettenhausen/Tübingen.*

---

### Startseite `/`

**Was fehlt:**  
Die Seite hat 216 Wörter, kein H1, keine Meta-Description, kein klarer Fokus.

**Content-Impulse:**
- Ein knapper, persönlicher Einstiegstext von Sven – wer er ist, was ihn ausmacht, warum Florale Schmiede – als Storytelling-Anker für alle Leistungsseiten
- Kurze Leistungsübersicht mit Kacheln/Icons (Blumen, Hochzeit, Trauer, Garten, Lieferung) – jede verlinkt auf die jeweilige Unterseite
- **Geografischer Bezug direkt auf der Startseite**: „in Dettenhausen, für den Landkreis Tübingen"
- Aktueller Impuls / saisonaler Hinweis (rotierend, z. B. „Sommerblumen", „Adventskränze auf Bestellung") → Frischesignal für Google
- Trust-Elemente: Fleurop-Badge, 30+ Jahre Erfahrung, Verbandsmitgliedschaften sichtbar platzieren

---

### `/gaertnerei`

**Was fehlt:**  
110 Wörter, kein H1, keine Meta-Description. Nur Navigation zu Unterkategorien.

**Content-Impulse:**
- Was unterscheidet eine **Endverkaufsgärtnerei** von einem normalen Blumenladen? Das erklären – viele Leute kennen den Unterschied nicht.
- Sortimentsüberblick: was wann verfügbar ist (Saison-Logik, z. B. Gemüsejungpflanzen im Frühjahr, Stauden im Sommer, Christrosen im Herbst)
- Woher kommen die Pflanzen? Regionale Herkunft, Direktzucht vs. Zukauf – das ist heute ein Kaufargument
- Unterseiten `/stauden`, `/baumschule`, `/kraeuter-co`, `/beet-und-balkon` brauchen je einen kurzen Einleitungstext, der erklärt **wozu** diese Kategorie gut ist (Pflege-Tipp, Saisonhinweis, typische Fragen)
- **Lokaler SEO-Anker**: „Gärtnerei in Dettenhausen – direkt beim Friedhof, auch für private Gärten im Raum Tübingen"

---

### `/floristik`

**Was fehlt:**  
120 Wörter, H1 ist ein japanisches Gedicht (kein Keyword), keine Meta-Description.

**Content-Impulse:**
- Kurzbeschreibung des handwerklichen Ansatzes: Sven arbeitet allein → jeder Strauß ist Handarbeit, keine Stangenware
- Was ist Floristik bei Sven vs. beim Supermarkt? Der Unterschied in 3–5 Sätzen
- Beispielleistungen mit Bezug auf Anlässe: Geburtstag, Muttertag, Jubiläum, Einweihung, Dankeschön → trifft Suchintention
- Hinweis auf **Fleurop**: Blumen in ganz Deutschland verschicken, auch als Geschenk für Leute, die nicht in Dettenhausen wohnen – das ist ein relevantes Traffic-Keyword
- Saisonkalender als einfache Übersicht: welche Blumen wann aus regionaler Verfügbarkeit kommen

---

### `/hochzeit`

**Was fehlt:**  
143 Wörter, H1 ist ein 180-Zeichen-Absatz, keine Meta-Description. 7 Unterkategorien ohne jede Beschreibung.

**Content-Impulse:**
- Warum einen Floristen mit eigenem Gärtnerei-Hintergrund für die Hochzeit wählen? (frische Pflanzen aus eigener Quelle, Flexibilität beim Termin, persönliche Beratung)
- Pro Unterkategorie je 3–5 Sätze: was ist beim Brautstrauß zu beachten, welche Stile gibt es, wie läuft eine Beratung ab
- **Ablauf beschreiben**: Erstgespräch → Probebindung → Lieferung am Hochzeitstag → das nimmt Paaren Unsicherheit und rankt gut für „Hochzeitsfloristik Tübingen Ablauf"
- Reichweite explizit nennen: Dettenhausen, Tübingen, Waldenbuch, Nürtingen, Böblingen (Landkreisgrenzen sind irrelevant für Google, Ortsnamen nicht)
- Bilder sind auf der Seite – Alt-Texte fehlen noch bei einem Bild

---

### `/bestattung`

**Was fehlt:**  
114 Wörter, kein H1, keine Meta-Description. Nur Kategorie-Navigation (Kranz, Sarg, Handstrauß, Herz, Urne, Kirche …)

**Content-Impulse:**
- Das ist Svens **stärkstes SEO-Asset**: Direkt beim Friedhof Dettenhausen. Das muss auf dieser Seite explizit stehen.
- Einfühlsamer Einstieg – nicht werblich, sondern als Dienstleister in einer sensiblen Situation: „Wir sind da, wenn Sie uns brauchen. Auch kurzfristig."
- Erklärung der Kategorien: Was ist ein Sarggesteck, was ein Urnengesteck, was ein Trauerherz – viele Trauernde wissen das nicht und suchen genau das
- **Dauergrabpflege als Brücke**: die Seite endet nicht mit der Beisetzung – wir kümmern uns auch danach (interner Link zu `/dauergrabpflege`)
- Mitgliedschaft in der **Genossenschaft württembergischer Friedhofsgärtner** sichtbar platzieren – ist ein Qualitäts-/Vertrauenssignal
- Erreichbarkeit betonen: auch spontan, auch am Wochenende (Trauerfälle passieren nicht nach Dienstplan)

---

### `/dauergrabpflege`

**Was steht bereits:**  
360 Wörter, aber als **6 H1-Tags** strukturiert (technisch kaputt). Der Content ist gut – er muss nur korrekt als Fließtext + H2 formatiert werden.

**Content-Impulse:**
- Preis-/Kostenrahmen zumindest grob nennen (häufigste Suchanfrage: „was kostet Dauergrabpflege") – schafft Vertrauen und filtert ernsthafte Anfragen herein
- Treuhand-Variante erklären: das ist ein echtes Alleinstellungsmerkmal, das die meisten Wettbewerber nicht haben – ausführlicher darstellen
- **Einzugsgebiet konkret benennen**: Welche Friedhöfe betreut Sven? Dettenhausen, Walddorfhäslach, Waldenbuch – Ortsnamen = Suchtraffic
- Foto einer gepflegten Grabstätte mit beschreibendem Alt-Text – das ist die wichtigste visuelle Überzeugung auf dieser Seite

---

### `/info` (Über-uns-Seite)

**Was steht bereits:**  
274 Wörter, persönlicher Text zu Sven vorhanden – das ist eine gute Basis.

**Content-Impulse:**
- Svens Geschichte konkreter fassen: Wann gegründet? Was ist der Hintergrund des Namens „Florale Schmiede"? (schon ansatzweise erklärt, aber ausbaubar)
- **30+ Jahre** mehr in den Vordergrund stellen – das ist ein starkes Vertrauenssignal im Handwerk
- Verbandsmitgliedschaften nicht nur als Logo, sondern in 1–2 Sätzen erklären, **was das für den Kunden bedeutet** (Qualitätskontrolle, Weiterbildung, Netzwerk)
- Ein Bild von Sven – persönliches Gesicht eines Einzelunternehmens ist das stärkste Trust-Element überhaupt
- Möglichkeit für **Google-Bewertungslink** direkt auf dieser Seite platzieren

---

### `/aktuell` und Blog (aktuell leer / veraltet)

**Was fehlt:**  
Kein einziger aktueller Beitrag. Die Seite hat denselben Titel+Description wie die Startseite.

**Content-Impulse:**
Das ist der **größte Hebel für kontinuierlichen Traffic**, weil saisonale Suchanfragen real und vorhersagbar sind:

| Saison | Thema/Keyword-Anker |
|---|---|
| Januar/Februar | Vorfrühlings-Schnittblumen, Valentinstag-Ideen |
| März/April | Ostersträuße, Frühjahrsstauden, Gemüsejungpflanzen |
| Mai | Muttertagssträuße, Balkonbepflanzung |
| Juni–August | Sommerblumen regional, Kräuterkörbe, Hochzeitssaison |
| September/Oktober | Allerheiligen-Grabschmuck, Herbstgestecke |
| November/Dezember | Adventskränze auf Bestellung, Weihnachtssterne, Christbäume |

Nicht als formale Blog-Artikel denken – reicht ein Bild + 3–4 Sätze + Kontaktlink. Wichtig ist die **Regelmäßigkeit** (1× pro Monat genügt).

---

### Neue Seite: `/lieferung-und-einzugsgebiet` (existiert noch nicht)

**Warum sinnvoll:**  
„Blumen liefern Tübingen", „Blumenlieferung Dettenhausen", „Fleurop Dettenhausen" – alles Suchanfragen ohne zugehörige Seite.

**Content-Impulse:**
- Liefergebiete explizit aufzählen (Dettenhausen, Waldenbuch, Walddorfhäslach, Tübingen, Nürtingen …)
- Fleurop erklären: was ist das, wie funktioniert's, was kostet ein Fleurop-Strauß
- Mindestbestellwert / Lieferbedingungen falls vorhanden

---

### `/kraeuter-co`, `/beet-und-balkon`, `/stauden`, `/baumschule`

Alle ähnlich: ~110–120 Wörter, H1 ist ein Katalogtext, keine Meta-Description.

**Gemeinsamer Content-Impuls:**
- Pro Seite je **eine Kernantwort**: Was kaufe ich hier, wann ist der beste Zeitpunkt, wie pflege ich es?
- Svens persönliche Empfehlung als kurzer Tipp (macht den Alleinbetrieb zum Vorteil)
- Verlinkung auf die Kauf-Möglichkeit im Shop (floraleschmiede-shop.de)

---

### Was nicht neu geschrieben werden muss – aufräumen ist auch Content-Arbeit

Die ~20 toten Saisonseiten (`advent-2016`, `valentin-2019`, `ostern-2018`, `christbaum2020`, `auszeit2019` …) kosten Crawl-Budget und verwässern die Autorität der guten Seiten. **Löschen oder 301-Weiterleitung** auf die jeweilige aktuelle Kategorie setzt SEO-Kraft frei, ohne eine Zeile neuen Text zu schreiben.

---

## 8. Security-Header (Bonus)

| Header | Shop | Wix |
|---|---|---|
| `Strict-Transport-Security` (HSTS) | 🔴 fehlt | 🟢 gesetzt |
| `X-Content-Type-Options: nosniff` | 🔴 fehlt | 🟢 gesetzt |
| `Content-Security-Policy` | 🔴 fehlt | 🔴 fehlt |
| `X-Frame-Options` / `Referrer-Policy` | 🔴 fehlt | 🟡 teils |

Beim Shop fehlen sämtliche Security-Header. Schnell und risikoarm über die Apache-Konfiguration nachrüstbar (HSTS, nosniff, X-Frame-Options, Referrer-Policy) – Aufgabe für IWI.

---

## 9. Priorisierte Maßnahmenliste

| # | Maßnahme | Wer setzt um | Priorität |
|---|---|---|---|
| 1 | **Impressum-Link im Shop prüfen/reparieren** (öffnet aktuell nichts) | IWI GmbH | 🔴 sofort |
| 2 | **Captcha (Cloudflare Turnstile / Friendly Captcha) + Rate-Limiting** für Kontakt- & Widerrufsformular | IWI GmbH | 🔴 sofort |
| 3 | **Wix-Consent fixen:** Banner-Text korrigieren („weitere Nutzung" raus) + Tracker erst nach Opt-in laden | Inhaber im Wix-Dashboard | 🔴 hoch |
| 4 | Eingangsbestätigung des Widerrufs prüfen (Datum/Uhrzeit/Inhalt, keine „wirksam"-Formulierung) | IWI GmbH | 🟡 hoch |
| 5 | Shop-SEO: echte `<title>`, Meta-Descriptions, OG-Tags, Canonical, nur 1× H1, JSON-LD | IWI GmbH | 🟡 mittel |
| 6 | Wix-SEO: H1 setzen, Tippfehler „GÄRNTER" korrigieren | Inhaber im Wix-Dashboard | 🟡 mittel |
| 7 | `sess`-Cookie auf `Secure` + Security-Header (HSTS, nosniff …) | IWI GmbH | 🟡 mittel |
| 8 | Drei-Domain-Wirrwarr (`.de`/`-shop.de`/`.info`) konsolidieren/verlinken | Inhaber + IWI | 🟢 niedrig |
| 9 | AngularJS 1.x (EOL) / Font Awesome 4 modernisieren | IWI GmbH | 🟢 niedrig/langfristig |

---

## 10. Wichtigste Ansprechpartner / Zuständigkeiten
- **Shop (`-shop.de`):** geschlossenes System der **IWI GmbH** (`iwi.de`). Alle technischen Änderungen (Spam, Impressum, SEO, Security) **müssen über IWI laufen** – kein Selfservice möglich.
- **Info-Seite (`.info`):** **Wix-Dashboard** – Cookie-Banner, H1, Tippfehler u. a. kann der Inhaber selbst (oder du) direkt ändern.

---

### Anhang: erzeugte Screenshots (im Projektordner)
- `shop_home.png` – Shop-Startseite
- `shop_contact.png` – Kontaktformular
- `shop_widerruf.png` – Widerruf-Formular
- `info_home.png` – Wix-Startseite inkl. Cookie-Banner

*Untersuchungs-Skripte: `inspect.mjs`, `inspect2.mjs`, `imp.mjs` (Playwright).*

**Quellen (Recht):**
- [IHK Regensburg – Widerrufsbutton kommt ab Juni 2026](https://www.ihk.de/regensburg/fachthemen/recht/online-recht-und-datenschutz/online-recht/widerrufsbutton-kommt-ab-juni-2026-6933724)
- [Noerr – § 356a BGB tritt am 19. Juni 2026 in Kraft](https://www.noerr.com/de/insights/umsetzungsgesetz-zum-widerrufsbutton-veroeffentlicht)
- [Wettbewerbszentrale – Ab 19.06.2026 ist der Widerrufsbutton Pflicht](https://www.wettbewerbszentrale.de/die-zeit-laeuft-ab-19-06-2026-ist-der-widerrufsbutton-pflicht/)
- [IWI GmbH – Shop-Service](https://www.iwi.de/shop-service.php)
