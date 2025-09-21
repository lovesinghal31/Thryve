import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { createInstitute } from '../../features/institutes/api'
import { pushToast } from '../../components/ui/Toast'

const schema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  contactEmail: z.string().email(),
  contactPhone: z.string().min(5),
  website: z.string().url().optional().or(z.literal('').transform(() => undefined)),
})

const Institutes = () => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (values) => {
    try {
      await createInstitute(values)
      pushToast({ message: 'Institute created' })
      reset()
    } catch (e) {
      pushToast({ message: e?.response?.data?.message || 'Failed to create', variant: 'error' })
    }
  }

  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-xl font-semibold text-white">Add Institute</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-3 sm:grid-cols-2 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
        <Input label="Name" {...register('name')} error={errors.name?.message} />
        <Input label="Website" placeholder="https://example.edu" {...register('website')} error={errors.website?.message} />
        <Input label="Address" className="sm:col-span-2" {...register('address')} error={errors.address?.message} />
        <Input label="Contact Email" type="email" {...register('contactEmail')} error={errors.contactEmail?.message} />
        <Input label="Contact Phone" {...register('contactPhone')} error={errors.contactPhone?.message} />
        <div className="sm:col-span-2">
          <Button type="submit" disabled={isSubmitting}>Create</Button>
        </div>
      </form>
    </div>
  )
}

export default Institutes
