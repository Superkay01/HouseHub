self.addEventListener('push', (event) => {
  let data = {
    title: 'LodgeNext',
    body: 'You have a new notification',
    url: '/',
  }

  try {
    if (event.data) data = { ...data, ...event.data.json() }
  } catch (e) {}

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/Lodgenext_logo__2_-removebg-preview.png',
      badge: '/Lodgenext_logo__2_-removebg-preview.png',
      data: { url: data.url || '/' },
      // Helps Android show it more reliably
      requireInteraction: false,
      vibrate: [120, 80, 120],
      tag: data.tag || 'lodgenext-notification', // replaces older same-tag notifs
      renotify: true,
    })
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = event.notification.data?.url || '/'

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(url)
          return client.focus()
        }
      }
      if (clients.openWindow) return clients.openWindow(url)
    })
  )
})