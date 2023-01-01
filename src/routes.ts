import { Router } from '@edgio/core/router'
import shoppingFlowRouteHandler from './shoppingFlowRouteHandler'

export default new Router()
  .match('/', shoppingFlowRouteHandler)
  .match('/:suffix', shoppingFlowRouteHandler)
  .match('/wp-includes/:path*', ({ cache, proxy, removeUpstreamResponseHeader }) => {
    removeUpstreamResponseHeader('set-cookie')
    cache({
      edge: {
        maxAgeSeconds: 60 * 60 * 24 * 365,
      },
    })
    proxy('origin')
  })
  .match('/wp-content/:path*', ({ cache, proxy, removeUpstreamResponseHeader }) => {
    removeUpstreamResponseHeader('set-cookie')
    cache({
      edge: {
        maxAgeSeconds: 60 * 60 * 24 * 365,
      },
    })
    proxy('origin')
  })
  .match(
    '/:path*/:file.:ext(js|mjs|css|png|ico|svg|jpg|jpeg|gif|ttf|woff|otf)',
    ({ cache, proxy, removeUpstreamResponseHeader, setResponseHeader }) => {
      setResponseHeader('cache-control', 'public, max-age=86400')
      removeUpstreamResponseHeader('set-cookie')
      cache({
        edge: {
          maxAgeSeconds: 60 * 60 * 24 * 365,
        },
      })
      proxy('origin')
    }
  )
  .fallback(({ proxy }) => {
    proxy('origin')
  })
