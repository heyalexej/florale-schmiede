import { writeFileSync } from 'fs';

const SITE = 'https://www.floraleschmiede.de';
const DIR = './';

// ---------- shared shell ----------
const nav = `
<header class="site-header">
  <nav class="nav" aria-label="Hauptnavigation">
    <a class="brand" href="index.html" aria-label="Florale Schmiede Startseite"><b>FLORALE SCHMIEDE</b><span>Dettenhausen</span></a>
    <button class="nav-toggle" aria-label="Menü öffnen" aria-expanded="false">☰</button>
    <ul class="nav-links" id="navlinks">
      <li><a href="floristik.html">Floristik</a></li>
      <li><a href="gaertnerei.html">Gärtnerei</a></li>
      <li><a href="hochzeit.html">Hochzeit</a></li>
      <li><a href="trauer.html">Trauer</a></li>
      <li><a href="location.html">Location</a></li>
      <li><a href="index.html#ueber-sven">Über mich</a></li>
      <li><a href="index.html#kontakt">Kontakt</a></li>
    </ul>
    <a class="btn btn--primary nav-cta" href="tel:+49715761218" aria-label="Anrufen: 07157 61218"><span class="cta-full">07157&nbsp;/&nbsp;61218</span><span class="cta-icon" aria-hidden="true">📞</span></a>
  </nav>
</header>`;

const footer = `
<section class="section cta-band">
  <div class="container measure">
    <h2>Fragen oder einen Wunsch?</h2>
    <p class="lead text-[#e8f0ea]">Rufen Sie einfach an oder kommen Sie vorbei – ich berate Sie gern persönlich.</p>
    <p class="mt-2"><a class="btn btn--primary btn--lg" href="tel:+49715761218">07157 / 61218</a></p>
  </div>
</section>
<footer class="site-footer">
  <div class="container">
    <div class="foot-grid">
      <div>
        <h4>FLORALE SCHMIEDE</h4>
        <p>Gärtnerei Zimmermann FLORALE SCHMIEDE e.K.<br>Inh. Sven Kornherr<br>Kirchstraße 32, 72135 Dettenhausen</p>
        <p>Ihr Blumenfachgeschäft &amp; Ihre Gärtnerei im Landkreis Tübingen.</p>
      </div>
      <div>
        <h4>Leistungen</h4>
        <ul class="foot-links">
          <li><a href="floristik.html">Floristik &amp; Sträuße</a></li>
          <li><a href="hochzeit.html">Hochzeitsfloristik</a></li>
          <li><a href="trauer.html">Trauerfloristik</a></li>
          <li><a href="gaertnerei.html">Gärtnerei &amp; Pflanzen</a></li>
          <li><a href="dauergrabpflege.html">Dauergrabpflege</a></li>
          <li><a href="kraeuter.html">Kräuter &amp; Essbares</a></li>
          <li><a href="location.html">Location &amp; Veranstaltungen</a></li>
        </ul>
      </div>
      <div>
        <h4>Kontakt &amp; Rechtliches</h4>
        <ul class="foot-links">
          <li><a href="tel:+49715761218">07157 / 61218</a></li>
          <li><a href="mailto:dialog@floraleschmiede.de">dialog@floraleschmiede.de</a></li>
          <li><a href="https://www.floraleschmiede-shop.de/" rel="noopener">Online-Shop</a></li>
          <li><a href="impressum.html">Impressum</a></li>
          <li><a href="datenschutz.html">Datenschutz</a></li>
        </ul>
      </div>
    </div>
    <div class="foot-bottom">
      <span>© <span id="year">2026</span> Florale Schmiede – Dettenhausen. Mit ❤️ für Pflanzen.</span>
      <span>Fleurop-Partner · Mitglied im Fachverband Deutscher Floristen</span>
    </div>
  </div>
</footer>
<script>
(function(){var t=document.querySelector('.nav-toggle'),l=document.getElementById('navlinks');
if(t&&l){t.addEventListener('click',function(){var o=l.classList.toggle('open');t.setAttribute('aria-expanded',o?'true':'false');});}
var y=document.getElementById('year');if(y)y.textContent=new Date().getFullYear();})();
</script>`;

