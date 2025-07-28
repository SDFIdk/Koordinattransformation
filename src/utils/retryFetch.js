const {fetch: originalFetch} = window


//
const retryCriteria = (response) => {
  //magic number, retry on serverside error. Client Side errors (3xx and 4xx) are ignored
  return !response.ok && response.status >= 500
}
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms))


/**
 * @function
 * This function overwrites fetch to retry in case of a 5xx-based error-code. 
 * Important: only to be used with fetch, as post can result in multiple unintended writes. 
 * 
 * It is intended to add stability to hkpn, in case arkivmeta, cockpit, gsearch or another dependency of the site becomes unreliable
 * Solution is based on: https://www.fabiofranchino.com/log/how-to-override-fetch-in-javascript-to-intercept-it/
 * @param {Array} args  (same args as fetch: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
 */
window.fetch = async (...args) => {
  let [resource, config] = args
  
  const method = config?.method || 'GET'

  if(method !== 'GET') {
    console.warn('[retryFetch] POST detected: Koordinatetransformation was not built with POST based workflows in mind. Watch out for possible bugs in state.')
    return originalFetch(resource, config)
  }
  const maxAttempts = 3 
  const delay = 100 //100 ms delay to avoid triggering backoff

  let attempt = 0
  let response 
  while(attempt < maxAttempts) {
    try {
      response = await originalFetch(resource, config) //run fetches consecutively (i.e only when browser has determined that reponse has been resolved)

      if(response.ok || !retryCriteria(response) ){
        return response
      }

    } catch (error) {
      console.error(`[retryFetch] error: ${error}`)
    }
    attempt++
    await wait(delay)
  }
  console.warn(`[retryFetch] warning: fetch failed ${maxAttempts} times. Application proceeds as if service is not available`)
  return response
}