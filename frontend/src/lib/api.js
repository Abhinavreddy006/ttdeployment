import axios from 'axios'

export const TOKEN_STORAGE_KEY = 'healthsetu_token'

const rawBaseURL = import.meta.env.VITE_API_BASE_URL || ''
const baseURL = rawBaseURL.replace(/\/+$/, '')

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY)
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const method = error.config?.method?.toLowerCase()

    // 403 means the server understood the session but denied this operation.
    // Only 401 indicates that the saved authentication is no longer valid.
    if (status === 401 && method !== 'options') {
      localStorage.removeItem(TOKEN_STORAGE_KEY)
      if (
        error.config?.url !== '/api/v1/auth/login' &&
        window.location.pathname !== '/login'
      ) {
        window.location.assign('/login?session=expired')
      }
    }
    return Promise.reject(error)
  },
)

function errorMessage(error) {
  const responseData = error.response?.data
  if (typeof responseData === 'string' && responseData.trim()) return responseData
  if (responseData?.message) return responseData.message
  return error.message || 'The request could not be completed.'
}

export async function apiRequest(path, options = {}) {
  try {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`
    const response = await api.request({
      ...options,
      url: normalizedPath,
      data: options.body
        ? typeof options.body === 'string'
          ? JSON.parse(options.body)
          : options.body
        : options.data,
      headers: {
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...options.headers,
      },
    })
    return response.data
  } catch (error) {
    throw new Error(errorMessage(error), { cause: error })
  }
}

export default api
