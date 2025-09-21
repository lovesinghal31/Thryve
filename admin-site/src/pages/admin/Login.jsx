import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { useAuth } from '../../features/auth/useAuth'
import { useNavigate, Link } from 'react-router-dom'
import { pushToast } from '../../components/ui/Toast'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

const Login = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) })
  const auth = useAuth()
  const navigate = useNavigate()

  const onSubmit = async (values) => {
    try {
      const { user } = await auth.login(values)
      if (user?.role !== 'admin') {
        pushToast({ message: 'Admin access required', variant: 'error' })
        return
      }
      pushToast({ message: 'Logged in' })
      navigate('/admin/dashboard')
    } catch (e) {
      pushToast({ message: e?.response?.data?.message || 'Login failed', variant: 'error' })
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md rounded-xl border border-white/10 bg-white/5 p-6 text-white backdrop-blur-xl">
        <h1 className="mb-4 text-xl font-semibold text-white">Admin Login</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <Input label="Email" type="email" placeholder="you@example.com" {...register('email')} error={errors.email?.message} />
          <Input label="Password" type="password" {...register('password')} error={errors.password?.message} />
          <Button type="submit" disabled={isSubmitting} className="w-full">{isSubmitting ? 'Signing in…' : 'Sign in'}</Button>
        </form>
        <div className="mt-4 text-center text-sm">
          <Link to="/admin/signup" className="text-blue-400 hover:text-blue-300 underline">Create an admin account</Link>
        </div>
      </div>
    </div>
  )
}

export default Login
