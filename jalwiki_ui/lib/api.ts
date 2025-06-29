import axios, {
  AxiosInstance,
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios';

// --- Axios Instance Creation ---
const api: AxiosInstance = axios.create({
  // Point DIRECTLY to your backend API URL
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api', // Use direct backend URL
  headers: {
    'Content-Type': 'application/json',
  },
  // withCredentials: true, // <-- REMOVE or set to false
});

// --- Interceptors (Client-Side Only) ---
if (typeof window !== 'undefined') {

  // --- Request Interceptor: Add Auth Token from localStorage ---
  api.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
      // Read token from localStorage
      const token = localStorage.getItem('accessToken'); // <-- Read from localStorage
      if (token && config.headers) {
        config.headers['Authorization'] = `Bearer ${token}`;
        console.log("API Interceptor: Added auth token from localStorage.");
      } else {
        console.log("API Interceptor: No auth token found in localStorage.");
      }
      return config;
    },
    (error: AxiosError) => {
        console.error("API Request Interceptor Error:", error);
        return Promise.reject(error);
    }
  );

  // --- Response Interceptor: Handle 401 Unauthorized ---
  api.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse => response,
    async (error: AxiosError) => {
      console.log("API Response Interceptor: Checking error status:", error.response?.status);

      if (error.response?.status === 401) {
        console.warn("API Response Interceptor: Received 401 Unauthorized. Clearing localStorage and redirecting.");

        // Clear authentication data from localStorage
        localStorage.removeItem('accessToken'); // <-- Clear localStorage
        localStorage.removeItem('userId');
        localStorage.removeItem('username');

        // Perform a hard redirect to the login page
        window.location.href = '/auth'; // Redirect

        return Promise.reject(new Error("Unauthorized (401) - Redirecting to login."));
      }

      // Handle other errors
      console.error("API Response Interceptor Error (Non-401):", error.message, error.response?.data);
      return Promise.reject(error);
    }
  );
}

export { api };