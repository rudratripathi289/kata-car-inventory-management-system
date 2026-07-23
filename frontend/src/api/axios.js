import axios from 'axios'

/**
 * Pre-configured Axios instance.
 *
 * - baseURL reads from VITE_API_BASE_URL (falls back to '/api' which
 *   is proxied to the backend via vite.config.js in development).
 * - Interceptors can be added below for auth tokens, error handling, etc.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// ── Request interceptor ──────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// ── Response interceptor ─────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized globally (e.g., redirect to login)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token')
      // window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default api
