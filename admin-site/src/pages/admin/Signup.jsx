import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { useAuth } from '../../features/auth/useAuth'
import { useNavigate, Link } from 'react-router-dom'
import { pushToast } from '../../components/ui/Toast'

const signupSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3),
  password: z.string().min(6),
  institute: z.string().min(1),
})

const otpSchema = z.object({
  email: z.string().email(),
  otp: z.string().min(4),
})

const Signup = () => {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const auth = useAuth()
  const navigate = useNavigate()

  const form1 = useForm({ resolver: zodResolver(signupSchema) })
  const form2 = useForm({ resolver: zodResolver(otpSchema), defaultValues: { email } })

  const onSubmit1 = async (values) => {
    try {
      await auth.registerWithOtp(values)
      setEmail(values.email)
      form2.setValue('email', values.email)
      setStep(2)
      pushToast({ message: 'OTP sent to your email' })
    } catch (e) {
      pushToast({ message: e?.response?.data?.message || 'Failed to request OTP', variant: 'error' })
    }
  }

  const onSubmit2 = async (values) => {
    try {
      const { user } = await auth.verifyOtp(values)
      if (user?.role !== 'admin') {
        pushToast({ message: 'Admin role required to access panel', variant: 'error' })
        return
      }
      pushToast({ message: 'Signup complete' })
      navigate('/admin/dashboard')
    } catch (e) {
      pushToast({ message: e?.response?.data?.message || 'OTP verification failed', variant: 'error' })
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md rounded-xl border border-white/10 bg-white/5 p-6 text-white backdrop-blur-xl">
        <h1 className="mb-4 text-xl font-semibold text-white">Admin Signup</h1>
        {step === 1 ? (
          <form onSubmit={form1.handleSubmit(onSubmit1)} className="space-y-3">
            <Input label="Email" type="email" {...form1.register('email')} error={form1.formState.errors.email?.message} />
            <Input label="Username" {...form1.register('username')} error={form1.formState.errors.username?.message} />
            <Input label="Password" type="password" {...form1.register('password')} error={form1.formState.errors.password?.message} />
            <Input label="Institute" placeholder="Institute name or ID" {...form1.register('institute')} error={form1.formState.errors.institute?.message} />
            <Button type="submit" disabled={form1.formState.isSubmitting} className="w-full">Request OTP</Button>
          </form>
        ) : (
          <form onSubmit={form2.handleSubmit(onSubmit2)} className="space-y-3">
            <Input label="Email" type="email" readOnly {...form2.register('email')} />
            <Input label="OTP" {...form2.register('otp')} error={form2.formState.errors.otp?.message} />
            <Button type="submit" disabled={form2.formState.isSubmitting} className="w-full">Verify OTP</Button>
          </form>
        )}
        <div className="mt-4 text-center text-sm">
          <Link to="/admin/login" className="text-blue-400 hover:text-blue-300 underline">Back to login</Link>
        </div>
      </div>
    </div>
  )
}

export default Signup
