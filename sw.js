const CACHE_ADI = 'depo-v12';

const KABUK = [
  './',
  './index.html',
  './products.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-database-compat.js',
];

self.addEventListener('install', olay => {
  olay.waitUntil(
    caches.open(CACHE_ADI).then(c => c.addAll(KABUK))
  );
});

self.addEventListener('activate', olay => {
  olay.waitUntil(
    caches.keys()
      .then(adlar => Promise.all(adlar.filter(a => a !== CACHE_ADI).map(a => caches.delete(a))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', olay => {
  const istek = olay.request;
  if (istek.method !== 'GET') return;

  // Veritabani trafigi onbellege alinmaz - canli veri olmali
  if (istek.url.includes('firebasedatabase.app') || istek.url.includes('firebaseio.com')) return;

  olay.respondWith(
    caches.match(istek).then(bulunan => {
      if (bulunan) return bulunan;
      return fetch(istek).then(yanit => {
        if (yanit.ok && (istek.url.startsWith(self.registration.scope) || istek.url.includes('gstatic.com'))) {
          const kopya = yanit.clone();
          caches.open(CACHE_ADI).then(c => c.put(istek, kopya));
        }
        return yanit;
      }).catch(() => caches.match('./index.html'));
    })
  );
});

self.addEventListener('message', olay => {
  if (olay.data === 'HEMEN_GEC') self.skipWaiting();
});
