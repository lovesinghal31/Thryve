"use client";
import { useQuery } from '@tanstack/react-query';
import { listUsers } from '@/lib/api/users';
import type { UserListQuery, PaginatedResult, User } from '@/types/api';

export function useUsers(params: UserListQuery) {
  return useQuery<PaginatedResult<User>, Error>({
    queryKey: ['users', params],
    queryFn: () => listUsers(params),
    // React Query v5: use placeholderData or structuralSharing instead of keepPreviousData
    placeholderData: (prev) => prev, // show last page while loading new
    staleTime: 15_000,
  });
}
