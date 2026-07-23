import axios from "axios";

const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export const axiosServerInstance = axios.create({
  baseURL: backendURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ----------------------------
// Server-Side Token Refresh Interceptor
// Handles 401 in Server Components / Server Services
// ----------------------------
axiosServerInstance.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) return Promise.reject(error);

    const originalRequest = error.config;
    if (!originalRequest) return Promise.reject(error);

    const retryRequest = originalRequest as typeof originalRequest & { _retry?: boolean };
    const status = error.response?.status;

    if (status === 401 && !retryRequest._retry) {
      retryRequest._retry = true;

      try {
        // Dynamically import next/headers (server-only)
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        const refreshToken = cookieStore.get("refreshToken")?.value;

        if (!refreshToken) {
          return Promise.reject(error);
        }

        // Send refreshToken in request body (server can't send cookies automatically)
        const refreshUrl = `${axiosServerInstance.defaults.baseURL}/api/auth/v1/refresh-token`;
        const refreshResponse = await axios.post(
          refreshUrl,
          { refreshToken },
          { headers: { "Content-Type": "application/json" } }
        );

        // Extract the new accessToken from the response body
        const newAccessToken = refreshResponse.data?.data?.tokens?.accessToken;

        if (!newAccessToken) return Promise.reject(error);

        // Retry original request with the new accessToken
        retryRequest.headers = retryRequest.headers ?? {};
        retryRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        return axiosServerInstance(retryRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const axiosInstance = axios.create({
  baseURL: backendURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ----------------------------
// Token Rotation State
// ----------------------------

type FailedRequest = {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
};

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });

  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(error);
    }

    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const status = error.response?.status;

    // Add custom retry property
    const retryRequest = originalRequest as typeof originalRequest & {
      _retry?: boolean;
    };

    // ----------------------------
    // Token Refresh Logic
    // ----------------------------
    if (status === 401 && !retryRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => axiosInstance(retryRequest))
          .catch((err) => Promise.reject(err));
      }

      retryRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshUrl = `${axiosInstance.defaults.baseURL}/api/auth/v1/refresh-token`;

        await axios.post(refreshUrl, {}, { withCredentials: true });

        processQueue(null);
        isRefreshing = false;

        return axiosInstance(retryRequest);
      } catch (refreshError: unknown) {
        processQueue(refreshError, null);
        isRefreshing = false;

        if (axios.isAxiosError(refreshError)) {
          const refreshStatus = refreshError.response?.status;

          if (
            refreshStatus === 400 ||
            refreshStatus === 401 ||
            refreshStatus === 403
          ) {
            if (typeof window !== "undefined") {
              localStorage.removeItem("user");
              window.location.href = "/login";
            }
          }
        }

        return Promise.reject(refreshError);
      }
    }

    // ----------------------------
    // Centralized Error Logging
    // ----------------------------
    if (axios.isCancel(error)) {
      return Promise.reject(error);
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
      );
    }

    return Promise.reject(error);
  }
);