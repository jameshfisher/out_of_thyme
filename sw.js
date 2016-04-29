importScripts('pusher-worker.js')

self.addEventListener('install', function(event) {
  console.log("SW installing")

  event.waitUntil(
    caches.open('v1').then(function(cache) {
      return cache.addAll([
        'herbs/satureja.png',
        'herbs/origanum.png',
        'herbs/salvia.png',
        'herbs/mentha.png',
        'herbs/petroselinum.png',
        'herbs/cichorium.png',
        'herbs/carum.png',
        'herbs/melissa.png',
        'herbs/lavendula.png',
        'herbs/levisticum.png',
        'herbs/calendula.png',
        'herbs/hypericum.png',
        'herbs/tanacetum.png',
        'herbs/linium.png',
        '/'
      ])
    })
    .then(function(){
      return self.skipWaiting()
    })
  )
})



var rack = []
function repopulateRack() {
  return fetch('/rack')
    .then(r => r.json() )
    .then(data => rack = data)
}


self.addEventListener('activate', function(event) {

  console.log("SW activating")

  var cacheWhitelist = ['v1']

  event.waitUntil(
    Promise.all(
      [
        caches.keys().then(function(cacheNames) {
          return Promise.all(
            cacheNames.map(function(cacheName) {
              if (cacheWhitelist.indexOf(cacheName) === -1) {
                return caches.delete(cacheName)
              }
            })
          )
        }),
        repopulateRack()
      ]
    )

  )
})


var rackRe = /\/rack/

self.addEventListener('fetch', function(event) {

  // console.log("fetch event", event)
  // console.log(event.request.url)

  if(rackRe.exec(event.request.url)) {
    console.log("Serving rack from SW:", rack)

    return event.respondWith(new Response(JSON.stringify(rack), {contentType: 'application/json'}))
  }

  event.respondWith(
    caches.match(event.request)
    .then(function(response) {
      if(response){
        return response
      } else {
        return fetch(event.request)
      }
    })
    .catch(function() {
      return fetch(event.request)
    })
  )
})



var pusher = new Pusher('0670ce993de134664470', {
  cluster: 'eu',
  encrypted: true
})

var channel = pusher.subscribe('herbs')
channel.bind('update', function(data) {
  rack = data.full
})
