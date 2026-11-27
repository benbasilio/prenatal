// Offline cache. build.py rewrites V when files change.
const V="5c77fe8f9b";
const FILES=["./","index.html","jspdf.umd.min.js","manifest.webmanifest","icons/icon-180.png","icons/icon-192.png","icons/icon-512.png","icons/maskable-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>Promise.all(FILES.map(f=>fetch(f,{cache:"no-cache"}).then(r=>c.put(f,r))))).then(()=>self.skipWaiting()));});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
// cache first; same-origin GETs only, nothing is sent anywhere
self.addEventListener("fetch",e=>{if(e.request.method!=="GET"||new URL(e.request.url).origin!==location.origin)return;
  // the page itself: network first (revalidating with server) so updates show at once, cache when offline
  if(e.request.mode==="navigate"){e.respondWith(fetch(e.request.url,{cache:"no-cache"}).then(r=>{if(r.ok){const c=r.clone();caches.open(V).then(x=>x.put("index.html",c));}return r;}).catch(()=>caches.match("index.html")));return;}
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(r=>r||fetch(e.request)));});
