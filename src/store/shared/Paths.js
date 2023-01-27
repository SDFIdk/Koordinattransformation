export const crsGet = '/v1.2/crs/'
export const transGet = '/v1.2/trans/'

export const environmentAPIDomains = {
  development: import.meta.env.VITE_API_BASE_URL,
  staging: import.meta.env.VITE_API_BASE_URL,
  production: import.meta.env.VITE_API_BASE_URL
}