const favicon = `<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='12' fill='%23c2703d'/%3E%3Cg fill='%234a7c59'%3E%3Cellipse cx='50' cy='24' rx='10' ry='18'/%3E%3Cellipse cx='50' cy='76' rx='10' ry='18'/%3E%3Cellipse cx='24' cy='50' rx='18' ry='10'/%3E%3Cellipse cx='76' cy='50' rx='18' ry='10'/%3E%3C/g%3E%3C/svg%3E">`;

// Escape for use inside HTML attributes (verhindert Attribut-Abbruch durch " und &)
const esc = (s) => String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;');

const page = (p) => {
  const url = `${SITE}/${p.slug}.html`;
  const descA = esc(p.desc), titleA = esc(p.title);
  const faq = p.faq && p.faq.length ? `
      <div class="faq">
        <h2>Häufige Fragen</h2>
        ${p.faq.map(f=>`<details><summary>${f.q}</summary><p>${f.a}</p></details>`).join('\n        ')}
      </div>` : '';
  const faqLd = p.faq && p.faq.length ? `,
{
  "@context":"https://schema.org","@type":"FAQPage",
  "mainEntity":[${p.faq.map(f=>`{"@type":"Question","name":${JSON.stringify(f.q)},"acceptedAnswer":{"@type":"Answer","text":${JSON.stringify(f.a)}}}`).join(',')}]
}` : '';
  return `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${p.title}</title>
<meta name="description" content="${descA}">
<meta name="robots" content="index, follow">
<link rel="canonical" href="${url}">
<meta name="theme-color" content="#2f5d3f">
<meta property="og:type" content="article">
<meta property="og:title" content="${titleA}">
<meta property="og:description" content="${descA}">
<meta property="og:locale" content="de_DE">
<meta property="og:url" content="${url}">
<meta property="og:site_name" content="FLORALE SCHMIEDE">
<meta property="og:image" content="${SITE}/img/${p.img}">
<meta name="twitter:card" content="summary_large_image">
${favicon}
<link rel="stylesheet" href="style.css">
<script type="application/ld+json">
[{
  "@context":"https://schema.org","@type":"BreadcrumbList",
  "itemListElement":[
    {"@type":"ListItem","position":1,"name":"Start","item":"${SITE}/"},
    {"@type":"ListItem","position":2,"name":"${p.crumb}","item":"${url}"}
  ]
},
{
  "@context":"https://schema.org","@type":"Service",
  "serviceType":"${p.crumb}",
  "areaServed":["Dettenhausen","Tübingen","Walddorfhäslach","Waldenbuch","Nürtingen"],
  "provider":{"@type":"Florist","name":"Gärtnerei Zimmermann FLORALE SCHMIEDE e.K.","telephone":"+49 7157 61218","address":{"@type":"PostalAddress","streetAddress":"Kirchstraße 32","postalCode":"72135","addressLocality":"Dettenhausen","addressCountry":"DE"}}
}${faqLd}]
</script>
</head>
<body>
${nav}
<main>
<section class="page-hero">
  <div class="page-hero__bg"><img src="img/${p.img}" alt="${p.imgAlt}" fetchpriority="high"></div>
  <div class="container page-hero__inner">
    <nav class="breadcrumb" aria-label="Brotkrumen"><a href="index.html">Start</a> <span>/</span> ${p.crumb}</nav>
    <h1>${p.h1}</h1>
    <p class="lead">${p.lead}</p>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="prose--split">
      <div class="prose">
        ${p.body}
        ${faq}
        <div class="btn-row mt-8"><a class="btn btn--primary btn--lg" href="tel:+49715761218">Jetzt anrufen: 07157 / 61218</a><a class="btn btn--ghost btn--lg" href="index.html#kontakt">Kontakt &amp; Anfahrt</a></div>
      </div>
      <aside class="prose__aside"><img src="img/${p.aside}" alt="${p.asideAlt}" loading="lazy"></aside>
    </div>
  </div>
</section>
</main>
${footer}
</body>
</html>`;
};

