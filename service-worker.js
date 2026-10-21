"use strict";

self.addEventListener("push", (event) => {
  let data = {};

  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = {
      title: "Jarvis AI",
      body: event.data ? event.data.text() : "Hai una nuova notifica."
    };
  }

  event.waitUntil(
    self.registration.showNotification(data.title || "Jarvis AI", {
      body: data.body || "Hai ricevuto una nuova notifica.",
      tag: "jarvis-notification",
      data: { url: data.url || "/" }
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url = new URL(
    event.notification.data?.url || "/",
    self.location.origin
  ).href;

  event.waitUntil(
    clients.matchAll({
      type: "window",
      includeUncontrolled: true
    }).then(async (windows) => {
      for (const client of windows) {
        if (new URL(client.url).origin === self.location.origin) {
          await client.focus();
          await client.navigate(url);
          return;
        }
      }

      await clients.openWindow(url);
    })
  );
});
