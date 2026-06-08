const CACHE_VERSION = "tanita-js-v1";
const APP_SHELL_URLS = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/body-composition-borderless.svg",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/apple-touch-icon.png",
];

const isSameOrigin = (url) => url.origin === self.location.origin;

const getAssetUrlsFromIndexHtml = (html) => {
  const urls = [];
  const attributePattern = /\s(?:href|src)="([^"]+)"/g;

  for (const match of html.matchAll(attributePattern)) {
    const value = match[1];

    if (value === undefined || value.startsWith("http")) {
      continue;
    }

    const url = new URL(value, self.location.origin);
    if (isSameOrigin(url) && url.pathname.startsWith("/assets/")) {
      urls.push(url.pathname);
    }
  }

  return urls;
};

const cacheAppShell = async () => {
  const cache = await caches.open(CACHE_VERSION);
  const indexResponse = await fetch("/index.html", { cache: "no-store" });

  if (indexResponse.ok) {
    await cacheIndexWithAssets(cache, indexResponse);
  }

  await cache.addAll(APP_SHELL_URLS);
};

const cacheIndexWithAssets = async (cache, indexResponse) => {
  const indexHtml = await indexResponse.clone().text();
  const assetUrls = getAssetUrlsFromIndexHtml(indexHtml);

  await cache.addAll(assetUrls);
  await cache.put("/index.html", indexResponse);
};

const deleteOldCaches = async () => {
  const cacheNames = await caches.keys();
  const deletions = cacheNames
    .filter((cacheName) => cacheName !== CACHE_VERSION)
    .map((cacheName) => caches.delete(cacheName));

  await Promise.all(deletions);
};

const fetchFromCacheFirst = async (request) => {
  const cachedResponse = await caches.match(request);

  if (cachedResponse !== undefined) {
    return cachedResponse;
  }

  const response = await fetch(request);

  if (response.ok) {
    const cache = await caches.open(CACHE_VERSION);
    await cache.put(request, response.clone());
  }

  return response;
};

const fetchNavigation = async (request) => {
  try {
    const response = await fetch(request);

    if (response.ok) {
      const cache = await caches.open(CACHE_VERSION);
      await cacheIndexWithAssets(cache, response.clone());
    }

    return response;
  } catch {
    const cachedIndex = await caches.match("/index.html");

    if (cachedIndex !== undefined) {
      return cachedIndex;
    }

    return caches.match("/");
  }
};

self.addEventListener("install", (event) => {
  event.waitUntil(cacheAppShell().then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(deleteOldCaches().then(() => self.clients.claim()));
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  if (event.request.method !== "GET" || !isSameOrigin(url)) {
    return;
  }

  if (event.request.mode === "navigate") {
    event.respondWith(fetchNavigation(event.request));
    return;
  }

  event.respondWith(fetchFromCacheFirst(event.request));
});
