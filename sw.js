// Service Worker for Latinum Logic | Ferengi Rule Oracle
const CACHE_NAME = 'latinum-logic-v2';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './game-styles.css',
  './games.js',
  './dashboard.js',
  './daily-challenges.js',
  './enhanced-reveals.js',
  './enhanced-visuals.js',
  './animations.js',
  './particles.js',
  './themes.js',
  './sound-system.js',
  './achievement-system.js',
  './easter-eggs.js',
  './manifest.json',
  './robots.txt',
  './sitemap.xml',
  './icon-192.png',
  './icon-512.png',
  './favicon.ico'
];

// Install: cache all static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch: cache-first strategy for static assets, network-first for others
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Only handle same-origin requests
  if (url.origin !== location.origin) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        // Cache successful GET responses
        if (response.ok && event.request.method === 'GET') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      });
    }).catch(() => {
      // Offline fallback for navigation requests
      if (event.request.mode === 'navigate') {
        return caches.match('./index.html');
      }
    })
  );
});
