import { chromium } from 'playwright';
import { createServer } from 'http';
import { readFile } from 'fs/promises';
import { extname, join, normalize } from 'path';
const ROOT=new URL('..',import.meta.url).pathname;const PORT=8756;const MIME={'.html':'text/html','.css':'text/css','.js':'text/javascript','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{try{let p=decodeURIComponent(req.url.split('?')[0]);if(p==='/')p='/index.html';const f=normalize(join(ROOT,p));const d=await readFile(f);res.writeHead(200,{'Content-Type':MIME[extname(f)]||'application/octet-stream'});res.end(d);}catch{res.writeHead(404);res.end();}});
await new Promise(r=>server.listen(PORT,r));
const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1});const p=await ctx.newPage();
await p.goto(`http://localhost:${PORT}/`,{waitUntil:'load'});
// force eager loading of every img, then wait until all complete
await p.evaluate(()=>{document.querySelectorAll('img[loading=lazy]').forEach(i=>i.loading='eager');});
await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=300){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,40));}window.scrollTo(0,0);});
await p.waitForFunction(()=>[...document.querySelectorAll('img')].every(i=>i.complete&&i.naturalWidth>0),{timeout:15000});
await p.waitForTimeout(400);
await p.screenshot({path:join(ROOT,'tests/new_full.png'),fullPage:true});
console.log('imgs all loaded, full screenshot done');
await b.close();server.close();
