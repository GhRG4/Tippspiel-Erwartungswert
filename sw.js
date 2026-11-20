const C='tippspiel-v1';
const FILES=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png',
'https://cdnjs.cloudflare.com/ajax/libs/react/18.3.1/umd/react.production.min.js',
'https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.3.1/umd/react-dom.production.min.js'];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(C).then(c=>Promise.all(FILES.map(f=>c.add(f).catch(()=>{})))).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=='GET'||u.hostname==='api.oddspapi.io')return;
  e.respondWith(fetch(r).then(res=>{
    if(res&&res.ok){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp));}
    return res;
  }).catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||caches.match('index.html'))));
});
