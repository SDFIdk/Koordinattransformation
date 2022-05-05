export const crsGet = '/v1.0/crs/'
export const transGet = '/v1.0/trans/'

export const environmentAPIDomains = {
  development: process.env.VUE_APP_API_BASEURL,
  staging: process.env.VUE_APP_API_BASEURL,
  production: process.env.VUE_APP_API_BASEURL
}
