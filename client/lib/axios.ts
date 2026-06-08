import axios from "axios";

const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

const axiosInstance = axios.create({
  baseURL: backendURL,
  withCredentials: true, // Crucial for HTTP-only cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// --- Token Rotation State ---
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    // --- Token Rotation Logic ---
    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, wait for it to finish and then retry this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => axiosInstance(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh the token using the same base URL as the instance
        const refreshUrl = `${axiosInstance.defaults.baseURL}/api/auth/v1/refresh-token`;
        await axios.post(refreshUrl, {}, { withCredentials: true });
        
        processQueue(null);
        isRefreshing = false;

        // Retry the original request
        return axiosInstance(originalRequest);
      } catch (refreshError: any) {
        processQueue(refreshError, null);
        isRefreshing = false;

        // Only redirect to login if the refresh itself was an authentication failure
        const refreshStatus = refreshError.response?.status;
        if (refreshStatus === 401 || refreshStatus === 403 || refreshStatus === 400) {
          if (typeof window !== "undefined") {
            localStorage.removeItem("user");
            window.location.href = "/login";
          }
        }
        
        return Promise.reject(refreshError);
      }
    }

    // --- Centralized Error Logging ---
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    if (!status || status >= 500) {
      console.error(`[API System Error] ${originalRequest.method?.toUpperCase()} ${originalRequest.url}:`, {
        status: status || "NETWORK_ERROR",
        message: error.message || "No error message provided",
      });
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;