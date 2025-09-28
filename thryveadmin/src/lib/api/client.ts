import axios, { AxiosError } from 'axios';
import type { ApiEnvelope } from '@/types/api';

// NOTE: Customize the base URL via environment variable.
// Define NEXT_PUBLIC_API_BASE_URL in your `.env.local` (e.g., http://localhost:8000/api/v1)
// Fallback uses spec base pieces.
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // include cookies for refresh flows if needed
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach auth token dynamically if stored (you can replace with your auth store / cookie retrieval logic)
apiClient.interceptors.request.use((config) => {
  // TODO: Replace with secure token retrieval (e.g., from secure httpOnly cookie via middleware or server component).
  const token = (typeof window !== 'undefined') ? localStorage.getItem('accessToken') : null;
  if (token) {
    config.headers = config.headers || {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global response error normalization (optional) – unwrap consistent envelope.
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiEnvelope<any>>) => {
    // You could implement refresh-token retry logic here if needed.
    return Promise.reject(error);
  }
);

export function extractData<T>(envelope: ApiEnvelope<T>): T {
  if ((envelope as any).success === false) {
    throw new Error((envelope as any).message || 'API error');
  }
  return (envelope as any).data as T;
}
