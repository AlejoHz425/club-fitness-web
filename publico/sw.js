/* Club Fitness · service worker.
   «Primero la red»: siempre pide la versión nueva al servidor y solo usa la
   copia guardada si no hay internet, así nunca queda pegada una versión vieja.
   El aviso de «Versión nueva» de la app no depende de esto: funciona igual
   en el navegador, sin instalar. Solo guarda archivos de este mismo sitio. */
const CACHE = 'clubfitness-v202611272100';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((ks) => Promise.all(ks.filter((k) => k.startsWith('clubfitness-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;   // fuentes de Google: directo a la red
  e.respondWith(
    fetch(req, { cache: 'no-cache' })
      .then((res) => {
        if (res && res.ok && res.type === 'basic') {
          const copia = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copia)).catch(() => {});
        }
        return res;
      })
      .catch(() => caches.match(req)
        .then((r) => r || (req.mode === 'navigate' ? caches.match('./') : undefined))
        .then((r) => r || Response.error()))
  );
});
