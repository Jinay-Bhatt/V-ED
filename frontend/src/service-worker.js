/* eslint-disable no-restricted-globals */

// This is the service worker with the Cache-first Network strategy.
// For more information, visit https://goo.gl/pQE752
/* global clients */
import { precacheAndRoute } from 'workbox-precaching';
precacheAndRoute(self.__WB_MANIFEST);
const CACHE_NAME = 'v-ed-platform-cache-v1';
const DATA_CACHE_NAME = 'v-ed-data-cache-v1';

// List of URLs to cache when the service worker is installed.
// These are your app's static assets.
const urlsToCache = [
  '/',
  '/index.html',
  // Create React App generates these paths, ensure they are correct after build
  // You might need to check your 'build' folder for exact paths like /static/js/main.chunk.js
  // For development, these might not be served directly from root.
  // For now, let's assume direct roots for public folder items.
  // We'll adjust if build output changes.
  '/style.css', // Your custom global CSS
  '/login.html', // Your login page
  '/login.css', // Your login CSS
  '/login.js', // Your login JS
  '/offline.html',
  // Add your icon and screenshot paths here
  '/icons/favicon.ico',
  '/icons/icon-72x72.png',
  '/icons/icon-96x96.png',
  '/icons/icon-128x128.png',
  '/icons/icon-144x144.png',
  '/icons/icon-152x152.png',
  '/icons/icon-192x192.png',
  '/icons/icon-384x384.png',
  '/icons/icon-512x512.png',
  '/icons/shortcut-learn.png',
  '/icons/shortcut-games.png',
  '/icons/checkmark.png',
  '/icons/xmark.png',
  '/screenshots/desktop.png',
  '/screenshots/mobile.png',
];

self.addEventListener('install', (event) => {
  console.log('[Service Worker] Install');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching app shell');
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activate');
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
            console.log('[Service Worker] Removing old cache', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Serve data from data cache if available, then fetch from network and update cache
  if (url.pathname.startsWith('/api/') || request.url.includes('localhost:5000')) {
    event.respondWith(
      caches.open(DATA_CACHE_NAME).then((cache) => {
        return fetch(request)
          .then((response) => {
            // If the network request is successful, cache it and return
            if (response.status === 200) {
              cache.put(request, response.clone());
            }
            return response;
          })
          .catch(() => {
            // If network fails, try to serve from cache
            return cache.match(request).then(cachedResponse => {
              if (cachedResponse) {
                console.log('[Service Worker] Serving API from cache:', request.url);
                return cachedResponse;
              }
              // If not in cache and network failed, return a generic offline response
              return new Response(JSON.stringify({ error: 'Offline', message: 'Backend not reachable, data unavailable offline.' }), {
                status: 503,
                statusText: 'Service Unavailable',
                headers: { 'Content-Type': 'application/json' }
              });
            });
          });
      })
    );
    return;
  }

  // Serve static assets from cache, falling back to network
  event.respondWith(
    caches.match(request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(request).then((networkResponse) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, networkResponse.clone());
          return networkResponse;
        });
      }).catch(() => {
        // If all else fails, and it's a navigation request, serve an offline page
        if (request.mode === 'navigate') {
          return caches.match('/offline.html');
        }
        return new Response('<h1>Offline</h1><p>You are offline and this content is not cached.</p>', {
          headers: { 'Content-Type': 'text/html' }
        });
      });
    })
  );
});

// Handle push notifications (optional)
self.addEventListener('push', (event) => {
  const title = 'V-Ed Platform';
  const options = {
    body: event.data ? event.data.text() : 'New content available!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png', // You'd need to create this badge image
    vibrate: [200, 100, 200],
    actions: [
      { action: 'open_url', title: 'Open App', icon: '/icons/checkmark.png' },
      { action: 'close', title: 'Close', icon: '/icons/xmark.png' },
    ],
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'open_url') {
    event.waitUntil(clients.openWindow('/'));
  }
});
