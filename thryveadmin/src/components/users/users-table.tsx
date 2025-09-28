"use client";
import { useState } from 'react';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import type { User } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { revokeUserSessions } from '@/lib/api/users';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import Link from 'next/link';

interface UsersTableProps {
  data: User[];
  page: number;
  pages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export function UsersTable({ data, page, pages, onPageChange, isLoading }: UsersTableProps) {
  const queryClient = useQueryClient();
  const [revokingId, setRevokingId] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      setRevokingId(id);
      await revokeUserSessions(id);
    },
    onSuccess: () => {
      toast.success('Sessions revoked');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to revoke sessions');
    },
    onSettled: () => setRevokingId(null)
  });

  const columns: ColumnDef<User>[] = [
    { accessorKey: 'username', header: 'Username' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'role', header: 'Role' },
    { accessorKey: 'institutionId', header: 'Institution' },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex gap-2">
            <Link href={`/dashboard/users/${user._id}`} className="text-primary text-sm underline">View</Link>
            <Button size="sm" variant="outline" disabled={mutation.isPending && revokingId === user._id} onClick={() => mutation.mutate(user._id)}>
              {mutation.isPending && revokingId === user._id ? 'Revoking...' : 'Revoke Sessions'}
            </Button>
          </div>
        );
      }
    }
  ];

  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(hg => (
              <TableRow key={hg.id}>
                {hg.headers.map(h => (
                  <TableHead key={h.id}>
                    {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={columns.length}>Loading users...</TableCell></TableRow>
            ) : data.length === 0 ? (
              <TableRow><TableCell colSpan={columns.length}>No users found.</TableCell></TableRow>
            ) : (
              table.getRowModel().rows.map(r => (
                <TableRow key={r.id}>
                  {r.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">Page {page} of {pages}</div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>Prev</Button>
          <Button size="sm" variant="outline" disabled={page >= pages} onClick={() => onPageChange(page + 1)}>Next</Button>
        </div>
      </div>
    </div>
  );
}
