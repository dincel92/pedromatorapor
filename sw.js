// PedromatoRapor çevrimdışı önbellek. Güncelleme yayımlarken SURUM değerini değiştirin.
const SURUM = "pedromatorapor-2026-11-06";
const DOSYALAR = ["./", "./index.html", "./manifest.webmanifest", "./icons/icon-192.png", "./icons/icon-512.png", "./icons/maskable-512.png", "./icons/apple-touch-icon.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(SURUM).then(c => c.addAll(DOSYALAR)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== SURUM).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const req = e.request; if (req.method !== "GET") return;
  if (req.mode === "navigate") {
    e.respondWith(fetch(req).then(r => { const k = r.clone(); caches.open(SURUM).then(c => c.put("./index.html", k)); return r; }).catch(() => caches.match("./index.html")));
    return;
  }
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => { if (r.ok || r.type === "opaque") { const k = r.clone(); caches.open(SURUM).then(c => c.put(req, k)); } return r; }).catch(() => hit)));
});
