/* FUTMINNA Dash service worker: lets the game install on a phone and load offline.
   Bump V whenever you upload a new index.html so players get the update. */
const V='fd-v2';
const CORE=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','bus-voice.mp3','SHUNT.mp3'];
const CDN=['https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js','https://cdnjs.cloudflare.com/ajax/libs/cannon.js/0.6.2/cannon.min.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(async c=>{
  await Promise.all(CORE.map(u=>c.add(u).catch(()=>{})));
  await Promise.all(CDN.map(u=>fetch(u,{mode:'no-cors'}).then(r=>c.put(u,r)).catch(()=>{})));
}).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);
  if(u.pathname.indexOf('/api/')===0||u.hostname.indexOf('onrender.com')>-1)return; /* never cache the leaderboard */
  if(r.mode==='navigate'){
    e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(V).then(c=>c.put('index.html',cp));return res}).catch(()=>caches.match('index.html')));
    return;
  }
  e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(res=>{
    if(res&&(res.ok||res.type==='opaque')&&(u.origin===location.origin||u.hostname==='cdnjs.cloudflare.com')){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp))}
    return res;
  }).catch(()=>caches.match('index.html'))));
});
