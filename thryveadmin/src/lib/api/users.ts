import { apiClient, extractData } from './client';
import type { ApiEnvelope, PaginatedResult, User, UserListQuery, PublicUserProfile } from '@/types/api';

export async function listUsers(query: UserListQuery = {}): Promise<PaginatedResult<User>> {
  // Backend expects: page, limit, role, q, institutionId
  const res = await apiClient.get<ApiEnvelope<PaginatedResult<User>>>('/users', { params: query });
  return extractData(res.data);
}

export async function revokeUserSessions(userId: string): Promise<void> {
  const res = await apiClient.post<ApiEnvelope<Record<string, never>>>(`/users/${userId}/revoke-sessions`);
  extractData(res.data);
}

export async function getPublicUser(userId: string): Promise<PublicUserProfile> {
  const res = await apiClient.get<ApiEnvelope<PublicUserProfile>>(`/users/public/${userId}`);
  return extractData(res.data);
}

export interface UserActivitySummary {
  // currently unspecified fields; placeholder for potential use.
  [key: string]: unknown;
}

export async function getUserActivitySummary(): Promise<UserActivitySummary> {
  const res = await apiClient.get<ApiEnvelope<UserActivitySummary>>('/users/activity/summary');
  return extractData(res.data);
}
