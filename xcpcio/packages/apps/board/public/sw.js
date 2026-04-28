/*
 * Copyright (C) 2018-2026 Modding Craft ZBD Studio.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, write to the Free Software Foundation, Inc.,
 * 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 */

/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */

// Service worker cleanup script for removing PWA functionality
// This SW immediately unregister itself and refreshes all clients

// Skip waiting to activate immediately
self.addEventListener("install", (e) => {
  self.skipWaiting();
});

// Unregister this service worker and reload all pages
self.addEventListener("activate", (e) => {
  console.warn("Unregistering service worker...");
  self.registration.unregister()
    .then(() => {
      // Get all client windows
      return self.clients.matchAll({ includeUncontrolled: true, type: "window" });
    })
    .then((clients) => {
      // Reload each client to complete cleanup
      clients.forEach((client) => {
        if (client.url && "navigate" in client) {
          client.navigate(client.url);
        }
      });
    });
});
