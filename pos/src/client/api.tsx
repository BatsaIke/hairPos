import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuth } from './components/context/AuthProvider';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue: any[] = [];

// Function to process queued requests after token refresh
const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

// Request Interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const { logout } = useAuth(); // Access the logout function

    // Check for 401 errors and retry mechanism
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
            }
            return api.request(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          logout(); // Log the user out if no refresh token is found
          return Promise.reject(error);
        }

        const response = await axios.post(`${baseURL}/auth/refresh-token`, { refreshToken });
        const { token } = response.data;

        localStorage.setItem('token', token);
        processQueue(null, token);
        isRefreshing = false;

        if (originalRequest.headers) {
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
        }
        return api.request(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as AxiosError, null);
        isRefreshing = false;
        logout(); // Log the user out if the refresh fails
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
