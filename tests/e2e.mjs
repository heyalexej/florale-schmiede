import { chromium } from 'playwright';
import { createServer } from 'http';
import { readFile, stat } from 'fs/promises';
import { extname, join, normalize } from 'path';

const ROOT = new URL('..', import.meta.url).pathname;
const PORT = 8753;
const MIME = { '.html':'text/html','.css':'text/css','.js':'text/javascript','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml' };

const server = createServer(async (req, res) => {
  try {
    let p = decodeURIComponent(req.url.split('?')[0]);
    if (p === '/') p = '/index.html';
    const file = normalize(join(ROOT, p));
    if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
    const data = await readFile(file);
    res.writeHead(200, { 'Content-Type': MIME[extname(file)] || 'application/octet-stream' });
    res.end(data);
  } catch { res.writeHead(404); res.end('404'); }
});
await new Promise(r => server.listen(PORT, r));
const BASE = `http://localhost:${PORT}`;

const browser = await chromium.launch();
const results = { checks: [], failures: [], requests404: [], external: [] };
const pass = (n, c, d='') => { results.checks.push({ n, ok: !!c, d }); if (!c) results.failures.push(n + (d?` — ${d}`:'')); };

// ---------- Desktop ----------
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'de-DE' });
const page = await ctx.newPage();
const reqHosts = {};
page.on('response', r => {
  const u = new URL(r.url());
  if (u.host !== `localhost:${PORT}`) results.external.push(u.host);
  if (r.status() >= 400) results.requests404.push(`${r.status()} ${u.pathname}`);
});

await page.goto(BASE + '/', { waitUntil: 'load' });
await page.waitForTimeout(800);

// SEO assertions
const seo = await page.evaluate(() => ({
  title: document.title,
  titleLen: document.title.length,
  desc: document.querySelector('meta[name=description]')?.content || '',
  canonical: document.querySelector('link[rel=canonical]')?.href || '',
  robots: document.querySelector('meta[name=robots]')?.content || '',
  og: [...document.querySelectorAll('meta[property^="og:"]')].length,
  h1: [...document.querySelectorAll('h1')].map(h => h.textContent.trim()),
  h2count: document.querySelectorAll('h2').length,
  lang: document.documentElement.lang,
  jsonld: [...document.querySelectorAll('script[type="application/ld+json"]')].map(s => { try { return JSON.parse(s.textContent); } catch { return null; } }),
  imgs: document.querySelectorAll('img').length,
  imgNoAlt: [...document.querySelectorAll('img')].filter(i => !i.alt || !i.alt.trim()).length,
  imgNoDims: [...document.querySelectorAll('img')].filter(i => !i.getAttribute('width') || !i.getAttribute('height')).length,
  viewport: !!document.querySelector('meta[name=viewport]'),
}));

pass('Title vorhanden', seo.title.length > 0, seo.title);
pass('Title-Länge 30–65 Zeichen', seo.titleLen >= 30 && seo.titleLen <= 65, `${seo.titleLen}`);
pass('Title enthält Ort "Dettenhausen"', /dettenhausen/i.test(seo.title));
pass('Meta-Description vorhanden', seo.desc.length > 0);
pass('Meta-Description 120–170 Zeichen', seo.desc.length >= 120 && seo.desc.length <= 170, `${seo.desc.length}`);
pass('Canonical gesetzt', seo.canonical.length > 0, seo.canonical);
pass('robots = index,follow', /index/.test(seo.robots) && /follow/.test(seo.robots));
pass('OG-Tags >= 6', seo.og >= 6, `${seo.og}`);
pass('Genau 1 H1', seo.h1.length === 1, `${seo.h1.length}: ${seo.h1.join(' | ').slice(0,60)}`);
pass('H1 enthält Keyword (Blumen/Floristik)', /blumen|floristik|gärtnerei/i.test(seo.h1[0]||''));
pass('Mehrere H2 (Struktur)', seo.h2count >= 5, `${seo.h2count}`);
pass('lang=de', seo.lang === 'de');
pass('Viewport-Meta', seo.viewport);
pass('Alle Bilder mit alt', seo.imgNoAlt === 0, `${seo.imgNoAlt} ohne alt`);
pass('Alle Bilder mit width/height (CLS)', seo.imgNoDims === 0, `${seo.imgNoDims} ohne dims`);

// JSON-LD LocalBusiness
const lb = seo.jsonld.find(j => j && /Florist|LocalBusiness/.test(j['@type']));
pass('LocalBusiness/Florist JSON-LD vorhanden', !!lb);
if (lb) {
  pass('  → Adresse im Schema', !!lb.address?.streetAddress);
  pass('  → Telefon im Schema', !!lb.telephone);
  pass('  → Öffnungszeiten im Schema', Array.isArray(lb.openingHoursSpecification) && lb.openingHoursSpecification.length > 0);
  pass('  → Geo-Koordinaten im Schema', !!lb.geo?.latitude);
  pass('  → sameAs/Verknüpfungen', Array.isArray(lb.sameAs) && lb.sameAs.length > 0);
}

