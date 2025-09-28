"use client";
import { useState } from 'react';
import { UsersFilters } from '@/components/users/users-filters';
import { UsersTable } from '@/components/users/users-table';
import { useUsers } from '@/hooks/use-users';
import type { UserRole, PaginatedResult, User } from '@/types/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function UsersPage() {
	const [page, setPage] = useState(1);
	const [filters, setFilters] = useState<{ q?: string; role?: UserRole }>({});

		const { data, isLoading, isError, error } = useUsers({ page, limit: 20, ...filters });
		const usersData = data as PaginatedResult<User> | undefined;
		const effectivePage = usersData?.page ?? page; // fallback if backend always returns 1
		const totalPages = usersData?.pages ?? 1;

		if (process.env.NODE_ENV !== 'production') {
			// eslint-disable-next-line no-console
			console.log('[UsersPage] requestedPage=%s backendPage=%s pages=%s items=%s', page, usersData?.page, usersData?.pages, usersData?.items?.length);
		}

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center justify-between">Users</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<UsersFilters onChange={(f) => { setPage(1); setFilters(f); }} initial={filters} />
					{isError && <div className="text-sm text-red-600">{error.message}</div>}
								<UsersTable
									data={usersData?.items || []}
									page={effectivePage}
									pages={totalPages}
									onPageChange={(p) => {
										if (p !== page) setPage(p);
									}}
									isLoading={isLoading}
								/>
				</CardContent>
			</Card>
		</div>
	);
}