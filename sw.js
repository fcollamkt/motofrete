// Service Worker - MotoFrete
const CACHE = 'motofrete-v1';
const ASSETS = [
  '/motofrete/',
  '/motofrete/index.html',
  '/motofrete/manifest.json',
  '/motofrete/icon-192.png',
  '/motofrete/icon-512.png'
];

// Instalar e cachear arquivos
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

// Ativar e limpar caches antigos
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Servir do cache, buscar da rede se não tiver
self.addEventListener('fetch', e => {
  // Não cachear Firebase
  if (e.request.url.includes('firebase') || e.request.url.includes('googleapis')) {
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