// ---------- page data ----------
const pages = [
{
  slug:'floristik', crumb:'Floristik', img:'floristik.jpg', aside:'g2.jpg',
  imgAlt:'Handgebundener Strauß aus rosafarbenen Rosen der Floralen Schmiede',
  asideAlt:'Strauß aus Pfingstrosen in zarten Tönen',
  title:'Floristik & Sträuße in Dettenhausen | FLORALE SCHMIEDE',
  desc:'Handgebundene Sträuße für jeden Anlass – frisch, saisonal und individuell. Florist in Dettenhausen, Fleurop-Partner für deutschlandweiten Versand.',
  h1:'Floristik &amp; Sträuße aus Dettenhausen',
  lead:'Jeder Strauß ist Handarbeit – frisch gebunden, saisonal gedacht und auf Ihren Anlass abgestimmt.',
  body:`
        <p>Ein Blumenstrauß sagt oft mehr als viele Worte. Bei der Floralen Schmiede entsteht jeder Strauß persönlich von Hand – keine Stangenware aus dem Eimer, sondern eine individuelle Zusammenstellung, die zu Ihrem Anlass und zur Jahreszeit passt.</p>
        <h2>Sträuße für jeden Anlass</h2>
        <p>Ob spontane Freude oder lang geplantes Geschenk – wir binden Ihren Strauß so, wie Sie ihn brauchen:</p>
        <ul class="tick">
          <li>Geburtstag, Muttertag &amp; Valentinstag</li>
          <li>Jubiläum, Hochzeitstag &amp; Verlobung</li>
          <li>Geburt, Taufe &amp; Einweihung</li>
          <li>Dankeschön, Genesung oder einfach „weil"</li>
        </ul>
        <h2>Frisch &amp; saisonal aus eigener Gärtnerei</h2>
        <p>Weil wir zugleich eine Endverkaufsgärtnerei sind, kommen viele Pflanzen aus kurzer Distanz und sind entsprechend frisch. Das merkt man – an der Haltbarkeit und an der Auswahl, die mit den Jahreszeiten wechselt. Sagen Sie uns Ihr Budget und Ihren Anlass, den Rest übernehmen wir.</p>
        <h2>Blumen verschicken mit Fleurop</h2>
        <p>Sie möchten jemandem in einer anderen Stadt eine Freude machen? Als <strong>Fleurop-Partner</strong> verschicken wir Blumengrüße deutschlandweit. Regional liefern wir in Dettenhausen, Tübingen und Umgebung.</p>`,
  faq:[
    {q:'Kann ich einen Strauß kurzfristig bekommen?',a:'In der Regel ja. Rufen Sie kurz an – häufig lässt sich Ihr Strauß noch am selben Tag binden.'},
    {q:'Verschickt ihr Blumen auch in andere Städte?',a:'Ja, über Fleurop versenden wir deutschlandweit. Regional liefern wir im Raum Dettenhausen/Tübingen selbst aus.'},
  ],
},
{
  slug:'hochzeit', crumb:'Hochzeit', img:'hochzeit.jpg', aside:'g6.jpg',
  imgAlt:'Cremeweißer Brautstrauß aus Rosen für eine Hochzeit',
  asideAlt:'Blumenschmuck am Hochzeitsauto',
  title:'Hochzeitsfloristik Dettenhausen & Tübingen | FLORALE SCHMIEDE',
  desc:'Brautstrauß, Anstecker, Tisch- & Kirchenschmuck und Autodeko – stimmige Hochzeitsfloristik aus Dettenhausen für Tübingen und Umgebung.',
  h1:'Hochzeitsfloristik für Ihren schönsten Tag',
  lead:'Vom Brautstrauß bis zur kompletten Location – florale Begleitung, die zu Ihnen und Ihrem Fest passt.',
  body:`
        <p>Ihre Hochzeit ist einzigartig – und genau so sollte auch der Blumenschmuck sein. Bei der Floralen Schmiede planen wir Ihre Hochzeitsfloristik in Ruhe und stimmen jedes Detail aufeinander ab.</p>
        <h2>Alles aus einer Hand</h2>
        <ul class="tick">
          <li>Brautstrauß &amp; Anstecker für das Brautpaar und die Gäste</li>
          <li>Haarschmuck, Armschmuck &amp; Ringkissen</li>
          <li>Kirchen- und Altarschmuck</li>
          <li>Tischdekoration &amp; Raumgestaltung</li>
          <li>Autoschmuck für die Fahrt</li>
        </ul>
        <h2>So läuft die Planung ab</h2>
        <p>Damit Sie entspannt feiern können, gehen wir Schritt für Schritt vor:</p>
        <ul class="tick">
          <li><strong>1. Erstgespräch</strong> – wir lernen Ihre Wünsche, Farben, Location und Ihr Budget kennen.</li>
          <li><strong>2. Konzept &amp; Probebindung</strong> – auf Wunsch sehen Sie Ihren Brautstrauß vorab.</li>
          <li><strong>3. Liefertag</strong> – alles wird pünktlich und frisch zu Ihrem Fest gebracht.</li>
        </ul>
        <h2>Für Dettenhausen, Tübingen &amp; Umgebung</h2>
        <p>Wir gestalten Hochzeiten in Dettenhausen, Tübingen, Walddorfhäslach, Waldenbuch, Nürtingen und der weiteren Umgebung. Sprechen Sie uns früh an – beliebte Termine sind schnell vergeben.</p>`,
  faq:[
    {q:'Wie früh sollten wir anfragen?',a:'Je früher, desto besser – idealerweise einige Monate vorher. So sichern wir uns Ihren Termin und haben Zeit für ein stimmiges Konzept.'},
    {q:'Bekommen wir den Brautstrauß vorab zu sehen?',a:'Auf Wunsch fertigen wir eine Probebindung an, damit Sie sich Ihren Brautstrauß vor dem großen Tag ansehen können.'},
  ],
},
{
  slug:'trauer', crumb:'Trauerfloristik', img:'trauer.jpg', aside:'g8.jpg',
  imgAlt:'Würdevolles Trauergesteck mit warmen Blütenfarben',
  asideAlt:'Farbenfrohes Grabgesteck',
  title:'Trauerfloristik & Grabschmuck | Florist Dettenhausen',
  desc:'Kränze, Sarg- und Urnengestecke, Trauersträuße und Grabschmuck – würdevoll gestaltet. Direkt am Friedhof Dettenhausen, auch kurzfristig.',
  h1:'Trauerfloristik – direkt am Friedhof',
  lead:'In einer schweren Zeit nehmen wir Ihnen gern etwas ab – einfühlsam, persönlich und unkompliziert.',
  body:`
        <p>Der Abschied von einem geliebten Menschen fällt schwer. Mit unserer Trauerfloristik möchten wir Ihnen in dieser Zeit zur Seite stehen und einen würdevollen Rahmen schaffen. Unsere Gärtnerei liegt <strong>direkt am Friedhof Dettenhausen</strong> – so sind wir schnell und unkompliziert für Sie da, auch kurzfristig.</p>
        <h2>Unsere Trauerfloristik im Überblick</h2>
        <ul class="tick">
          <li><strong>Kränze</strong> – klassisch oder modern gebunden</li>
          <li><strong>Sarggestecke</strong> – als zentraler Blumenschmuck für die Trauerfeier</li>
          <li><strong>Urnengestecke</strong> – passend für die Urnenbeisetzung</li>
          <li><strong>Trauersträuße &amp; Grabschmuck</strong> – zum Abschied und zum Gedenken</li>
        </ul>
        <p>Sie wissen nicht genau, was Sie brauchen? Das ist völlig in Ordnung. Wir beraten Sie in Ruhe und ohne Eile und gestalten den Blumenschmuck nach Ihren Wünschen und im Sinne des Verstorbenen.</p>
        <h2>Auch über den Abschied hinaus</h2>
        <p>Nach der Beisetzung kümmern wir uns auf Wunsch weiter um die Grabstätte – von der Neuanlage bis zur dauerhaften Pflege. Mehr dazu finden Sie auf unserer Seite <a href="dauergrabpflege.html">Grab- &amp; Dauergrabpflege</a>.</p>
        <p>Als Mitglied der <strong>Genossenschaft württembergischer Friedhofsgärtner</strong> arbeiten wir nach anerkannten fachlichen Standards.</p>`,
  faq:[
    {q:'Sind Sie auch kurzfristig erreichbar?',a:'Ja. Trauerfälle richten sich nicht nach Öffnungszeiten – rufen Sie einfach an, wir finden eine Lösung, auch außerhalb der regulären Zeiten.'},
    {q:'Kümmern Sie sich auch um das Grab nach der Beisetzung?',a:'Gerne. Wir bieten Grabneuanlage, saisonale Bepflanzung und Dauergrabpflege an – auf Wunsch mit Treuhandvertrag.'},
  ],
},
{
  slug:'gaertnerei', crumb:'Gärtnerei', img:'gaertnerei.jpg', aside:'kraeuter.jpg',
  imgAlt:'Blick in das Gewächshaus der Gärtnerei Florale Schmiede',
  asideAlt:'Sonnenblume und essbare Pflanzen aus dem Sortiment',
  title:'Gärtnerei Dettenhausen – Pflanzen & Kräuter | FLORALE SCHMIEDE',
  desc:'Endverkaufsgärtnerei in Dettenhausen: Stauden, Beet- & Balkonpflanzen, Gehölze aus eigener Baumschule, Gemüsejungpflanzen und Kräuter – persönlich beraten.',
  h1:'Gärtnerei in Dettenhausen – mehr als ein Blumenladen',
  lead:'Als Endverkaufsgärtnerei ziehen und verkaufen wir Pflanzen direkt – kurze Wege, frische Ware, ehrliche Beratung.',
  body:`
        <p>Was ist eigentlich eine Endverkaufsgärtnerei? Ganz einfach: Wir verkaufen Pflanzen nicht nur, wir kennen sie. Vieles wächst bei uns vor Ort oder kommt aus kurzer Distanz – das bedeutet frische Ware und Beratung von jemandem, der weiß, wovon er spricht.</p>
        <h2>Unser Sortiment – je nach Jahreszeit</h2>
        <ul class="tick">
          <li>Stauden &amp; mehrjährige Pflanzen</li>
          <li>Beet- &amp; Balkonpflanzen für die Saison</li>
          <li>Gehölze aus eigener Baumschule</li>
          <li>Gemüsejungpflanzen, Kräuter &amp; Beerenobst</li>
          <li>Zimmerpflanzen &amp; Pflanzen für den Innenraum</li>
        </ul>
        <p>Weil sich das Angebot mit den Jahreszeiten ändert, lohnt sich der Besuch immer wieder neu – im Frühjahr die Jungpflanzen, im Sommer die Stauden, im Herbst die Zwiebeln und winterharten Gehölze.</p>
        <h2>Persönliche Beratung inklusive</h2>
        <p>Welcher Standort, welche Pflege, was passt zusammen? Wir nehmen uns Zeit für Ihre Fragen – ob für den Balkonkasten, das neue Beet oder die Grabbepflanzung. Kommen Sie vorbei, am besten mit ein paar Fotos Ihres Gartens.</p>`,
  faq:[
    {q:'Wann ist die beste Zeit zum Pflanzen?',a:'Das hängt von der Pflanze ab – wir beraten Sie gern, was gerade Saison hat und wann sich das Pflanzen lohnt.'},
    {q:'Kann ich mich auch nur beraten lassen?',a:'Selbstverständlich. Bringen Sie gern Fotos Ihres Gartens oder Balkons mit, dann finden wir gemeinsam die passenden Pflanzen.'},
  ],
},
{
  slug:'dauergrabpflege', crumb:'Dauergrabpflege', img:'grabpflege.jpg', aside:'trauer.jpg',
  imgAlt:'Saisonal bepflanztes, gepflegtes Grab mit bunten Blumen',
  asideAlt:'Würdevolles Grabgesteck mit warmen Farben',
  title:'Grabpflege & Dauergrabpflege Dettenhausen | FLORALE SCHMIEDE',
  desc:'Grabneuanlage, saisonale Bepflanzung und Dauergrabpflege in Dettenhausen – auf Wunsch mit Treuhandvertrag. Wir pflegen die Grabstätte über Jahre.',
  h1:'Grab- &amp; Dauergrabpflege in Dettenhausen',
  lead:'Von der Neuanlage bis zur dauerhaften Pflege über Jahre – wir kümmern uns, damit die Grabstätte immer gepflegt aussieht.',
  body:`
        <p>Ein gepflegtes Grab ist ein Zeichen der Erinnerung – und nicht jeder kann sich selbst regelmäßig darum kümmern. Genau hier sind wir für Sie da: direkt am Friedhof Dettenhausen, mit Erfahrung und Verlässlichkeit.</p>
        <h2>Grabneuanlage</h2>
        <p>Gerade nach einer Beisetzung stellt sich die Frage, wie die Grabstätte dauerhaft schön angelegt werden kann. Wir beraten Sie direkt an der Grabstätte, mit einer großen Auswahl an Pflanzen vor Ort, und übernehmen Bepflanzung, hochwertige Erde und das Herrichten des Grabhügels.</p>
        <h2>Einzelauftrag oder Dauerauftrag</h2>
        <ul class="tick">
          <li><strong>Einzelauftrag</strong> – einmalige Bepflanzung oder Pflege nach Wunsch.</li>
          <li><strong>Saisonale Bepflanzung</strong> – frisch gestaltet im Frühjahr, Sommer und Herbst sowie zu Gedenktagen.</li>
          <li><strong>Dauerauftrag</strong> – regelmäßige Pflege über Jahre, deren Laufzeit Sie bestimmen.</li>
        </ul>
        <h2>Sicherheit mit Treuhandvertrag</h2>
        <p>Auf Wunsch über einen Dauergrabpflegevertrag mit der Treuhandstelle: Die Vertragssumme wird treuhänderisch verwaltet und verzinst, Preissteigerungen werden ausgeglichen und die Grabstätte regelmäßig durch einen unabhängigen Fachmann überwacht – ohne weitere Kosten bei bestens gepflegtem Grab.</p>
        <p style="font-size:.95rem;color:var(--ink-soft)">Wir betreuen Gräber in Dettenhausen und Umgebung. Die genauen Kosten richten sich nach Größe und Bepflanzung der Grabstätte – sprechen Sie uns für ein unverbindliches Angebot an.</p>`,
  faq:[
    {q:'Was kostet die Dauergrabpflege?',a:'Das hängt von Größe und gewünschter Bepflanzung des Grabes ab. Wir erstellen Ihnen gern ein unverbindliches, individuelles Angebot.'},
    {q:'Was ist der Vorteil eines Treuhandvertrags?',a:'Die Vertragssumme wird treuhänderisch verwaltet und verzinst, Preissteigerungen werden ausgeglichen und die Pflege über die gesamte Laufzeit unabhängig überwacht.'},
  ],
},
{
  slug:'kraeuter', crumb:'Kräuter & Essbares', img:'kraeuter.jpg', aside:'gaertnerei.jpg',
  imgAlt:'Sonnenblume und essbare Pflanzen aus dem Sortiment der Floralen Schmiede',
  asideAlt:'Pflanzenvielfalt im Gewächshaus der Gärtnerei',
  title:'Kräuter, Heilpflanzen & Essbares | Gärtnerei Dettenhausen',
  desc:'Heilpflanzen, Kräuter, Beerensträucher, Obstgehölze und tropische Raritäten – „Kräuterbeet to go" für Garten und Balkon aus der Gärtnerei in Dettenhausen.',
  h1:'Kräuter, Heilpflanzen &amp; Essbares',
  lead:'Essbares für Garten und Balkon – vom Küchenkraut über Beerenobst bis zur tropischen Rarität.',
  body:`
        <p>Selbst geerntet schmeckt es am besten. In unserer Gärtnerei finden Sie eine große Auswahl an essbaren und nützlichen Pflanzen – für die Küche, die Hausapotheke oder einfach zum Ausprobieren.</p>
        <h2>Aus unserem Sortiment</h2>
        <ul class="tick">
          <li>Küchen- &amp; Heilkräuter, auch als „Kräuterbeet to go"</li>
          <li>Beerensträucher &amp; Obstgehölze</li>
          <li>Gemüsejungpflanzen &amp; Erdbeeren</li>
          <li>Teepflanzen &amp; essbare Sträucher</li>
          <li>Tropische Raritäten &amp; Exoten – z. B. „Kraut der Unsterblichkeit"</li>
        </ul>
        <h2>Beratung für Ihr essbares Beet</h2>
        <p>Welche Kräuter vertragen sich, was gedeiht im Topf, was braucht Sonne? Wir helfen Ihnen, Ihr essbares Beet oder Ihren Kräuterbalkon zusammenzustellen – passend zu Standort und Jahreszeit.</p>`,
  faq:[
    {q:'Was ist ein „Kräuterbeet to go"?',a:'Eine fertig zusammengestellte Auswahl passender Kräuter, die Sie direkt mitnehmen und einpflanzen können – ideal für den schnellen Start.'},
    {q:'Habt ihr auch seltene oder exotische Pflanzen?',a:'Ja, neben klassischen Kräutern führen wir tropische Raritäten und Exoten. Das Angebot wechselt – schauen Sie gern vorbei.'},
  ],
},
{
  slug:'location', crumb:'Location', img:'location-wide.jpg', aside:'location2.jpg',
  imgAlt:'Stimmungsvolle Veranstaltungs-Location der Floralen Schmiede in Dettenhausen',
  asideAlt:'Eingangsbereich der Location im grünen Ambiente',
  title:'Location & Veranstaltungsort in Dettenhausen | FLORALE SCHMIEDE',
  desc:'Feiern mitten im Grünen: Die Location der Floralen Schmiede in Dettenhausen lässt sich für Geburtstage, Hochzeiten, Trauerfeiern und Firmenfeiern mieten.',
  h1:'Ihre Location für Feiern in Dettenhausen',
  lead:'Ein stimmungsvoller Ort im Grünen – zu mieten für Ihre ganz persönliche Veranstaltung.',
  body:`
        <p>Unsere Location ist mehr als eine Gärtnerei: Der besondere Raum im grünen Ambiente lässt sich für Ihre Feier mieten. Ob fröhliches Fest oder ruhiger Abschied – hier finden Ihre Gäste einen Rahmen, der in Erinnerung bleibt.</p>
        <h2>Für welche Anlässe?</h2>
        <ul class="tick">
          <li><strong>Geburtstage</strong> &amp; private Feiern</li>
          <li><strong>Hochzeiten</strong> &amp; Feste</li>
          <li><strong>Trauerfeiern</strong> &amp; Leichenschmaus</li>
          <li><strong>Firmenfeiern</strong>, Jubiläen &amp; Veranstaltungen</li>
        </ul>
        <h2>Alles aus einer Hand</h2>
        <p>Das Schöne: Floristik und Gärtnerei sind direkt vor Ort. Auf Wunsch gestalte ich Ihre Feier floral und dekorativ passend zum Anlass – von der Tischdeko bis zum großen Blumenschmuck. So müssen Sie sich um weniger kümmern.</p>
        <h2>So einfach geht's</h2>
        <p>Erzählen Sie mir von Ihrem Anlass: Wann, für wie viele Gäste und mit welcher Idee? Mit etwas Vorlauf finden wir gemeinsam den richtigen Rahmen. Rufen Sie an oder schreiben Sie mir – ich freue mich darauf.</p>`,
  faq:[
    {q:'Für wie viele Gäste eignet sich die Location?',a:'Das hängt vom Anlass und der Bestuhlung ab. Sprechen Sie mich an – wir schauen gemeinsam, ob der Rahmen zu Ihrer Feier passt.'},
    {q:'Kann die Feier auch floral dekoriert werden?',a:'Sehr gerne. Da Gärtnerei und Floristik direkt vor Ort sind, gestalte ich Ihre Veranstaltung auf Wunsch passend – alles aus einer Hand.'},
    {q:'Sind auch Trauerfeiern möglich?',a:'Ja. Für Trauerfeiern und den anschließenden Leichenschmaus bietet die Location einen ruhigen, würdevollen Rahmen – auf Wunsch mit passendem Blumenschmuck.'},
  ],
},
];

for (const p of pages) {
  writeFileSync(DIR + p.slug + '.html', page(p));
  console.log('wrote', p.slug + '.html');
}
