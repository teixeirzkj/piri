// Minimal service worker — its only job is to make the site installable
// as an app (browsers require one to be registered for the install prompt).
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()))
self.addEventListener('fetch', () => {})
