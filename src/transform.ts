// File: improve-nginx.com/src/transform.ts

import * as cheerio from 'cheerio'
import Request from '@edgio/core/router/Request'
import Response from '@edgio/core/router/Response'

export default function transformResponse(response: Response, request: Request) {
  if (response.body) {
    // Load the HTML into cheerio
    const $ = cheerio.load(response.body)
    // Only optimise for / and /ltl/
    if (request.path == '/' || request.path.includes('/solutions')) {
      // Remove dns-prefetch(es) on the page
      $('[rel="dns-prefetch"]').remove()
      let bodyScripts = $('body script')
      // As the page's style and look
      // isn't affected by JavaScript
      // Move the scripts away from head to the
      // end of the body
      $('head script').each((_, ele) => {
        let temp = $(ele)
        $(ele).remove()
        $('body').append(temp)
      })
      // As we moved away the head scripts
      // We'd also need to move the body scripts
      // after them so that they can load the
      // required libraries first
      bodyScripts.each((_, ele) => {
        let temp = $(ele)
        $(ele).remove()
        $('body').append(temp)
      })
      // Load google fonts without them
      // blocking the rendering completion
      $('head link[href*="googleapis"]').each((i, el) => {
        let temp = $(el)
        temp.attr('media', 'print')
        temp.attr('onload', "this.media='all'")
      })
      // As the page's style isn't affected
      // by their font awesome css,
      // defer the style's load
      $('head link[href*="font-awesome.min.css"]').each((i, el) => {
        let temp = $(el)
        temp.attr('media', 'print')
        temp.attr('onload', "this.media='all'")
      })
    }
    response.body = $.html()
      // Replace =" with ="https://
      .replace(/\=\"\/\//g, '="https://')
      // Replace all https://www.nginx.com with /
      .replace(/https?:\/\/www\.nginx\.com\//g, '/')
      // Replace all https://nginx.com with /
      .replace(/https?:\/\/nginx\.com\//g, '/')
  }
}
