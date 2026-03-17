import { getAssetFromKV } from '@cloudflare/kv-asset-handler'

addEventListener('fetch', event => {
  try {
    event.respondWith(getAssetFromKV(event))
  } catch (e) {
    event.respondWith(new Response('Not Found', { status: 404 }))
  }
})
