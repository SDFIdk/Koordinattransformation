export const crsGet = '/v1.2/crs/'
export const transGet = '/v1.2/trans/'

export const environmentAPIDomains = {
  development: process.env.VUE_APP_API_BASEURL,
  staging: process.env.VUE_APP_API_BASEURL,
  production: process.env.VUE_APP_API_BASEURL
}
