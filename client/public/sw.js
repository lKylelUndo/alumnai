self.addEventListener('install', function () {
  self.skipWaiting()
})

self.addEventListener('activate', function (event) {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', function () {
  // Passthrough: requests go directly to the network.
  // Offline caching is intentionally not implemented.
})
