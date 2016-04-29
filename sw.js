importScripts('pusher-worker.js')

self.addEventListener('install', function(event) {
  console.log("SW installing")

  event.waitUntil(
    caches.open('v1').then(function(cache) {
      return cache.addAll([
        'herbs/_satureja-lg.png',
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
        'herbs_single/calendula.png',
        'herbs_single/carum.png',
        'herbs_single/cichorium.png',
        'herbs_single/hypericum.png',
        'herbs_single/lavendula.png',
        'herbs_single/levisticum.png',
        'herbs_single/linium.png',
        'herbs_single/melissa.png',
        'herbs_single/mentha.png',
        'herbs_single/origanum.png',
        'herbs_single/petroselinum.png',
        'herbs_single/salvia.png',
        'herbs_single/satureja.png',
        'herbs_single/tanacetum.png',
        'immersion.html',
        'tween.js',
        'three.min.js',
        '/'
      ])
    })
    .then(function(){
      return self.skipWaiting()
    })
  )
})



var rack = []
function repopulateRack(noisy) {
  return fetch('/rack')
    .then(r => r.json() )
    .then(data => {
      repopulateRackData(data, noisy)
    })
}

function repopulateRackData (data, noisy) {
    console.log("___", data)

    if(noisy) {

      // if(satureja)

      if(rack.satureja != data.satureja && data.satureja == 'empty'){

        self.registration.showNotification("✨🌿 IMPORTANT MESSAGE 🌿✨", {
          body: `🌿🌿🌿🌿🌿🌿🌿🌿🌿🌿🌿🌿
       YOU'RE OUT OF THYME
🌿🌿🌿🌿🌿🌿🌿🌿🌿🌿🌿🌿`,
          icon: `herbs/_satureja-lg.png`
          // tag: 'my-tag'
        })
      }

      /* The generic (but too noisy?) one
      Object.keys(data).forEach( k => {
        if(rack[k] != data[k]){
          self.registration.showNotification(k, {
            body: `🌿🌿🌿🌿${k} is now ${data[k]}🌿🌿🌿🌿🌿`,
            icon: `herbs/${k}.png`
            // tag: 'my-tag'
          })
        }
      })

      */


    }

    rack = data
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


var rackRe = /\/rack$/

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

  repopulateRackData(data.full, true)
  // rack = data.full
})
