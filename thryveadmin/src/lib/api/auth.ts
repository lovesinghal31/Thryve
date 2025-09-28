import { apiClient, extractData } from './client';
import type {
  ApiEnvelope,
  LoginRequest,
  LoginResponseData,
  RefreshTokenRequest,
  RefreshTokenResponseData,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from '@/types/api';

// POST /api/v1/users/login
export async function login(payload: LoginRequest): Promise<LoginResponseData> {
  const res = await apiClient.post<ApiEnvelope<LoginResponseData>>('/users/login', payload);
  return extractData(res.data);
}

// POST /api/v1/users/refresh-token
export async function refreshToken(payload?: RefreshTokenRequest): Promise<RefreshTokenResponseData> {
  const res = await apiClient.post<ApiEnvelope<RefreshTokenResponseData>>('/users/refresh-token', payload || {});
  return extractData(res.data);
}

// POST /api/v1/users/logout (returns empty data object per spec)
export async function logout(): Promise<void> {
  const res = await apiClient.post<ApiEnvelope<Record<string, never>>>('/users/logout', {});
  extractData(res.data);
}

// POST /api/v1/users/change-password
export async function changePassword(payload: ChangePasswordRequest): Promise<void> {
  const res = await apiClient.post<ApiEnvelope<Record<string, never>>>('/users/change-password', payload);
  extractData(res.data);
}

// POST /api/v1/users/forgot-password
export async function forgotPassword(payload: ForgotPasswordRequest): Promise<void> {
  const res = await apiClient.post<ApiEnvelope<Record<string, never>>>('/users/forgot-password', payload);
  extractData(res.data); // Always 200 regardless of existence
}

// POST /api/v1/users/reset-password
export async function resetPassword(payload: ResetPasswordRequest): Promise<void> {
  const res = await apiClient.post<ApiEnvelope<Record<string, never>>>('/users/reset-password', payload);
  extractData(res.data);
}

// Utility for storing token (simple implementation; replace with more secure pattern if needed)
export function persistAccessToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', token);
    // Mirror into a regular cookie so middleware can read it (NOT secure; replace with httpOnly server-set cookie)
    document.cookie = `accessToken=${token}; path=/; max-age=${60 * 60 * 4}`; // 4h
  }
}

export function clearAccessToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
    document.cookie = 'accessToken=; path=/; max-age=0';
  }
}
