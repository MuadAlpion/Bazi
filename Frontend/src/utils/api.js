import axios from "axios"
import useUser from "../store/useUser"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // สำคัญ: ส่ง refreshToken cookie
})

// ===== Queue กัน refresh ซ้อน =====
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error)
    else prom.resolve(token)
  })
  failedQueue = []
}

// ===== Request interceptor =====
api.interceptors.request.use(
  (config) => {
    const token = useUser.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ===== Response interceptor =====
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return api(originalRequest)
        })
      }

      isRefreshing = true

      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/auth/refresh`,
          {},
          { withCredentials: true }
        )

        const newToken = res.data.accessToken

        // update zustand
        useUser.getState().setToken(newToken)

        processQueue(null, newToken)

        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return api(originalRequest)

      } catch (err) {
        //processQueue(err, null)
        //useUser.getState().actionLogout()
        //window.location.href = "/goodbye"
        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default api
