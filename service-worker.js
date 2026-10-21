"use strict";
// Jarvis AI service worker — versione 2026-10-21-a

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { body: event.data ? event.data.text() : "" };
  }
  // iOS richiede che OGNI push mostri una notifica (userVisibleOnly): showNotification sempre chiamata.
  event.waitUntil(
    self.registration.showNotification(data.title || "Jarvis AI", {
      body: data.body || "Hai ricevuto una nuova notifica.",
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      tag: "jarvis-" + (data.ts || Date.now()),
      data: { url: data.url || "/" },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = new URL(event.notification.data?.url || "/", self.location.origin).href;
  event.waitUntil(
    (async () => {
      const wins = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      for (const c of wins) {
        if (new URL(c.url).origin === self.location.origin) {
          await c.focus();
          if ("navigate" in c) await c.navigate(url).catch(() => {});
          return;
        }
      }
      await self.clients.openWindow(url);
    })()
  );
});