// No external requests (DSGVO)
const ext = [...new Set(results.external)];
pass('Keine externen Requests beim Laden (DSGVO)', ext.length === 0, ext.join(', '));
pass('Keine 404/Fehler-Requests', results.requests404.length === 0, results.requests404.join(', '));

// Visual: full page desktop
await page.evaluate(() => window.scrollTo(0, 0));
await page.screenshot({ path: join(ROOT, 'tests/shot_desktop_full.png'), fullPage: true });
await page.screenshot({ path: join(ROOT, 'tests/shot_desktop_hero.png') });

// Mobile nav functional test
const m = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, locale: 'de-DE' });
const mp = await m.newPage();
await mp.goto(BASE + '/', { waitUntil: 'load' });
await mp.waitForTimeout(500);
const toggleVisible = await mp.locator('.nav-toggle').isVisible();
pass('Mobile: Burger-Menü sichtbar', toggleVisible);
await mp.locator('.nav-toggle').click();
await mp.waitForTimeout(400);
const navOpen = await mp.locator('#navlinks').evaluate(el => el.classList.contains('open'));
pass('Mobile: Menü öffnet auf Klick', navOpen);
await mp.locator('.nav-toggle').click();
await mp.waitForTimeout(300);
await mp.screenshot({ path: join(ROOT, 'tests/shot_mobile_full.png'), fullPage: true });

// Gallery: square aspect ratio (no stretching)
await page.goto(BASE + '/', { waitUntil: 'load' });
await page.locator('#galerie').scrollIntoViewIfNeeded();
await page.waitForTimeout(600);
const gal = await page.evaluate(() => [...document.querySelectorAll('.gallery figure')].map(f => { const r = f.getBoundingClientRect(); return r.width>0 ? r.height/r.width : 0; }));
const galSquare = gal.every(r => r > 0.9 && r < 1.1);
pass('Galerie-Kacheln sind quadratisch (nicht verzerrt)', galSquare, `Verhältnisse: ${gal.map(r=>r.toFixed(2)).join(',')}`);

// Legal pages reachable
for (const lp of ['/impressum.html', '/datenschutz.html']) {
  const r = await page.goto(BASE + lp, { waitUntil: 'load' });
  pass(`Rechtsseite erreichbar: ${lp}`, r.status() === 200, `HTTP ${r.status()}`);
}

// ---------- Subpages ----------
const subs = ['floristik','hochzeit','trauer','gaertnerei','dauergrabpflege','kraeuter','location'];
for (const s of subs) {
  const r = await page.goto(`${BASE}/${s}.html`, { waitUntil: 'load' });
  pass(`Unterseite lädt: ${s}.html`, r.status() === 200, `HTTP ${r.status()}`);
  const d = await page.evaluate(() => ({
    title: document.title, titleLen: document.title.length,
    desc: (document.querySelector('meta[name=description]')?.content||'').length,
    h1: document.querySelectorAll('h1').length,
    h1text: document.querySelector('h1')?.textContent.trim()||'',
    canonical: !!document.querySelector('link[rel=canonical]'),
    og: document.querySelectorAll('meta[property^="og:"]').length,
    ld: document.querySelectorAll('script[type="application/ld+json"]').length,
    imgNoAlt: [...document.querySelectorAll('img')].filter(i=>!i.alt||!i.alt.trim()).length,
    badLinks: [...document.querySelectorAll('a[href$=".html"]')].map(a=>a.getAttribute('href')),
  }));
  pass(`  ${s}: genau 1 H1`, d.h1 === 1, `${d.h1} – ${d.h1text.slice(0,40)}`);
  pass(`  ${s}: Title 30–70 Z.`, d.titleLen>=30 && d.titleLen<=70, `${d.titleLen}`);
  pass(`  ${s}: Meta-Desc 120–170`, d.desc>=120 && d.desc<=170, `${d.desc}`);
  pass(`  ${s}: Canonical + OG + JSON-LD`, d.canonical && d.og>=5 && d.ld>=1);
  pass(`  ${s}: alle Bilder mit alt`, d.imgNoAlt===0, `${d.imgNoAlt}`);
}

// Verify all internal .html links resolve (no 404)
await page.goto(BASE + '/', { waitUntil: 'load' });
const internalLinks = await page.evaluate(() => [...new Set([...document.querySelectorAll('a[href$=".html"]')].map(a=>a.getAttribute('href')))]);
for (const l of internalLinks) {
  const r = await page.goto(BASE + '/' + l, { waitUntil: 'domcontentloaded' });
  pass(`Interner Link ok: ${l}`, r.status() === 200, `HTTP ${r.status()}`);
}

await browser.close();
server.close();

// Output
console.log('\n================ E2E / SEO TEST ================');
for (const c of results.checks) console.log(`${c.ok ? '✅' : '❌'} ${c.n}${c.d ? '  ('+c.d+')' : ''}`);
console.log('\n-----------------------------------------------');
console.log(`Bestanden: ${results.checks.filter(c=>c.ok).length}/${results.checks.length}`);
if (results.failures.length) { console.log('FEHLER:'); results.failures.forEach(f => console.log('  - ' + f)); process.exitCode = 1; }
else console.log('ALLE CHECKS BESTANDEN 🎉');
