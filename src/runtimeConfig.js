// runtime config from window.__CONFIG__ (populated by index.html).
// new vars: add a placeholder in index.html and a key below.

const cfg = (typeof window !== 'undefined' && window.__CONFIG__) || {}

export const config = {
  apiBaseUrl: cfg.VITE_API_BASE_URL || '',
  apiBasePath: cfg.VITE_API_BASE_PATH || '',
  token: cfg.VITE_TOKEN || '',
  dafTokenA: cfg.VITE_DAF_TOKEN_A || '',
  dafTokenB: cfg.VITE_DAF_TOKEN_B || '',
}
