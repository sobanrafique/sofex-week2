'use strict';

const CACHE_VERSION = 'studenthub-v1-0-0';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;

const APP_SHELL = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './resources.json',
  './manifest.webmanifest'
];

const OFFLINE_FALLBACK = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#6366f1"><meta name="color-scheme" content="light dark"><title>Offline — Student Resource Hub</title><style>
*{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#f8fafc;--fg:#0f172a;--muted:#64748b;--accent:#6366f1;--card:#ffffff;--border:#e2e8f0}
@media (prefers-color-scheme:dark){:root{--bg:#0b1120;--fg:#e2e8f0;--muted:#94a3b8;--accent:#818cf8;--card:#111827;--border:#1f2937}}
html,body{min-height:100dvh;background:var(--bg);color:var(--fg);font-family:system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;line-height:1.5}
body{display:flex;align-items:center;justify-content:center;padding:32px 24px}
.wrap{max-width:520px;text-align:center}
.badge{display:inline-flex;align-items:center;gap:8px;padding:6px 14px;border-radius:999px;background:rgba(99,102,241,0.12);color:var(--accent);font-size:13px;font-weight:600;letter-spacing:0.02em;margin-bottom:24px;border:1px solid rgba(99,102,241,0.25)}
.dot{width:8px;height:8px;border-radius:999px;background:var(--accent);box-shadow:0 0 0 4px rgba(99,102,241,0.15);animation:pulse 1.8s ease-in-out infinite}
@keyframes pulse{0%,100%{opacity:.6;transform:scale(1)}50%{opacity:1;transform:scale(1.15)}}
h1{font-size:clamp(28px,5vw,40px);font-weight:800;letter-spacing:-0.02em;margin-bottom:16px;line-height:1.1}
p{color:var(--muted);font-size:16px;margin-bottom:28px;max-width:420px;margin-left:auto;margin-right:auto}
.card{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:20px;text-align:left;margin-bottom:28px}
.card h2{font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:var(--muted);margin-bottom:12px}
.card ul{list-style:none;display:flex;flex-direction:column;gap:10px}
.card li{font-size:15px;display:flex;align-items:center;gap:10px}
.card li::before{content:"";width:6px;height:6px;border-radius:999px;background:var(--accent);flex-shrink:0;opacity:.7}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:13px 22px;border-radius:12px;font-weight:600;font-size:15px;text-decoration:none;transition:transform .15s ease,box-shadow .15s ease,background .15s ease;background:linear-gradient(135deg,#6366f1,#ec4899);color:#fff;border:0;cursor:pointer;box-shadow:0 10px 30px -10px rgba(99,102,241,0.6)}
.btn:hover{transform:translateY(-1px);box-shadow:0 14px 34px -10px rgba(99,102,241,0.7)}
.btn:active{transform:translateY(0)}
.foot{margin-top:32px;font-size:13px;color:var(--muted)}
@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
</style></head><body><main class="wrap"><span class="badge"><span class="dot"></span>Offline Mode</span><h1>You're offline — but we saved your work.</h1><p>Your saved bookmarks and suggestions are still available on this device. Reconnect to the internet to browse the full library.</p><div class="card"><h2>What still works offline</h2><ul><li>Your saved (bookmarked) resources</li><li>Your submitted suggestions</li><li>Search filters you already used</li></ul></div><button class="btn" onclick="location.reload()">Try reconnecting</button><p class="foot">Student Resource Hub • SafeX University Programs</p></main><script>(function(){if('serviceWorker' in navigator){navigator.serviceWorker.addEventListener('controllerchange',function(){location.reload()});}window.addEventListener('online',function(){location.reload()});})();</script></body></html>`;

function isNavigationRequest(req) {
    return req.mode === 'navigate';
}

function isStaticAsset(url) {
    try {
        const u = new URL(url, self.location.href);
        return APP_SHELL.some(s => {
            const sUrl = new URL(s, self.location.href);
            return u.pathname === sUrl.pathname;
        });
    } catch {
        return false;
    }
}

function cacheFirst(request, cacheName) {
    return caches.open(cacheName).then(cache =>
        cache.match(request).then(cached => {
            if (cached) return cached;
            return fetch(request).then(response => {
                if (response && response.status === 200 && response.type === 'basic') {
                    cache.put(request, response.clone());
                }
                return response;
            });
        })
    );
}

function staleWhileRevalidate(request, cacheName) {
    return caches.open(cacheName).then(cache =>
        cache.match(request).then(cached => {
            const fetchPromise = fetch(request).then(response => {
                if (response && response.status === 200) {
                    cache.put(request, response.clone());
                }
                return response;
            }).catch(() => cached);
            return cached || fetchPromise;
        })
    );
}

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(STATIC_CACHE).then(cache =>
            Promise.all(
                APP_SHELL.map(url =>
                    fetch(url, { credentials: 'same-origin', cache: 'reload' })
                        .then(response => {
                            if (response && response.status === 200) {
                                cache.put(url, response.clone());
                            }
                            return true;
                        })
                        .catch(() => true)
                )
            )
        ).then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter(k => ![STATIC_CACHE, RUNTIME_CACHE].includes(k))
                    .map(k => caches.delete(k))
            )
        ).then(() => self.clients.claim())
    );
});

self.addEventListener('message', event => {
    if (event.data === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

self.addEventListener('fetch', event => {
    const req = event.request;
    if (req.method !== 'GET') return;

    const url = new URL(req.url, self.location.href);
    if (url.origin !== self.location.origin) return;

    if (isNavigationRequest(req)) {
        event.respondWith(
            fetch(req)
                .then(response => {
                    const copy = response.clone();
                    caches.open(RUNTIME_CACHE).then(cache => cache.put(req, copy));
                    return response;
                })
                .catch(() =>
                    caches.match(req).then(cached =>
                        cached || caches.match('./index.html').then(shell =>
                            shell || new Response(OFFLINE_FALLBACK, {
                                status: 200,
                                headers: {
                                    'Content-Type': 'text/html; charset=utf-8',
                                    'Cache-Control': 'no-cache'
                                }
                            })
                        )
                    )
                )
        );
        return;
    }

    if (isStaticAsset(url.href)) {
        event.respondWith(cacheFirst(req, STATIC_CACHE));
        return;
    }

    if (req.destination === 'font' || req.destination === 'image' || req.destination === 'style' || req.destination === 'script') {
        event.respondWith(staleWhileRevalidate(req, RUNTIME_CACHE));
        return;
    }

    event.respondWith(
        fetch(req).catch(() => caches.match(req))
    );
});
