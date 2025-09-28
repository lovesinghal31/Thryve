"use client";
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPublicUser, revokeUserSessions } from '@/lib/api/users';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { toast } from 'sonner';

export default function UserDetailPage() {
	const params = useParams<{ id: string }>();
	const userId = params.id;
	const queryClient = useQueryClient();

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ['user', userId],
		queryFn: () => getPublicUser(userId),
		enabled: !!userId,
	});

	const mutation = useMutation({
		mutationFn: () => revokeUserSessions(userId),
		onSuccess: () => {
			toast.success('Sessions revoked');
			queryClient.invalidateQueries({ queryKey: ['users'] });
		},
		onError: (err: any) => toast.error(err.message || 'Failed to revoke sessions'),
	});

	return (
		<div className="space-y-6">
			<Button variant="outline" asChild><Link href="/dashboard/users">← Back</Link></Button>
			<Card>
				<CardHeader>
					<CardTitle>User Detail</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					{isLoading && <div>Loading...</div>}
					{isError && <div className="text-sm text-red-600">{error.message}</div>}
					{data && (
						<div className="grid gap-2 text-sm">
							<div><span className="font-medium">ID:</span> {data._id}</div>
							<div><span className="font-medium">Username:</span> {data.username || '—'}</div>
							<div><span className="font-medium">Pseudoname:</span> {data.pseudoname || '—'}</div>
							<div><span className="font-medium">Role:</span> {data.role}</div>
							<div><span className="font-medium">Institution:</span> {data.institutionId || '—'}</div>
						</div>
					)}
					<div className="pt-4">
						<Button disabled={mutation.isPending} onClick={() => mutation.mutate()}>
							{mutation.isPending ? 'Revoking...' : 'Revoke Sessions'}
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}