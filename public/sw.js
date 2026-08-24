/// <reference lib="webworker" />

const CACHE_NAME = 'scimspt-v1';
const STATIC_CACHE = 'scimspt-static-v1';
const DYNAMIC_CACHE = 'scimspt-dynamic-v1';

// Assets to pre-cache on install
const PRECACHE_URLS = [
  '/Demo3SciMSPT/',
  '/Demo3SciMSPT/manifest.json',
  '/Demo3SciMSPT/icons/icon-192x192.svg',
  '/Demo3SciMSPT/icons/icon-512x512.svg',
];

// Install event - precache static assets
self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
      .then(() => self.clients.claim())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE)
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
});

// Fetch event - network-first with cache fallback
self.addEventListener('fetch', (event: FetchEvent) => {
  const { request } = event;

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip external requests
  if (!request.url.startsWith(self.location.origin)) return;

  // Skip chrome-extension and other non-http(s) requests
  if (!request.protocol.startsWith('http')) return;

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached response and update cache in background
        fetchAndCache(request);
        return cachedResponse;
      }

      // Not in cache - fetch from network
      return fetchAndCache(request);
    }).catch(() => {
      // Network failed - try to return from cache (even if stale)
      return caches.match(request).then((response) => response || new Response('Offline', { status: 503 }));
    })
  );
});

async function fetchAndCache(request: Request): Promise<Response> {
  try {
    const response = await fetch(request);
    
    // Only cache successful responses
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    throw error;
  }
}

// Handle messages from clients
self.addEventListener('message', (event: ExtendableEvent) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    event.waitUntil(self.skipWaiting());
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((names) =>
        Promise.all(names.map((name) => caches.delete(name)))
      ).then(() => 
        self.clients.matchAll({ type: 'window' }).then((clients) => {
          clients.forEach((client) => client.postMessage({ type: 'CACHE_CLEARED' }));
        })
      )
    );
  }
});
