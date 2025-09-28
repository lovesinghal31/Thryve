"use client";
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { UserRole } from '@/types/api';

interface UsersFiltersProps {
  onChange: (filters: { q?: string; role?: UserRole }) => void;
  initial?: { q?: string; role?: UserRole };
}

export function UsersFilters({ onChange, initial }: UsersFiltersProps) {
  const [q, setQ] = useState(initial?.q || '');
  const [role, setRole] = useState<UserRole | undefined>(initial?.role);

  // Debounce search
  useEffect(() => {
    const id = setTimeout(() => {
      onChange({ q: q || undefined, role });
    }, 400);
    return () => clearTimeout(id);
  }, [q, role, onChange]);

  return (
    <div className="flex flex-col md:flex-row gap-3 items-end">
      <div className="flex flex-col gap-1 w-full md:w-64">
        <label className="text-xs font-medium">Search</label>
        <Input placeholder="Search users..." value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <div className="flex flex-col gap-1 w-full md:w-48">
        <label className="text-xs font-medium">Role</label>
        <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
          <SelectTrigger><SelectValue placeholder="All roles" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="superadmin">Superadmin</SelectItem>
            <SelectItem value="counselor">Counselor</SelectItem>
            <SelectItem value="student">Student</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button variant="outline" onClick={() => { setQ(''); setRole(undefined); onChange({}); }}>Reset</Button>
    </div>
  );
}
