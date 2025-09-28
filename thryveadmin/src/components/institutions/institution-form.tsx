"use client";
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { addInstitution } from '@/lib/api/institutions';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

const schema = z.object({
  name: z.string().min(2),
  address: z.string().min(2),
  contactEmail: z.string().email(),
  contactPhone: z.string().min(5),
  website: z.string().url(),
});

export type InstitutionFormValues = z.infer<typeof schema>;

export function InstitutionForm() {
  const form = useForm<InstitutionFormValues>({ resolver: zodResolver(schema), defaultValues: { name: '', address: '', contactEmail: '', contactPhone: '', website: '' } });
  const mutation = useMutation({
    mutationFn: addInstitution,
    onSuccess: (data) => {
      toast.success(`Institution created: ${data.institueName}`);
      form.reset();
    },
    onError: (err: any) => toast.error(err.message || 'Failed to create institution'),
  });

  function onSubmit(values: InstitutionFormValues) {
    mutation.mutate(values);
  }

  return (
    <form className="space-y-4 max-w-lg" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid gap-1">
        <label className="text-xs font-medium">Name</label>
        <Input {...form.register('name')} />
        {form.formState.errors.name && <p className="text-xs text-red-600">{form.formState.errors.name.message}</p>}
      </div>
      <div className="grid gap-1">
        <label className="text-xs font-medium">Address</label>
        <Input {...form.register('address')} />
        {form.formState.errors.address && <p className="text-xs text-red-600">{form.formState.errors.address.message}</p>}
      </div>
      <div className="grid gap-1">
        <label className="text-xs font-medium">Contact Email</label>
        <Input type="email" {...form.register('contactEmail')} />
        {form.formState.errors.contactEmail && <p className="text-xs text-red-600">{form.formState.errors.contactEmail.message}</p>}
      </div>
      <div className="grid gap-1">
        <label className="text-xs font-medium">Contact Phone</label>
        <Input {...form.register('contactPhone')} />
        {form.formState.errors.contactPhone && <p className="text-xs text-red-600">{form.formState.errors.contactPhone.message}</p>}
      </div>
      <div className="grid gap-1">
        <label className="text-xs font-medium">Website</label>
        <Input {...form.register('website')} />
        {form.formState.errors.website && <p className="text-xs text-red-600">{form.formState.errors.website.message}</p>}
      </div>
      <Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? 'Submitting...' : 'Create Institution'}</Button>
    </form>
  );
}
