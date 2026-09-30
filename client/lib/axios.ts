import axios from "axios"

const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"

// Server Request Axios Instance (Server Components / Server Services only)

export const axiosServerInstance = axios.create({
  baseURL: backendURL,
  headers: {
    "Content-Type": "application/json",
  },
})

// ----------------------------
// Server-Side Token Refresh Interceptor
// Handles 401 in Server Components / Server Services
// ----------------------------
axiosServerInstance.interceptors.request.use(async (config) => {
  console.log("Server Request:", config.url)

  const { cookies } = await import("next/headers")

  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")?.value

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})

let isServerRefreshing = false
let serverRefreshPromise: Promise<string | null> | null = null

axiosServerInstance.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) return Promise.reject(error)

    const originalRequest = error.config
    if (!originalRequest) return Promise.reject(error)

    const retryRequest = originalRequest as typeof originalRequest & {
      _retry?: boolean
    }
    const status = error.response?.status

    if (status === 401 && !retryRequest._retry) {
      retryRequest._retry = true

      try {
        if (!isServerRefreshing) {
          isServerRefreshing = true
          serverRefreshPromise = (async () => {
            try {
              const { cookies } = await import("next/headers")
              const cookieStore = await cookies()
              const refreshToken = cookieStore.get("refreshToken")?.value

              if (!refreshToken) return null

              const refreshUrl = `${axiosServerInstance.defaults.baseURL}/api/auth/v1/refresh-token`
              const refreshResponse = await axios.post(
                refreshUrl,
                { refreshToken },
                { headers: { "Content-Type": "application/json" } }
              )

              return refreshResponse.data?.data?.tokens?.accessToken || null
            } catch (refreshErr) {
              console.error("========== SERVER TOKEN REFRESH FAILED ==========")
              if (axios.isAxiosError(refreshErr)) {
                console.error("Status:", refreshErr.response?.status)
                console.error("Data:", refreshErr.response?.data)
              } else {
                console.error(refreshErr)
              }
              console.error("===============================================")
              return null
            } finally {
              isServerRefreshing = false
              serverRefreshPromise = null
            }
          })()
        }

        const newAccessToken = await serverRefreshPromise

        if (!newAccessToken) {
          return Promise.reject(error)
        }

        // Retry original request with the new accessToken
        retryRequest.headers = retryRequest.headers ?? {}
        retryRequest.headers["Authorization"] = `Bearer ${newAccessToken}`

        return axiosServerInstance(retryRequest)
      } catch (refreshError) {
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

// Client Request Axios Instance

export const axiosInstance = axios.create({
  baseURL: backendURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

// ----------------------------
// Token Rotation State
// ----------------------------

type FailedRequest = {
  resolve: (value?: unknown) => void
  reject: (reason?: unknown) => void
}

let isRefreshing = false
let failedQueue: FailedRequest[] = []

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error)
    } else {
      promise.resolve(token)
    }
  })

  failedQueue = []
}

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(error)
    }

    const originalRequest = error.config

    if (!originalRequest) {
      return Promise.reject(error)
    }

    const status = error.response?.status

    // Add custom retry property
    const retryRequest = originalRequest as typeof originalRequest & {
      _retry?: boolean
    }

    // ----------------------------
    // Token Refresh Logic
    // ----------------------------
    if (status === 401 && !retryRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(() => axiosInstance(retryRequest))
          .catch((err) => Promise.reject(err))
      }

      retryRequest._retry = true
      isRefreshing = true

      try {
        const refreshUrl = `${axiosInstance.defaults.baseURL}/api/auth/v1/refresh-token`

        await axios.post(refreshUrl, {}, { withCredentials: true })

        processQueue(null)
        isRefreshing = false

        return axiosInstance(retryRequest)
      } catch (refreshError: unknown) {
        processQueue(refreshError, null)
        isRefreshing = false

        if (axios.isAxiosError(refreshError)) {
          const refreshStatus = refreshError.response?.status

          if (
            refreshStatus === 400 ||
            refreshStatus === 401 ||
            refreshStatus === 403
          ) {
            if (typeof window !== "undefined") {
              localStorage.removeItem("user")
              window.location.href = "/login"
            }
          }
        }

        return Promise.reject(refreshError)
      }
    }

    // ----------------------------
    // Centralized Error Logging
    // ----------------------------
    if (axios.isCancel(error)) {
      return Promise.reject(error)
    }

    if (!status || status >= 500) {
      console.error(
        `[API System Error] ${originalRequest.method?.toUpperCase()} ${
          originalRequest.url
        }`,
        {
          status: status || "NETWORK_ERROR",
          message: error.message || "No error message provided",
        }
      )
    }

    return Promise.reject(error)
  }
)
